import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getAll, remove } from '@/app/actions';
import type { tFuncionarioFormData } from './form-schema';
import { saveFuncionario } from '../actions';
import { Form } from './form';

const { routerPush, fetchCep } = vi.hoisted(() => ({
  routerPush: vi.fn(),
  fetchCep: vi.fn(),
}));

vi.mock('@/app/actions', () => ({
  getAll: vi.fn().mockResolvedValue([]),
  remove: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../actions', () => ({
  saveFuncionario: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/hooks/get-cep', () => ({
  useGetCep: () => ({ fetchCep, loadingCep: false }),
}));

vi.mock('@/components/navigation', () => ({
  Navigation: ({ onDelete }: { onDelete?: () => void }) => (
    <>
      <button type="submit">Save employee</button>
      <button type="button" onClick={() => void onDelete?.()}>
        Delete employee
      </button>
    </>
  ),
}));

vi.mock('@/components/breadcrumb', () => ({
  BreadCrumb: () => null,
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

describe('Funcionario Form', () => {
  const validFuncionario: tFuncionarioFormData = {
    nome: 'Alberto Silva',
    cep: '09078-580',
    numero: '203',
    complemento: 'Sala 2',
    email: 'alberto@example.com',
    rg: '123456789',
    cpf: '529.982.247-25',
    data_nascimento: '01/01/1990',
    data_admissao: '01/01/2020',
    data_recisao: '',
    observacao: 'Equipe clínica',
    telefones: ['(11) 98765-9876'],
    funcoes: ['funcao-id'],
  };

  beforeEach(() => {
    vi.mocked(getAll).mockResolvedValue([]);
    vi.mocked(saveFuncionario).mockResolvedValue(undefined);
    fetchCep.mockResolvedValue(undefined);
  });

  function renderForm(data: Partial<tFuncionarioFormData> = validFuncionario) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <Form {...data} />
      </QueryClientProvider>
    );
  }

  it('renders employee fields and all form tabs', () => {
    renderForm();

    expect(screen.getByRole('textbox', { name: 'Nome' })).toHaveValue(
      'Alberto Silva'
    );
    expect(screen.getByRole('textbox', { name: 'E-mail' })).toHaveValue(
      'alberto@example.com'
    );
    expect(screen.getByRole('textbox', { name: 'CPF' })).toHaveValue(
      '529.982.247-25'
    );
    expect(screen.getByRole('tab', { name: 'Dados' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Telefones' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Funções' })).toBeInTheDocument();
  });

  it('saves valid employee data and redirects to the list', async () => {
    renderForm();

    fireEvent.click(screen.getByRole('button', { name: 'Save employee' }));

    await waitFor(() => {
      expect(saveFuncionario).toHaveBeenCalledWith({
        ...validFuncionario,
        id: '',
      });
    });
    expect(routerPush).toHaveBeenCalledWith('/funcionario');
  });

  it('shows validation errors and does not submit incomplete data', async () => {
    renderForm({});

    fireEvent.click(screen.getByRole('button', { name: 'Save employee' }));

    expect(await screen.findAllByText('Campo obrigatório.')).not.toHaveLength(0);
    expect(saveFuncionario).not.toHaveBeenCalled();
  });

  it('loads function options only when the functions tab is selected', async () => {
    vi.mocked(getAll).mockResolvedValue([
      { id: 'funcao-1', value: 'Protético' },
    ]);
    renderForm();

    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Funções' }), {
      button: 0,
    });

    expect(await screen.findByText('Protético')).toBeInTheDocument();
    expect(getAll).toHaveBeenCalledWith({
      modelKey: 'funcao',
      fields: ['nome'],
      listSheet: true,
    });
  });

  it('deletes an existing employee and redirects to the list', async () => {
    renderForm({ ...validFuncionario, id: 'funcionario-1' });

    fireEvent.click(screen.getByRole('button', { name: 'Delete employee' }));

    await waitFor(() => {
      expect(remove).toHaveBeenCalledWith({
        id: 'funcionario-1',
        modelKey: 'funcionario',
      });
    });
    expect(routerPush).toHaveBeenCalledWith('/funcionario');
  });

  it('looks up the address when a complete postal code is provided', async () => {
    fetchCep.mockResolvedValue({
      logradouro: 'Rua Central',
      localidade: 'Santo André',
      uf: 'SP',
      bairro: 'Centro',
    });
    renderForm();

    await waitFor(() => {
      expect(fetchCep).toHaveBeenCalledWith('09078580');
    });
  });
});
