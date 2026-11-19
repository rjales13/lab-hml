import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getById } from '@/app/actions';
import type { tSecretariaFormData } from './form-schema';
import { SecretariaFormTemplate } from './index';

vi.mock('@/app/actions', () => ({
  getById: vi.fn(),
}));

vi.mock('./form', () => ({
  Form: (data: Partial<tSecretariaFormData>) => (
    <div>
      <span>{data.id}</span>
      <span>{data.nome}</span>
    </div>
  ),
}));

describe('SecretariaFormTemplate', () => {
  it('loads the selected secretary and renders the form', async () => {
    vi.mocked(getById).mockResolvedValue({
      id: 'secretaria-1',
      nome: 'Rafaela Silva',
    });

    const page = await SecretariaFormTemplate({ selectedId: 'secretaria-1' });
    render(page);

    expect(screen.getByText('Secretárias')).toBeInTheDocument();
    expect(screen.getByText('secretaria-1')).toBeInTheDocument();
    expect(screen.getByText('Rafaela Silva')).toBeInTheDocument();
    expect(getById).toHaveBeenCalledWith({
      modelKey: 'secretaria',
      fields: { id: 'secretaria-1' },
    });
  });
});
