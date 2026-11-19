import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { remove } from '@/app/actions';
import { useAuth } from '@/contexts/user-contexts';
import type { tServicoFormData } from './form-schema';
import { saveServico } from '../actions';
import { Form } from './form';

const { routerPush, handleMutation } = vi.hoisted(() => ({
  routerPush: vi.fn(),
  handleMutation: vi.fn(),
}));

vi.mock('@/app/actions', () => ({
  remove: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../actions', () => ({
  saveServico: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/contexts/user-contexts', () => ({
  useAuth: vi.fn(),
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
      <button type="submit">Save service</button>
      <button type="button" onClick={() => void onDelete?.()}>
        Delete service
      </button>
    </>
  ),
}));

vi.mock('@/components/breadcrumb', () => ({
  BreadCrumb: () => null,
}));

vi.mock('@/components/list-tab-content', () => ({
  ListTabContent: ({
    itens,
    fieldForm,
  }: {
    itens: string[];
    fieldForm: string;
  }) => <div>{`${fieldForm}: ${itens.join(', ')}`}</div>,
}));

describe('Servico Form', () => {
  const validServico: tServicoFormData = {
    nome: 'Prótese Dentária',
    valor_sem_nota: ['50,00'],
    valor_com_nota: ['75,25'],
    valor_unicid: ['80,00'],
    valor_pinheros: ['100,00'],
  };

  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isAdmin: true,
    });
    vi.mocked(saveServico).mockResolvedValue(undefined);
    handleMutation.mockImplementation(
      async ({
        mutationFn,
        redirectPath,
      }: {
        mutationFn: () => Promise<unknown>;
        redirectPath: string;
      }) => {
        const result = await mutationFn();
        if (result && typeof result === 'object' && 'error' in result) return;
        routerPush(`/${redirectPath}`);
      }
    );
  });

  function renderForm(data: Partial<tServicoFormData> = validServico) {
    return render(<Form {...data} />);
  }

  it('renders the service name and all price tabs for administrators', () => {
    renderForm();

    expect(screen.getByRole('textbox', { name: 'Nome' })).toHaveValue(
      'Prótese Dentária'
    );
    expect(screen.getByRole('tab', { name: 'Dados' })).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: 'Valores Sem Nota' })
    ).toBeEnabled();
    expect(
      screen.getByRole('tab', { name: 'Valores Com Nota' })
    ).toBeEnabled();
    expect(screen.getByRole('tab', { name: 'Valores Unicid' })).toBeEnabled();
    expect(
      screen.getByRole('tab', { name: 'Valores Pinheros' })
    ).toBeEnabled();
  });

  it('disables price tabs for non-administrators', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
    });
    renderForm();

    expect(screen.getByRole('tab', { name: 'Dados' })).toBeEnabled();
    expect(
      screen.getByRole('tab', { name: 'Valores Sem Nota' })
    ).toBeDisabled();
    expect(
      screen.getByRole('tab', { name: 'Valores Com Nota' })
    ).toBeDisabled();
    expect(screen.getByRole('tab', { name: 'Valores Unicid' })).toBeDisabled();
    expect(
      screen.getByRole('tab', { name: 'Valores Pinheros' })
    ).toBeDisabled();
  });

  it('submits valid service data and redirects to its list', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: 'Save service' }));

    await waitFor(() => {
      expect(saveServico).toHaveBeenCalledWith({
        id: '',
        nome: 'Prótese Dentária',
        valor_sem_nota: [5000],
        valor_com_nota: [7525],
        valor_unicid: [8000],
        valor_pinheros: [10000],
      });
    });
    expect(routerPush).toHaveBeenCalledWith('/servico');
  });

  it('shows validation errors and does not submit incomplete data', async () => {
    renderForm({});
    fireEvent.click(screen.getByRole('button', { name: 'Save service' }));

    expect(await screen.findByText('Campo obrigatório.')).toBeInTheDocument();
    expect(saveServico).not.toHaveBeenCalled();
  });

  it('shows the corresponding price list when its tab is selected', () => {
    renderForm();
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Valores Sem Nota' }), {
      button: 0,
    });

    expect(
      screen.getByText('valor_sem_nota: 50,00')
    ).toBeInTheDocument();
  });

  it('deletes an existing service and redirects to the list', async () => {
    renderForm({ ...validServico, id: 'servico-1' });
    fireEvent.click(screen.getByRole('button', { name: 'Delete service' }));

    await waitFor(() => {
      expect(remove).toHaveBeenCalledWith({
        id: 'servico-1',
        modelKey: 'servico',
      });
    });
    expect(routerPush).toHaveBeenCalledWith('/servico');
  });
});
