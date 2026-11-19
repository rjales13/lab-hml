import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { remove } from '@/app/actions';
import type { tSecretariaFormData } from './form-schema';
import { saveSecretaria } from '../actions';
import { Form } from './form';

const { routerPush } = vi.hoisted(() => ({
  routerPush: vi.fn(),
}));

vi.mock('@/app/actions', () => ({
  remove: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../actions', () => ({
  saveSecretaria: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/hooks/mutation', () => ({
  useMutation: () => ({
    handleMutation: async ({
      mutationFn,
      redirectPath,
    }: {
      mutationFn: () => Promise<unknown>;
      redirectPath: string;
    }) => {
      await mutationFn();
      routerPush(`/${redirectPath}`);
    },
  }),
}));

vi.mock('@/components/navigation', () => ({
  Navigation: ({
    onDelete,
  }: {
    onDelete?: () => void;
  }) => (
    <>
      <button type="submit">Save secretary</button>
      <button type="button" onClick={() => void onDelete?.()}>
        Delete secretary
      </button>
    </>
  ),
}));

vi.mock('@/components/breadcrumb', () => ({
  BreadCrumb: () => null,
}));

vi.mock('@/components/list-tab-content', () => ({
  ListTabContent: () => <div>Phone list</div>,
}));

describe('Secretaria Form', () => {
  const validSecretaria: tSecretariaFormData = {
    nome: 'Rafaela Silva',
    email: 'rafaela@example.com',
    telefones: ['(11) 98765-4321'],
  };

  beforeEach(() => {
    vi.mocked(saveSecretaria).mockResolvedValue(undefined);
  });

  function renderForm(data: Partial<tSecretariaFormData> = validSecretaria) {
    return render(<Form {...data} />);
  }

  it('renders the secretary fields and all form tabs', () => {
    renderForm();

    expect(screen.getByRole('textbox', { name: 'Nome' })).toHaveValue(
      'Rafaela Silva'
    );
    expect(screen.getByRole('textbox', { name: 'E-mail' })).toHaveValue(
      'rafaela@example.com'
    );
    expect(screen.getByRole('tab', { name: 'Dados' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Telefones' })).toBeInTheDocument();
  });

  it('submits valid secretary data and redirects to the list', async () => {
    renderForm();

    fireEvent.click(screen.getByRole('button', { name: 'Save secretary' }));

    await waitFor(() => {
      expect(saveSecretaria).toHaveBeenCalledWith({
        ...validSecretaria,
        id: '',
      });
    });
    expect(routerPush).toHaveBeenCalledWith('/secretaria');
  });

  it('shows validation errors and does not submit incomplete data', async () => {
    renderForm({});

    fireEvent.click(screen.getByRole('button', { name: 'Save secretary' }));

    expect(await screen.findAllByText('Campo obrigatório.')).not.toHaveLength(0);
    expect(saveSecretaria).not.toHaveBeenCalled();
  });

  it('shows the phone list when the phones tab is selected', async () => {
    renderForm();
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Telefones' }), {
      button: 0,
    });

    expect(screen.getByText('Phone list')).toBeInTheDocument();
  });

  it('deletes an existing secretary and redirects to the list', async () => {
    renderForm({ ...validSecretaria, id: 'secretaria-1' });

    fireEvent.click(screen.getByRole('button', { name: 'Delete secretary' }));

    await waitFor(() => {
      expect(remove).toHaveBeenCalledWith({
        id: 'secretaria-1',
        modelKey: 'secretaria',
      });
    });
    expect(routerPush).toHaveBeenCalledWith('/secretaria');
  });
});
