import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getById } from '@/app/actions';
import type { tServicoFormData } from './form-schema';
import { ServicoFormTemplate } from './index';

vi.mock('@/app/actions', () => ({
  getById: vi.fn(),
}));

vi.mock('./form', () => ({
  Form: (data: Partial<tServicoFormData>) => (
    <div>
      <span>{data.id}</span>
      <span>{data.nome}</span>
    </div>
  ),
}));

describe('ServicoFormTemplate', () => {
  it('loads the selected service and renders the form', async () => {
    vi.mocked(getById).mockResolvedValue({
      id: 'servico-1',
      nome: 'Prótese Dentária',
    });

    const page = await ServicoFormTemplate({ selectedId: 'servico-1' });
    render(page);

    expect(screen.getByText('Serviços')).toBeInTheDocument();
    expect(screen.getByText('servico-1')).toBeInTheDocument();
    expect(screen.getByText('Prótese Dentária')).toBeInTheDocument();
    expect(getById).toHaveBeenCalledWith({
      modelKey: 'servico',
      fields: { id: 'servico-1' },
    });
  });
});
