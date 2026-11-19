import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { iFechamentoEntradaItem } from '@/models/fechamento';
import { FechamentoEntradaDashboard } from './dashboard';

describe('FechamentoEntradaDashboard', () => {
  const itens: iFechamentoEntradaItem[] = [
    {
      id: 'entrada-1',
      dentista: 'Dra. Ana',
      consultorio: 'Central',
      paciente: 'Maria Silva',
      servicos: [],
      sumEntrada: 100,
    },
  ];

  it('groups consultorio closeouts by dentist and displays discounts and notes', () => {
    render(
      <FechamentoEntradaDashboard
        type="consultorio"
        nome="Central"
        itens={itens}
        sumEntradas={100}
        desconto={500}
        observacao="Desconto aprovado"
      />
    );

    expect(screen.getByRole('heading', { name: 'Central' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Dra. Ana' })).toBeInTheDocument();
    expect(screen.getByText('Total geral')).toBeInTheDocument();
    expect(screen.getByText('Total com desconto(s)')).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*95,00/)).toBeInTheDocument();
    expect(screen.getByText('Desconto aprovado')).toBeInTheDocument();
  });

  it('groups dentist closeouts by office and uses a fallback for missing offices', () => {
    render(
      <FechamentoEntradaDashboard
        type="dentista"
        nome="Dra. Ana"
        itens={[{ ...itens[0], consultorio: undefined }]}
        sumEntradas={0}
      />
    );

    expect(
      screen.getByRole('heading', { name: 'Consultório não encontrado' })
    ).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*0,00/)).toBeInTheDocument();
    expect(screen.queryByText('Total com desconto(s)')).not.toBeInTheDocument();
  });
});
