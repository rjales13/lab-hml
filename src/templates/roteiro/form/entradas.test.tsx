import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Entradas } from './entradas';

describe('Entradas', () => {
  const itens = [
    {
      id: 'entrada-1',
      consultorio: 'Consultório Central',
      dentista: 'Dra. Ana',
      paciente: 'Maria Silva',
      servicos: [
        {
          id: 'service-1',
          nome: 'Coroa',
          roteiro: null,
          fechamento: null,
        },
        {
          id: 'service-2',
          nome: 'Prótese',
          roteiro: 'roteiro-1',
          fechamento: 'fechamento-1',
        },
      ],
    },
  ];

  it('renders entry details and disables already closed services', () => {
    render(
      <Entradas
        itens={itens}
        itensSaved={[]}
        entregue={false}
        handleOnSaveEntradas={vi.fn()}
        handleOnPrint={vi.fn()}
        handleOnEntregue={vi.fn()}
      />
    );

    expect(screen.getByText('Consultório Central')).toBeInTheDocument();
    expect(screen.getByText('Dra. Ana')).toBeInTheDocument();
    expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    expect(screen.getByText('Coroa')).toBeInTheDocument();
    expect(screen.getByText('Prótese')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'entrada-1' })).toHaveAttribute(
      'href',
      '../../entrada/form/entrada-1'
    );
    const [availableService, closedService] = screen.getAllByRole('checkbox');
    expect(availableService).toBeEnabled();
    expect(closedService).toBeDisabled();
    expect(screen.getByTitle('Clique para confirmar entrega')).toBeDisabled();
    expect(screen.getByTitle('imprimir')).toBeDisabled();
  });

  it('saves selected services and enables delivery and printing actions', async () => {
    const handleOnSaveEntradas = vi.fn();
    const handleOnPrint = vi.fn();
    const handleOnEntregue = vi.fn();

    render(
      <Entradas
        itens={itens}
        itensSaved={[]}
        entregue={false}
        handleOnSaveEntradas={handleOnSaveEntradas}
        handleOnPrint={handleOnPrint}
        handleOnEntregue={handleOnEntregue}
      />
    );
    fireEvent.click(screen.getAllByRole('checkbox')[0]);

    await waitFor(() => {
      expect(handleOnSaveEntradas).toHaveBeenLastCalledWith([
        { idEntrada: 'entrada-1', idServicoEntrada: ['service-1'] },
      ]);
    });
    expect(screen.getByTitle('Clique para confirmar entrega')).toBeEnabled();
    expect(screen.getByTitle('imprimir')).toBeEnabled();

    fireEvent.click(screen.getByTitle('Clique para confirmar entrega'));
    fireEvent.click(screen.getByTitle('imprimir'));
    expect(handleOnEntregue).toHaveBeenCalledOnce();
    expect(handleOnPrint).toHaveBeenCalledOnce();
  });

  it('shows loading and empty states', () => {
    const callbacks = {
      handleOnSaveEntradas: vi.fn(),
      handleOnPrint: vi.fn(),
      handleOnEntregue: vi.fn(),
    };

    const { rerender, container } = render(
      <Entradas
        itens={[]}
        itensSaved={[]}
        isLoading
        entregue={false}
        {...callbacks}
      />
    );
    expect(container.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();

    rerender(
      <Entradas
        itens={[]}
        itensSaved={[]}
        entregue={false}
        {...callbacks}
      />
    );
    expect(screen.getByText('Não há registros...')).toBeInTheDocument();
  });
});
