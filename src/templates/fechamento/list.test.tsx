import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getConsultorioDentista } from './actions';
import { FechamentoDataTable, FechamentoListTemplate } from './list';

vi.mock('./actions', () => ({
  getConsultorioDentista: vi.fn(),
}));

vi.mock('@/components/data-table', () => ({
  DataTable: ({
    data,
    linkBasePath,
    filterPlaceholder,
    param,
  }: {
    data: { id: string; nome: string }[];
    linkBasePath: string;
    filterPlaceholder: string;
    param?: string;
  }) => (
    <div>
      <span>{data[0]?.nome}</span>
      <span>{linkBasePath}</span>
      <span>{filterPlaceholder}</span>
      <span>{param}</span>
    </div>
  ),
}));

describe('FechamentoListTemplate', () => {
  it('renders the heading and a suspense boundary', () => {
    const template = FechamentoListTemplate({ id: 'consultorio-id' });

    expect(template).toMatchObject({
      props: {
        children: [
          {
            props: {
              title: 'Listagem de Fechamento',
              subtitle: 'Veja todos os fechamentos cadastrados',
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

  it('loads open closeout parties without a closeout id', async () => {
    vi.mocked(getConsultorioDentista).mockResolvedValue([
      { id: 'cconsultorio-id', nome: 'Central', cobrança: 'consultorio' },
    ]);

    const table = await FechamentoDataTable({ id: 'consultorio-id' });
    render(table);

    expect(screen.getByText('Central')).toBeInTheDocument();
    expect(screen.getByText('../../fechamento')).toBeInTheDocument();
    expect(screen.getByText('Filtrar datas...')).toBeInTheDocument();
    expect(getConsultorioDentista).toHaveBeenCalledWith({
      id: 'consultorio-id',
      isClosed: false,
    });
  });

  it('passes the closed closeout id to the data table', async () => {
    vi.mocked(getConsultorioDentista).mockResolvedValue([]);

    const table = await FechamentoDataTable({ id: 'a'.repeat(24) });
    render(table);

    expect(getConsultorioDentista).toHaveBeenCalledWith({
      id: 'a'.repeat(24),
      isClosed: true,
    });
    expect(screen.getByText('a'.repeat(24))).toBeInTheDocument();
  });
});
