import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { remove } from '@/app/actions';
import type { tFuncaoFormData } from './form-schema';
import { saveFuncao } from '../actions';
import { Form } from './form';

const { routerPush } = vi.hoisted(() => ({
  routerPush: vi.fn(),
}));

vi.mock('@/app/actions', () => ({
  remove: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../actions', () => ({
  saveFuncao: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/components/navigation', () => ({
  Navigation: ({ onDelete }: { onDelete?: () => void }) => (
    <>
      <button type="submit">Save function</button>
      <button type="button" onClick={() => void onDelete?.()}>
        Delete function
      </button>
    </>
  ),
}));

vi.mock('@/components/breadcrumb', () => ({
  BreadCrumb: () => null,
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

describe('Funcao Form', () => {
  const validFuncao: tFuncaoFormData = { nome: 'Protético' };

  beforeEach(() => {
    vi.mocked(saveFuncao).mockResolvedValue(undefined);
  });

  function renderForm(data: Partial<tFuncaoFormData> = validFuncao) {
    return render(<Form {...data} />);
  }

  it('renders the function name with its initial value', () => {
    renderForm();

    expect(screen.getByRole('textbox', { name: 'Nome' })).toHaveValue(
      'Protético'
    );
  });

  it('submits valid function data and redirects to the list', async () => {
    renderForm();

    fireEvent.click(screen.getByRole('button', { name: 'Save function' }));

    await waitFor(() => {
      expect(saveFuncao).toHaveBeenCalledWith({
        ...validFuncao,
        id: '',
      });
    });
    expect(routerPush).toHaveBeenCalledWith('/funcao');
  });

  it('shows required-field validation and does not submit incomplete data', async () => {
    renderForm({});

    fireEvent.click(screen.getByRole('button', { name: 'Save function' }));

    expect(await screen.findByText('Campo obrigatório.')).toBeInTheDocument();
    expect(saveFuncao).not.toHaveBeenCalled();
  });

  it('deletes an existing function and redirects to the list', async () => {
    renderForm({ ...validFuncao, id: 'funcao-1' });

    fireEvent.click(screen.getByRole('button', { name: 'Delete function' }));

    await waitFor(() => {
      expect(remove).toHaveBeenCalledWith({
        id: 'funcao-1',
        modelKey: 'funcao',
      });
    });
    expect(routerPush).toHaveBeenCalledWith('/funcao');
  });
});
