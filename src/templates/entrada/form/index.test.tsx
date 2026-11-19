import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getById } from '@/app/actions';
import type { tEntradaFormData } from './form-schema';
import { EntradaFormTemplate } from './index';

vi.mock('@/app/actions', () => ({
  getById: vi.fn(),
}));

vi.mock('./form', () => ({
  Form: (data: Partial<tEntradaFormData>) => (
    <div>
      <span>{data.id}</span>
      <span>{data.paciente}</span>
    </div>
  ),
}));

describe('EntradaFormTemplate', () => {
  it('loads the selected entry and renders its form', async () => {
    vi.mocked(getById).mockResolvedValue({
      id: 'entrada-1',
      paciente: 'João da Silva',
    });

    const page = await EntradaFormTemplate({ selectedId: 'entrada-1' });
    render(page);

    expect(screen.getByText('Entradas')).toBeInTheDocument();
    expect(screen.getByText('entrada-1')).toBeInTheDocument();
    expect(screen.getByText('João da Silva')).toBeInTheDocument();
    expect(getById).toHaveBeenCalledWith({
      modelKey: 'entrada',
      fields: { id: 'entrada-1' },
    });
  });
});
