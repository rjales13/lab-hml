import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  getFechamentoByConsultorioDentista,
  getFechamentosByConsultorioOrDentista,
} from '../actions';
import { FechamentoFormTemplate } from './index';

vi.mock('../actions', () => ({
  getFechamentoByConsultorioDentista: vi.fn(),
  getFechamentosByConsultorioOrDentista: vi.fn(),
}));

vi.mock('./form', () => ({
  Form: ({
    idConsultorioDentista,
    fechamentoId,
    type,
  }: {
    idConsultorioDentista: string;
    fechamentoId: string | undefined;
    type: string;
  }) => (
    <div>
      {idConsultorioDentista} {fechamentoId} {type}
    </div>
  ),
}));

describe('FechamentoFormTemplate', () => {
  it('loads consultorio closeout information and the saved additional details', async () => {
    vi.mocked(getFechamentosByConsultorioOrDentista).mockResolvedValue({
      type: 'consultorio',
      nome: 'Central',
      itens: [],
      sumEntradas: 0,
      fechamentoData: new Date('2026-03-01T00:00:00.000Z'),
    });
    vi.mocked(getFechamentoByConsultorioDentista).mockResolvedValue({
      id: 'consultorio-id',
      desconto: [500],
      observacao: 'Acordo',
    });

    const page = await FechamentoFormTemplate({
      selectedId: 'cconsultorio-id',
      fechamentoId: 'fechamento-id',
    });
    render(page);

    expect(screen.getByText('Fechamento')).toBeInTheDocument();
    expect(screen.getByText('consultorio-id fechamento-id consultorio')).toBeInTheDocument();
    expect(getFechamentosByConsultorioOrDentista).toHaveBeenCalledWith({
      id: 'consultorio-id',
      fechamentoId: 'fechamento-id',
      type: 'consultorio',
    });
    expect(getFechamentoByConsultorioDentista).toHaveBeenCalledWith({
      fechamentoId: 'fechamento-id',
      id: 'consultorio-id',
      type: 'consultorio',
    });
  });

  it('loads an open dentist closeout without querying saved details', async () => {
    vi.mocked(getFechamentosByConsultorioOrDentista).mockResolvedValue({
      type: 'dentista',
      nome: 'Dra. Ana',
      itens: [],
      sumEntradas: 0,
      fechamentoData: new Date('2026-03-01T00:00:00.000Z'),
    });

    const page = await FechamentoFormTemplate({
      selectedId: 'ddentista-id',
      fechamentoId: undefined,
    });
    render(page);

    expect(screen.getByText(/dentista-id\s+dentista/)).toBeInTheDocument();
    expect(getFechamentosByConsultorioOrDentista).toHaveBeenCalledWith({
      id: 'dentista-id',
      fechamentoId: undefined,
      type: 'dentista',
    });
    expect(getFechamentoByConsultorioDentista).not.toHaveBeenCalled();
  });
});
