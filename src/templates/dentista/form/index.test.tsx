import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getById } from '@/app/actions';
import type { tDentistaFormData } from './form-schema';
import { DentistaFormTemplate } from './index';

vi.mock('@/app/actions', () => ({
  getById: vi.fn(),
}));

vi.mock('./form', () => ({
  Form: (data: Partial<tDentistaFormData>) => (
    <div>
      <span>{data.id}</span>
      <span>{data.nome}</span>
    </div>
  ),
}));

describe('DentistaFormTemplate', () => {
  it('loads the selected dentist and renders its form', async () => {
    vi.mocked(getById).mockResolvedValue({
      id: 'dentista-1',
      nome: 'Marcelo Jales',
    });

    const page = await DentistaFormTemplate({ selectedId: 'dentista-1' });
    render(page);

    expect(screen.getByText('Dentistas')).toBeInTheDocument();
    expect(screen.getByText('dentista-1')).toBeInTheDocument();
    expect(screen.getByText('Marcelo Jales')).toBeInTheDocument();
    expect(vi.mocked(getById)).toHaveBeenCalledWith({
      modelKey: 'dentista',
      fields: { id: 'dentista-1' },
    });
  });
});
