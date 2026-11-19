import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getAll, remove } from '@/app/actions';
import type { tEntradaFormData } from './form-schema';
import {
  getDentistasByConsultorio,
  getServicos,
  getValoresType,
  saveEntrada,
  saveValoresType,
} from '../actions';
import { Form } from './form';

const { routerPush } = vi.hoisted(() => ({
  routerPush: vi.fn(),
}));

vi.mock('@/app/actions', () => ({
  getAll: vi.fn().mockResolvedValue([]),
  remove: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../actions', () => ({
  getDentistasByConsultorio: vi.fn().mockResolvedValue([]),
  getServicos: vi.fn().mockResolvedValue([]),
  getValoresType: vi.fn().mockResolvedValue('sem-nota'),
  saveEntrada: vi.fn().mockResolvedValue(undefined),
  saveValoresType: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/components/navigation', () => ({
  Navigation: ({ onDelete }: { onDelete?: () => void }) => (
    <>
      <button type="submit">Save entry</button>
      <button type="button" onClick={() => void onDelete?.()}>
        Delete entry
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

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: routerPush }),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Entrada Form', () => {
  const validEntrada: tEntradaFormData = {
    consultorio: 'consultorio-1',
    dentista: 'dentista-1',
    paciente: 'João da Silva',
    observacao: 'Retornar na próxima semana',
    servicos: [],
  };

  beforeEach(() => {
    vi.mocked(getAll).mockResolvedValue([]);
    vi.mocked(getDentistasByConsultorio).mockResolvedValue([]);
    vi.mocked(getServicos).mockResolvedValue([]);
    vi.mocked(getValoresType).mockResolvedValue('sem-nota');
    vi.mocked(saveEntrada).mockResolvedValue(undefined);
    vi.mocked(saveValoresType).mockResolvedValue(undefined);
  });

  function renderForm(data: Partial<tEntradaFormData> = validEntrada) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <Form {...data} />
      </QueryClientProvider>
    );
  }

  it('renders entry fields and both form tabs', async () => {
    renderForm();

    await waitFor(() => {
      expect(getServicos).toHaveBeenCalledWith('sem-nota');
    });
    expect(screen.getByRole('textbox', { name: 'Paciente' })).toHaveValue(
      'João da Silva'
    );
    expect(
      screen.getByRole('textbox', { name: 'Observação' })
    ).toHaveValue('Retornar na próxima semana');
    expect(screen.getByRole('tab', { name: 'Dados' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Serviços' })).toBeInTheDocument();
  });

  it('saves valid entry data and redirects to the list', async () => {
    renderForm();

    await waitFor(() => {
      expect(getServicos).toHaveBeenCalledWith('sem-nota');
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save entry' }));

    await waitFor(() => {
      expect(saveEntrada).toHaveBeenCalledWith({
        ...validEntrada,
        id: '',
      });
    });
    expect(saveValoresType).not.toHaveBeenCalled();
    expect(routerPush).toHaveBeenCalledWith('/entrada');
  });

  it('shows validation errors and does not save incomplete entry data', async () => {
    renderForm({});

    fireEvent.click(screen.getByRole('button', { name: 'Save entry' }));

    expect(await screen.findAllByText('Campo obrigatório.')).not.toHaveLength(0);
    expect(saveEntrada).not.toHaveBeenCalled();
  });

  it('deletes an existing entry through the shared remove action', async () => {
    renderForm({ ...validEntrada, id: 'entrada-1' });

    fireEvent.click(screen.getByRole('button', { name: 'Delete entry' }));

    await waitFor(() => {
      expect(remove).toHaveBeenCalledWith({
        id: 'entrada-1',
        modelKey: 'entrada',
      });
    });
    expect(routerPush).toHaveBeenCalledWith('/entrada');
  });
});
