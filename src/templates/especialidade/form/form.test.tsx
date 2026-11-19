import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { remove } from '@/app/actions';
import type { tEspecialidadeFormData } from './form-schema';
import { saveEspecialidade } from '../actions';
import { Form } from './form';

const { routerPush } = vi.hoisted(() => ({
  routerPush: vi.fn(),
}));

vi.mock('@/app/actions', () => ({
  remove: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../actions', () => ({
  saveEspecialidade: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/components/navigation', () => ({
  Navigation: ({ onDelete }: { onDelete?: () => void }) => (
    <>
      <button type="submit">Save specialty</button>
      <button type="button" onClick={() => void onDelete?.()}>
        Delete specialty
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

describe('Especialidade Form', () => {
  const validEspecialidade: tEspecialidadeFormData = {
    nome: 'Cirurgia Geral',
  };

  beforeEach(() => {
    vi.mocked(saveEspecialidade).mockResolvedValue(undefined);
  });

  function renderForm(data: Partial<tEspecialidadeFormData> = validEspecialidade) {
    return render(<Form {...data} />);
  }

  it('renders the specialty name field with its initial value', () => {
    renderForm();

    expect(screen.getByRole('textbox', { name: 'Nome' })).toHaveValue(
      'Cirurgia Geral'
    );
  });

  it('submits valid specialty data and redirects to the list', async () => {
    renderForm();

    fireEvent.click(screen.getByRole('button', { name: 'Save specialty' }));

    await waitFor(() => {
      expect(saveEspecialidade).toHaveBeenCalledWith({
        ...validEspecialidade,
        id: '',
      });
    });
    expect(routerPush).toHaveBeenCalledWith('/especialidade');
  });

  it('shows the required field validation and does not submit', async () => {
    renderForm({});

    fireEvent.click(screen.getByRole('button', { name: 'Save specialty' }));

    expect(await screen.findByText('Campo obrigatório.')).toBeInTheDocument();
    expect(saveEspecialidade).not.toHaveBeenCalled();
  });

  it('deletes an existing specialty and redirects to the list', async () => {
    renderForm({ ...validEspecialidade, id: 'especialidade-1' });

    fireEvent.click(screen.getByRole('button', { name: 'Delete specialty' }));

    await waitFor(() => {
      expect(remove).toHaveBeenCalledWith({
        id: 'especialidade-1',
        modelKey: 'especialidade',
      });
    });
    expect(routerPush).toHaveBeenCalledWith('/especialidade');
  });
});
