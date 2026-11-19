import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getEntradas } from './actions';
import { EntradaDataTable, EntradaListTemplate } from './index';

vi.mock('./actions', () => ({
  getEntradas: vi.fn(),
}));

vi.mock('@/components/data-table', () => ({
  DataTable: ({
    data,
    linkBasePath,
    filterPlaceholder,
  }: {
    data: { id: string; paciente: string }[];
    linkBasePath: string;
    filterPlaceholder: string;
  }) => (
    <div>
      <span>{data[0]?.paciente}</span>
      <span>{linkBasePath}</span>
      <span>{filterPlaceholder}</span>
    </div>
  ),
}));

describe('EntradaListTemplate', () => {
  const createdAtFilter = { enabled: false, month: 3, year: 2026 };

  it('renders the list heading and filter controls within a suspense boundary', () => {
    const template = EntradaListTemplate({ createdAtFilter });

    expect(template).toMatchObject({
      props: {
        children: [
          {
            props: {
              title: 'Listagem de Entradas',
              subtitle: 'Veja todas as entradas cadastradas',
            },
          },
          {
            props: {
              children: [
                { props: { filter: 'pending', createdAtFilter } },
                {
                  props: {
                    fallback: expect.anything(),
                    children: {
                      props: { filter: 'pending', createdAtFilter },
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

  it('loads entries and configures the table for patient filtering', async () => {
    vi.mocked(getEntradas).mockResolvedValue([
      {
        id: 'entrada-1',
        consultorio: 'Consultório Central',
        dentista: 'Dra. Ana',
        paciente: 'João da Silva',
        created_at: new Date('2026-03-05T00:00:00.000Z'),
      },
    ]);

    const table = await EntradaDataTable({
      filter: 'all',
      createdAtFilter,
    });
    render(table);

    expect(screen.getByText('João da Silva')).toBeInTheDocument();
    expect(screen.getByText('entrada')).toBeInTheDocument();
    expect(screen.getByText('Filtrar pacientes...')).toBeInTheDocument();
    expect(getEntradas).toHaveBeenCalledWith('all', createdAtFilter);
  });
});
