import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { iFechamentoEntradaItem } from '@/models/fechamento';
import { FechamentoEntradaDataSection } from './data';

describe('FechamentoEntradaDataSection', () => {
  const itens: iFechamentoEntradaItem[] = [
    { id: 'entrada-1', paciente: 'Maria', servicos: [], sumEntrada: 25 },
    { id: 'entrada-2', paciente: 'João', servicos: [], sumEntrada: 50 },
  ];

  it('renders the group name, entries, and sum of entry values', () => {
    render(<FechamentoEntradaDataSection nome="Dra. Ana" itens={itens} />);

    expect(screen.getByRole('heading', { name: 'Dra. Ana' })).toBeInTheDocument();
    expect(screen.getByText('Maria')).toBeInTheDocument();
    expect(screen.getByText('João')).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*75,00/)).toBeInTheDocument();
  });

  it('renders a zero total for an empty group', () => {
    render(<FechamentoEntradaDataSection nome="Dra. Ana" itens={[]} />);

    expect(screen.getByText(/R\$\s*0,00/)).toBeInTheDocument();
  });
});
