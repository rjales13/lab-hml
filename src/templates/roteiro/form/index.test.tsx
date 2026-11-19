import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getById } from '@/app/actions';
import type { tRoteiroFormData } from './form-schema';
import { RoteiroFormTemplate } from './index';

vi.mock('@/app/actions', () => ({
  getById: vi.fn(),
}));

vi.mock('./form', () => ({
  Form: (data: Partial<tRoteiroFormData>) => (
    <div>
      <span>{data.id}</span>
      <span>{data.data}</span>
    </div>
  ),
}));

describe('RoteiroFormTemplate', () => {
  it('loads the selected route and renders the form', async () => {
    vi.mocked(getById).mockResolvedValue({
      id: 'roteiro-1',
      data: '2026-07-14',
    });

    const page = await RoteiroFormTemplate({ selectedId: 'roteiro-1' });
    render(page);

    expect(screen.getByText('Roteiros')).toBeInTheDocument();
    expect(screen.getByText('roteiro-1')).toBeInTheDocument();
    expect(screen.getByText('2026-07-14')).toBeInTheDocument();
    expect(getById).toHaveBeenCalledWith({
      modelKey: 'roteiro',
      fields: { id: 'roteiro-1' },
    });
  });
});
