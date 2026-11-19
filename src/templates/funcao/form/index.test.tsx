import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getById } from '@/app/actions';
import type { tFuncaoFormData } from './form-schema';
import { FuncaoFormTemplate } from './index';

vi.mock('@/app/actions', () => ({
  getById: vi.fn(),
}));

vi.mock('./form', () => ({
  Form: (data: Partial<tFuncaoFormData>) => (
    <div>
      <span>{data.id}</span>
      <span>{data.nome}</span>
    </div>
  ),
}));

describe('FuncaoFormTemplate', () => {
  it('loads the selected function and renders its form', async () => {
    vi.mocked(getById).mockResolvedValue({
      id: 'funcao-1',
      nome: 'Protético',
    });

    const page = await FuncaoFormTemplate({ selectedId: 'funcao-1' });
    render(page);

    expect(screen.getByText('Função')).toBeInTheDocument();
    expect(screen.getByText('funcao-1')).toBeInTheDocument();
    expect(screen.getByText('Protético')).toBeInTheDocument();
    expect(getById).toHaveBeenCalledWith({
      modelKey: 'funcao',
      fields: { id: 'funcao-1' },
    });
  });
});
