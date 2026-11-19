import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { iFechamentoEntradaServico } from '@/models/fechamento';
import { ServicoRow } from './servico';

describe('ServicoRow', () => {
  const servico: iFechamentoEntradaServico = {
    id: 'servico-1',
    data: '15/03/2026',
    nome: 'Coroa',
    valor: 2500,
    quantidade: 2,
    repeticao: 10,
    desconto: 500,
    total: 45,
  };

  it('renders service details and formatted subtotal', () => {
    render(<ServicoRow servico={servico} />);

    expect(screen.getByText('15/03/2026')).toBeInTheDocument();
    expect(screen.getByText('Coroa')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('10%')).toBeInTheDocument();
    expect(screen.getByText(/-R\$\s*5,00/)).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*45,00/)).toBeInTheDocument();
  });

  it('shows placeholders when repetition and discount are zero', () => {
    render(<ServicoRow servico={{ ...servico, repeticao: 0, desconto: 0 }} />);

    expect(screen.getAllByText('------')).toHaveLength(2);
  });
});
