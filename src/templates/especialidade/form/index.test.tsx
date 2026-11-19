import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getById } from '@/app/actions';
import type { tEspecialidadeFormData } from './form-schema';
import { EspecialidadeFormTemplate } from './index';

vi.mock('@/app/actions', () => ({
  getById: vi.fn(),
}));

vi.mock('./form', () => ({
  Form: (data: Partial<tEspecialidadeFormData>) => (
    <div>
      <span>{data.id}</span>
      <span>{data.nome}</span>
    </div>
  ),
}));

describe('EspecialidadeFormTemplate', () => {
  it('loads the selected specialty and renders its form', async () => {
    vi.mocked(getById).mockResolvedValue({
      id: 'especialidade-1',
      nome: 'Cirurgia Geral',
    });

    const page = await EspecialidadeFormTemplate({
      selectedId: 'especialidade-1',
    });
    render(page);

    expect(screen.getByText('Especialidade')).toBeInTheDocument();
    expect(screen.getByText('especialidade-1')).toBeInTheDocument();
    expect(screen.getByText('Cirurgia Geral')).toBeInTheDocument();
    expect(getById).toHaveBeenCalledWith({
      modelKey: 'especialidade',
      fields: { id: 'especialidade-1' },
    });
  });
});
