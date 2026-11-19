import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getAll } from '@/app/actions';
import { ServicoDataTable, ServicoListTemplate } from './index';

vi.mock('@/app/actions', () => ({
  getAll: vi.fn(),
}));

vi.mock('@/components/data-table', () => ({
  DataTable: ({
    data,
    linkBasePath,
    filterPlaceholder,
    sortableFields,
    linkableFields,
  }: {
    data: { id: string; nome: string }[];
    linkBasePath: string;
    filterPlaceholder: string;
    sortableFields: string[];
    linkableFields: string[];
  }) => (
    <div>
      <span>{data[0]?.nome}</span>
      <span>{linkBasePath}</span>
      <span>{filterPlaceholder}</span>
      <span data-testid="sortable-fields">{sortableFields.join(',')}</span>
      <span data-testid="linkable-fields">{linkableFields.join(',')}</span>
    </div>
  ),
}));

describe('ServicoListTemplate', () => {
  it('renders the service list heading and suspense boundary', () => {
    const template = ServicoListTemplate();

    expect(template).toMatchObject({
      props: {
        children: [
          {
            props: {
              title: 'Listagem de Serviços',
              subtitle: 'Veja todos os serviços cadastrados',
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

  it('loads services and configures the table', async () => {
    vi.mocked(getAll).mockResolvedValue([
      { id: 'servico-1', nome: 'Prótese Dentária' },
    ]);

    const table = await ServicoDataTable();
    render(table);

    expect(screen.getByText('Prótese Dentária')).toBeInTheDocument();
    expect(screen.getByText('servico')).toBeInTheDocument();
    expect(screen.getByText('Filtrar nomes...')).toBeInTheDocument();
    expect(screen.getByTestId('sortable-fields')).toHaveTextContent('nome');
    expect(screen.getByTestId('linkable-fields')).toHaveTextContent('nome');
    expect(getAll).toHaveBeenCalledWith({
      modelKey: 'servico',
      fields: ['nome'],
    });
  });
});
