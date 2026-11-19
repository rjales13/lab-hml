import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getAll } from '@/app/actions';
import { ConsultorioDataTable, ConsultorioListTemplate } from './index';

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

describe('ConsultorioListTemplate', () => {
  it('provides the list heading and a suspense boundary', () => {
    const template = ConsultorioListTemplate();

    expect(template).toMatchObject({
      props: {
        children: [
          {
            props: {
              title: 'Listagem de Consultórios',
              subtitle: 'Veja todos os consultórios cadastrados',
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

  it('loads the consultorios and configures the table', async () => {
    vi.mocked(getAll).mockResolvedValue([
      { id: 'consultorio-1', nome: 'Central' },
    ]);

    const table = await ConsultorioDataTable();
    render(table);

    expect(screen.getByText('Central')).toBeInTheDocument();
    expect(screen.getByText('consultorio')).toBeInTheDocument();
    expect(screen.getByText('Filtrar nomes...')).toBeInTheDocument();

    expect(vi.mocked(getAll)).toHaveBeenCalledWith({
      modelKey: 'consultorio',
      fields: ['nome'],
    });
  });
});
