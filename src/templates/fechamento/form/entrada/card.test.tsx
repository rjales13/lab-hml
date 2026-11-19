import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { iFechamentoEntradaItem } from '@/models/fechamento';
import { Card } from './card';

describe('Fechamento entry Card', () => {
  const entrada: iFechamentoEntradaItem = {
    id: 'entrada-123456',
    paciente: 'Maria Silva',
    sumEntrada: 100,
    servicos: [
      {
        id: 'servico-1',
        data: '15/03/2026',
        nome: 'Coroa',
        valor: 10000,
        quantidade: 1,
        repeticao: 0,
        desconto: 0,
        total: 100,
      },
    ],
  };

  it('shows the patient, linked entry id, and its services', () => {
    render(<Card itens={entrada} />);

    expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '123456' })).toHaveAttribute(
      'href',
      '../../../entrada/form/entrada-123456'
    );
    expect(screen.getByText('Coroa')).toBeInTheDocument();
    expect(screen.getAllByText(/R\$\s*100,00/)).toHaveLength(3);
  });

  it('omits the patient label when no patient is provided', () => {
    render(<Card itens={{ ...entrada, paciente: '' }} />);

    expect(screen.queryByText('Paciente:')).not.toBeInTheDocument();
  });
});
