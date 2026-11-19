import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getById } from '@/app/actions';
import type { tFuncionarioFormData } from './form-schema';
import { FuncionarioFormTemplate } from './index';

vi.mock('@/app/actions', () => ({
  getById: vi.fn(),
}));

vi.mock('./form', () => ({
  Form: (data: Partial<tFuncionarioFormData>) => (
    <div>
      <span>{data.id}</span>
      <span>{data.nome}</span>
    </div>
  ),
}));

describe('FuncionarioFormTemplate', () => {
  it('loads the selected employee and renders the form', async () => {
    vi.mocked(getById).mockResolvedValue({
      id: 'funcionario-1',
      nome: 'Alberto Silva',
    });

    const page = await FuncionarioFormTemplate({
      selectedId: 'funcionario-1',
    });
    render(page);

    expect(screen.getByText('Funcionário')).toBeInTheDocument();
    expect(screen.getByText('funcionario-1')).toBeInTheDocument();
    expect(screen.getByText('Alberto Silva')).toBeInTheDocument();
    expect(getById).toHaveBeenCalledWith({
      modelKey: 'funcionario',
      fields: { id: 'funcionario-1' },
    });
  });
});
