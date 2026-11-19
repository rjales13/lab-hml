import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getAll } from '@/app/actions';
import { FuncaoDataTable, FuncaoListTemplate } from './index';

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

describe('FuncaoListTemplate', () => {
  it('renders the list heading and suspense boundary', async () => {
    const template = await FuncaoListTemplate();

    expect(template).toMatchObject({
      props: {
        children: [
          {
            props: {
              title: 'Listagem de Funções',
              subtitle: 'Veja todas as funções cadastradas',
            },
          },
          {
            props: {
              children: {
                props: { fallback: expect.anything() },
              },
            },
          },
        ],
      },
    });
  });

  it('loads functions and configures the table', async () => {
    vi.mocked(getAll).mockResolvedValue([
      { id: 'funcao-1', nome: 'Protético' },
    ]);

    const table = await FuncaoDataTable();
    render(table);

    expect(screen.getByText('Protético')).toBeInTheDocument();
    expect(screen.getByText('funcao')).toBeInTheDocument();
    expect(screen.getByText('Filtrar nomes...')).toBeInTheDocument();
    expect(getAll).toHaveBeenCalledWith({
      modelKey: 'funcao',
      fields: ['nome'],
    });
  });
});
