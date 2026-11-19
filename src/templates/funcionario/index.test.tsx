import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getAll } from '@/app/actions';
import { FuncionarioDataTable, FuncionarioListTemplate } from './index';

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

describe('FuncionarioListTemplate', () => {
  it('renders the employee list heading and suspense boundary', () => {
    const template = FuncionarioListTemplate();

    expect(template).toMatchObject({
      props: {
        children: [
          {
            props: {
              title: 'Listagem de Funcionários',
              subtitle: 'Veja todos os funcionários cadastrados',
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

  it('loads employees and configures the table', async () => {
    vi.mocked(getAll).mockResolvedValue([
      { id: 'funcionario-id', nome: 'Alberto Silva' },
    ]);

    const table = await FuncionarioDataTable();
    render(table);

    expect(screen.getByText('Alberto Silva')).toBeInTheDocument();
    expect(screen.getByText('funcionario')).toBeInTheDocument();
    expect(screen.getByText('Filtrar nomes...')).toBeInTheDocument();
    expect(getAll).toHaveBeenCalledWith({
      modelKey: 'funcionario',
      fields: ['nome'],
    });
  });
});
