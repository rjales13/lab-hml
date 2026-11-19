import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getById } from '@/app/actions';
import type { tConsultorioFormData } from './form-schema';
import { ConsultorioFormTemplate } from './index';

vi.mock('@/app/actions', () => ({
  getById: vi.fn(),
}));

vi.mock('./form', () => ({
  Form: (data: Partial<tConsultorioFormData>) => (
    <div>
      <span>{data.id}</span>
      <span>{data.nome}</span>
    </div>
  ),
}));

describe('ConsultorioFormTemplate', () => {
  it('loads the selected consultorio and renders its form', async () => {
    vi.mocked(getById).mockResolvedValue({
      id: 'consultorio-1',
      nome: 'Consultório Central',
    });

    const page = await ConsultorioFormTemplate({ selectedId: 'consultorio-1' });
    render(page);

    expect(screen.getByText('Consultórios')).toBeInTheDocument();
    expect(screen.getByText('consultorio-1')).toBeInTheDocument();
    expect(screen.getByText('Consultório Central')).toBeInTheDocument();

    expect(vi.mocked(getById)).toHaveBeenCalledWith({
      modelKey: 'consultorio',
      fields: { id: 'consultorio-1' },
    });
  });
});
