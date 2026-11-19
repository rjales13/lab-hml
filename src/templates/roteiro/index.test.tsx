import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getRoteiros } from './actions';
import { RoteiroDataTable, RoteiroListTemplate } from './index';

vi.mock('./actions', () => ({
  getRoteiros: vi.fn(),
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
    data: { id: string; data: string; entregue: string }[];
    linkBasePath: string;
    filterableField: string;
    filterPlaceholder: string;
    sortableFields: string[];
    linkableFields: string[];
  }) => (
    <div>
      <span>{data[0]?.data}</span>
      <span>{linkBasePath}</span>
      <span>{filterableField}</span>
      <span>{filterPlaceholder}</span>
      <span>{sortableFields.join(',')}</span>
      <span>{linkableFields.join(',')}</span>
    </div>
  ),
}));

vi.mock('./filters-toolbar', () => ({
  RoteiroFiltersToolbar: () => <div>Filtros de roteiro</div>,
}));

describe('RoteiroListTemplate', () => {
  const createdAtFilter = { enabled: true, month: 7, year: 2026 };

  it('renders the route list heading and filters with the default delivery filter', () => {
    const template = RoteiroListTemplate({ createdAtFilter });

    expect(template).toMatchObject({
      props: {
        children: [
          {
            props: {
              title: 'Listagem de Roteiros',
              subtitle: 'Veja todos os roteiros cadastrados',
            },
          },
          {
            props: {
              children: [
                expect.objectContaining({
                  props: {
                    filter: 'nao',
                    createdAtFilter,
                  },
                }),
                {
                  props: {
                    fallback: expect.anything(),
                    children: {
                      props: {
                        filter: 'nao',
                        createdAtFilter,
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    });
  });

  it('loads filtered routes and configures the table', async () => {
    vi.mocked(getRoteiros).mockResolvedValue([
      {
        id: 'roteiro-1',
        data: '2026-07-14',
        entregue: 'não',
        created_at: new Date('2026-07-01T12:00:00Z'),
      },
    ]);

    const table = await RoteiroDataTable({
      filter: 'nao',
      createdAtFilter,
    });
    render(table);

    expect(screen.getByText('2026-07-14')).toBeInTheDocument();
    expect(screen.getByText('roteiro')).toBeInTheDocument();
    expect(screen.getByText('data')).toBeInTheDocument();
    expect(screen.getByText('Filtrar datas...')).toBeInTheDocument();
    expect(screen.getByText('data,entregue,created_at')).toBeInTheDocument();
    expect(screen.getByText('data,entregue')).toBeInTheDocument();
    expect(getRoteiros).toHaveBeenCalledWith('nao', createdAtFilter);
  });
});
