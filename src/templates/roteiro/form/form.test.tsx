import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { remove } from '@/app/actions';
import {
  getEntradas,
  getEntradasServicos,
  saveRoteiro,
  updateEntradas,
} from '../actions';
import { Form } from './form';

const { routerPush, handleMutation } = vi.hoisted(() => ({
  routerPush: vi.fn(),
  handleMutation: vi.fn(),
}));

vi.mock('@/app/actions', () => ({
  remove: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../actions', () => ({
  getEntradas: vi.fn().mockResolvedValue([]),
  getEntradasServicos: vi.fn().mockResolvedValue([]),
  saveRoteiro: vi.fn().mockResolvedValue(undefined),
  updateEntradas: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/hooks/mutation', () => ({
  useMutation: () => ({ handleMutation }),
}));

vi.mock('@/components/navigation', () => ({
  Navigation: ({
    onDelete,
  }: {
    onDelete?: () => void;
  }) => (
    <>
      <button type="submit">Save route</button>
      <button type="button" onClick={() => void onDelete?.()}>
        Delete route
      </button>
    </>
  ),
}));

vi.mock('@/components/breadcrumb', () => ({
  BreadCrumb: () => null,
}));

vi.mock('./entradas', () => ({
  Entradas: () => <div>Route entries</div>,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: routerPush }),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@react-pdf/renderer', () => ({
  pdf: vi.fn(() => ({ toBlob: vi.fn().mockResolvedValue(new Blob()) })),
}));

vi.mock('@/components/pdf-roteiro', () => ({
  PdfRoteiro: () => null,
}));

describe('Roteiro Form', () => {
  beforeEach(() => {
    vi.mocked(getEntradas).mockResolvedValue([]);
    vi.mocked(getEntradasServicos).mockResolvedValue([]);
    vi.mocked(saveRoteiro).mockResolvedValue(undefined);
    vi.mocked(updateEntradas).mockResolvedValue(undefined);
    vi.mocked(remove).mockResolvedValue(undefined);
    handleMutation.mockResolvedValue(undefined);
  });

  function renderForm(data: Parameters<typeof Form>[0] = {}) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <Form {...data} />
      </QueryClientProvider>
    );
  }

  it('renders route fields and the data and entries tabs', async () => {
    renderForm({ data: '2026-07-14', observacao: 'Rota central' });

    expect(screen.getByLabelText('Data')).toHaveValue('2026-07-14');
    expect(screen.getByRole('textbox', { name: 'Observação' })).toHaveValue(
      'Rota central'
    );
    expect(screen.getByRole('tab', { name: 'Dados' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Entradas' })).toBeInTheDocument();
    await waitFor(() => expect(getEntradas).toHaveBeenCalledWith(''));
  });

  it('validates the required date before saving', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: 'Save route' }));

    expect(await screen.findByText('Campo obrigatório.')).toBeInTheDocument();
    expect(saveRoteiro).not.toHaveBeenCalled();
    expect(handleMutation).not.toHaveBeenCalled();
  });

  it('saves a valid route with the currently selected delivery status', async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText('Data'), {
      target: { value: '2026-07-14' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save route' }));

    await waitFor(() => {
      expect(handleMutation).toHaveBeenCalled();
    });
    const mutation = handleMutation.mock.calls[0]?.[0] as {
      mutationFn: () => Promise<unknown>;
      redirectPath: string;
    };
    expect(mutation.redirectPath).toBe('roteiro');
    await mutation.mutationFn();
    expect(saveRoteiro).toHaveBeenCalledWith(
      {
        id: '',
        data: '2026-07-14',
        entregue: false,
        observacao: '',
      },
      []
    );
  });

  it('clears route associations before deleting an existing route', async () => {
    renderForm({ id: 'roteiro-1', data: '2026-07-14' });
    fireEvent.click(screen.getByRole('button', { name: 'Delete route' }));

    await waitFor(() => {
      expect(updateEntradas).toHaveBeenCalledWith({
        idRoteiro: 'roteiro-1',
        type: 'delete',
      });
      expect(handleMutation).toHaveBeenCalled();
    });
    expect(remove).not.toHaveBeenCalled();
    const mutation = handleMutation.mock.calls[0]?.[0] as {
      mutationFn: () => Promise<unknown>;
    };
    await mutation.mutationFn();
    expect(remove).toHaveBeenCalledWith({
      id: 'roteiro-1',
      modelKey: 'roteiro',
    });
  });
});
