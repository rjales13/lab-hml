import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getAll } from '@/app/actions';
import { SecretariaDataTable, SecretariaListTemplate } from './index';

vi.mock('@/app/actions', () => ({
  getAll: vi.fn(),
}));

vi.mock('@/components/data-table', () => ({
  DataTable: ({
    data,
    linkBasePath,
    filterableField,
    filterPlaceholder,
    sortableFields,
    linkableFields,
  }: {
    data: { id: string; nome: string }[];
    linkBasePath: string;
    filterableField: string;
    filterPlaceholder: string;
    sortableFields: string[];
    linkableFields: string[];
  }) => (
    <div>
      <span>{data[0]?.nome}</span>
      <span>{linkBasePath}</span>
      <span>{filterableField}</span>
      <span>{filterPlaceholder}</span>
      <span data-testid="sortable-fields">{sortableFields.join(',')}</span>
      <span data-testid="linkable-fields">{linkableFields.join(',')}</span>
    </div>
  ),
}));

describe('SecretariaListTemplate', () => {
  it('renders the list heading and suspense boundary', () => {
    const template = SecretariaListTemplate();

    expect(template).toMatchObject({
      props: {
        children: [
          {
            props: {
              title: 'Listagem de Secretárias',
              subtitle: 'Veja todas as secretárias cadastradas',
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

  it('loads secretaries and configures the table', async () => {
    vi.mocked(getAll).mockResolvedValue([
      { id: 'secretaria-1', nome: 'Rafaela Silva' },
    ]);

    const table = await SecretariaDataTable();
    render(table);

    expect(screen.getByText('Rafaela Silva')).toBeInTheDocument();
    expect(screen.getByText('secretaria')).toBeInTheDocument();
    expect(screen.getByText('Filtrar nomes...')).toBeInTheDocument();
    expect(screen.getByTestId('sortable-fields')).toHaveTextContent('nome');
    expect(screen.getByTestId('linkable-fields')).toHaveTextContent('nome');
    expect(getAll).toHaveBeenCalledWith({
      modelKey: 'secretaria',
      fields: ['nome'],
    });
  });
});
