import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { tDentistaFormData } from './form-schema';
import { saveDentista } from '../actions';
import { getAll, remove } from '@/app/actions';
import { Form } from './form';

const { routerPush } = vi.hoisted(() => ({
  routerPush: vi.fn(),
}));

vi.mock('@/app/actions', () => ({
  getAll: vi.fn().mockResolvedValue([]),
  remove: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../actions', () => ({
  saveDentista: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/components/navigation', () => ({
  Navigation: ({
    onDelete,
  }: {
    onDelete?: () => void;
  }) => (
    <>
      <button type="submit">Save dentist</button>
      <button type="button" onClick={() => void onDelete?.()}>
        Delete dentist
      </button>
    </>
  ),
}));

vi.mock('@/components/breadcrumb', () => ({
  BreadCrumb: () => null,
}));

vi.mock('@/components/scroll-to-top', () => ({
  ScrollToTop: () => null,
}));

vi.mock('@/components/list-tab-content', () => ({
  ListTabContent: ({
    commandData,
  }: {
    commandData?: { id: string; value: string }[];
  }) => <div>{commandData?.map(({ id, value }) => <span key={id}>{value}</span>)}</div>,
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

describe('Dentista Form', () => {
  const validDentista: tDentistaFormData = {
    nome: 'Marcelo Jales',
    cro: '20987266',
    email: 'marcelo@example.com',
    telefones: ['(11) 98765-9876'],
    especialidades: ['especialidade-id'],
  };

  beforeEach(() => {
    vi.mocked(saveDentista).mockResolvedValue(undefined);
  });

  function renderForm(data: Partial<tDentistaFormData> = validDentista) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <Form {...data} />
      </QueryClientProvider>
    );
  }

  it('renders dentist fields and all form tabs', () => {
    renderForm();

    expect(screen.getByRole('textbox', { name: 'Nome' })).toHaveValue(
      'Marcelo Jales'
    );
    expect(screen.getByRole('textbox', { name: 'CRO' })).toHaveValue(
      '20987266'
    );
    expect(screen.getByRole('textbox', { name: 'E-mail' })).toHaveValue(
      'marcelo@example.com'
    );
    expect(screen.getByRole('tab', { name: 'Dados' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Telefones' })).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: 'Especialidades' })
    ).toBeInTheDocument();
  });

  it('submits valid dentist data and redirects to the list', async () => {
    renderForm();

    fireEvent.click(screen.getByRole('button', { name: 'Save dentist' }));

    await waitFor(() => {
      expect(saveDentista).toHaveBeenCalledWith({
        ...validDentista,
        id: '',
      });
    });
    expect(routerPush).toHaveBeenCalledWith('/dentista');
  });

  it('shows validation errors and does not submit incomplete data', async () => {
    renderForm({});

    fireEvent.click(screen.getByRole('button', { name: 'Save dentist' }));

    expect(await screen.findAllByText('Campo obrigatório.')).not.toHaveLength(0);
    expect(saveDentista).not.toHaveBeenCalled();
  });

  it('loads specialty options when the specialties tab is selected', async () => {
    vi.mocked(getAll).mockResolvedValue([
      { id: 'especialidade-1', value: 'Ortodontia' },
    ]);
    renderForm();

    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Especialidades' }), {
      button: 0,
    });

    expect(await screen.findByText('Ortodontia')).toBeInTheDocument();
    expect(getAll).toHaveBeenCalledWith({
      modelKey: 'especialidade',
      fields: ['nome'],
      listSheet: true,
    });
  });

  it('deletes an existing dentist and redirects to the list', async () => {
    renderForm({ ...validDentista, id: 'dentista-1' });

    fireEvent.click(screen.getByRole('button', { name: 'Delete dentist' }));

    await waitFor(() => {
      expect(remove).toHaveBeenCalledWith({
        id: 'dentista-1',
        modelKey: 'dentista',
      });
    });
    expect(routerPush).toHaveBeenCalledWith('/dentista');
  });
});
