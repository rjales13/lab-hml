import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { iFechamentoEntradaProps } from '@/models/fechamento';
import { saveFechamento } from '../actions';
import { Form } from './form';

const { handleMutation, pdfToBlob, navigationProps } = vi.hoisted(() => ({
  handleMutation: vi.fn(),
  pdfToBlob: vi.fn(),
  navigationProps: vi.fn(),
}));

vi.mock('../actions', () => ({
  saveFechamento: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/hooks/mutation', () => ({
  useMutation: () => ({ handleMutation }),
}));

vi.mock('@/components/breadcrumb', () => ({
  BreadCrumb: () => null,
}));

vi.mock('@/components/scroll-to-top', () => ({
  ScrollToTop: () => null,
}));

vi.mock('@/components/navigation', () => ({
  Navigation: (props: { navigation: { nav: string }[]; onPrint: () => void }) => {
    navigationProps(props);
    return (
      <>
        <button type="submit">Save closeout</button>
        <button type="button" onClick={props.onPrint}>
          Print closeout
        </button>
      </>
    );
  },
}));

vi.mock('@/components/list-tab-content', () => ({
  ListTabContent: ({ itens }: { itens: number[] }) => (
    <div>Discount entries: {itens.join(',')}</div>
  ),
}));

vi.mock('@/components/pdf-fechamento', () => ({
  PdfFechamento: () => null,
}));

vi.mock('@react-pdf/renderer', () => ({
  pdf: () => ({ toBlob: pdfToBlob }),
}));

describe('Fechamento Form', () => {
  const result: iFechamentoEntradaProps = {
    type: 'consultorio',
    nome: 'Central',
    itens: [],
    sumEntradas: 100,
    fechamentoData: new Date('2026-03-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    handleMutation.mockImplementation(
      async ({ mutationFn }: { mutationFn: () => Promise<unknown> }) =>
        mutationFn()
    );
    pdfToBlob.mockResolvedValue(new Blob());
  });

  it('renders the closeout dashboard and keeps save/print actions unavailable for an open closeout', () => {
    render(
      <Form
        result={result}
        idConsultorioDentista="consultorio-id"
        fechamentoId={undefined}
        type="consultorio"
      />
    );

    expect(screen.getByRole('heading', { name: 'Central' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Dados' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Descontos' })).toBeDisabled();
    expect(navigationProps).toHaveBeenCalledWith(
      expect.objectContaining({
        navigation: [{ nav: 'voltar', applyDisable: false, action: 'goBack' }],
      })
    );
  });

  it('saves normalized discounts and observation for a closed closeout', async () => {
    handleMutation.mockImplementation(
      async ({ mutationFn }: { mutationFn: () => Promise<unknown> }) =>
        mutationFn()
    );
    render(
      <Form
        result={result}
        idConsultorioDentista="consultorio-id"
        fechamentoId="fechamento-id"
        type="consultorio"
        data={{ desconto: ['R$ 5,00', 250], observacao: 'Acordo' }}
      />
    );

    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Observação' }), {
      button: 0,
    });
    fireEvent.click(screen.getByRole('tab', { name: 'Observação' }));
    expect(
      await screen.findByRole('textbox', { name: 'Observação' })
    ).toHaveValue('Acordo');

    fireEvent.click(screen.getByRole('button', { name: 'Save closeout' }));

    await waitFor(() => {
      expect(saveFechamento).toHaveBeenCalledWith({
        data: {
          id: 'consultorio-id',
          desconto: [500, 250],
          observacao: 'Acordo',
        },
        type: 'consultorio',
        fechamentoId: 'fechamento-id',
      });
    });
  });
});
