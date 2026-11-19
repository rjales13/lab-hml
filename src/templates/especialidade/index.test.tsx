import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getAll } from '@/app/actions';
import { EspecialidadeDataTable, EspecialidadeListTemplate } from './index';

vi.mock('@/app/actions', () => ({
  getAll: vi.fn(),
}));

vi.mock('@/components/data-table', () => ({
  DataTable: ({
    data,
    linkBasePath,
    filterPlaceholder,
  }: {
    data: { id: string; nome: string }[];
    linkBasePath: string;
    filterPlaceholder: string;
  }) => (
    <div>
      <span>{data[0]?.nome}</span>
      <span>{linkBasePath}</span>
      <span>{filterPlaceholder}</span>
    </div>
  ),
}));

describe('EspecialidadeListTemplate', () => {
  it('renders the list heading and a suspense boundary', async () => {
    const template = await EspecialidadeListTemplate();

    expect(template).toMatchObject({
      props: {
        children: [
          {
            props: {
              title: 'Listagem de Especialidades',
              subtitle: 'Veja todas as especialidades cadastradas',
            },
          },
          {
            props: {
              children: {
                props: {
                  fallback: expect.anything(),
                },
              },
            },
          },
        ],
      },
    });
  });

  it('loads the specialties and configures the table', async () => {
    vi.mocked(getAll).mockResolvedValue([
      { id: 'especialidade-1', nome: 'Cirurgia Geral' },
    ]);

    const table = await EspecialidadeDataTable();
    render(table);

    expect(screen.getByText('Cirurgia Geral')).toBeInTheDocument();
    expect(screen.getByText('especialidade')).toBeInTheDocument();
    expect(screen.getByText('Filtrar nomes...')).toBeInTheDocument();
    expect(getAll).toHaveBeenCalledWith({
      modelKey: 'especialidade',
      fields: ['nome'],
    });
  });
});
