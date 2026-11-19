import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { UserProvider } from '@/contexts/user-contexts';
import { Servicos } from './servicos';

const originalScrollIntoView = Element.prototype.scrollIntoView;

class TestResizeObserver implements ResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    void callback;
  }

  observe(target: Element, options?: ResizeObserverOptions) {
    void target;
    void options;
  }

  unobserve(target: Element) {
    void target;
  }

  disconnect() {}
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', TestResizeObserver);
  Object.defineProperty(Element.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  if (originalScrollIntoView) {
    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      configurable: true,
      value: originalScrollIntoView,
    });
  } else {
    Reflect.deleteProperty(Element.prototype, 'scrollIntoView');
  }
});

describe('Servicos', () => {
  const servicoItens = [{ id: 'servico-1', value: 'Coroa', valor: 2500 }];
  const funcionarioItens = [{ id: 'funcionario-1', value: 'Carla' }];
  const previsao = new Date('2026-03-15T00:00:00.000Z');
  const item = {
    idServicoEntrada: 'item-1',
    servico: 'servico-1',
    quantidade: 2,
    repeticao: 10,
    valor: 2500,
    desconto: 0,
    funcionario: 'funcionario-1',
    data_previsao: previsao,
  };

  function renderServicos(
    props: Partial<React.ComponentProps<typeof Servicos>> = {}
  ) {
    const handleOnSaveServicos = vi.fn();
    const handleOnPrint = vi.fn();
    const handleOnValoresItens = vi.fn();

    render(
      <UserProvider user={null}>
        <Servicos
          itens={[]}
          servicoItens={servicoItens}
          funcionarioItens={funcionarioItens}
          handleOnSaveServicos={handleOnSaveServicos}
          handleOnPrint={handleOnPrint}
          handleOnValoresItens={handleOnValoresItens}
          {...props}
        />
      </UserProvider>
    );

    return { handleOnSaveServicos, handleOnPrint, handleOnValoresItens };
  }

  it('shows the empty state when there are no services', () => {
    renderServicos();

    expect(screen.getByText('Não há registros...')).toBeInTheDocument();
  });

  it('saves a service when its exit is applied', () => {
    const { handleOnSaveServicos } = renderServicos({ itens: [item] });

    fireEvent.click(screen.getByTitle('Aplicar Saída'));

    expect(handleOnSaveServicos).toHaveBeenCalledWith([
      expect.objectContaining({
        idServicoEntrada: 'item-1',
        data_saida: expect.any(Date),
      }),
    ]);
  });

  it('prints selected available services grouped by employee', () => {
    const { handleOnPrint } = renderServicos({ itens: [item] });

    fireEvent.click(screen.getByTitle('selecionar todos'));
    fireEvent.click(screen.getByTitle('imprimir'));

    expect(handleOnPrint).toHaveBeenCalledWith([
      {
        funcionario: 'Carla',
        servico: [
          {
            nome: 'Coroa',
            quantidade: 2,
            data_previsao: previsao,
          },
        ],
      },
    ]);
  });

  it('adds a service with the selected service, employee, and quantity', async () => {
    const { handleOnSaveServicos } = renderServicos();

    fireEvent.click(screen.getByTitle('inserir novo registro'));
    fireEvent.click(screen.getAllByRole('combobox')[0]);
    fireEvent.click(await screen.findByRole('option', { name: 'Coroa' }));
    fireEvent.change(screen.getByLabelText('Quantidade'), {
      target: { value: '2' },
    });
    fireEvent.change(screen.getByLabelText('Repetição %'), {
      target: { value: '10' },
    });
    fireEvent.click(screen.getAllByRole('combobox')[1]);
    fireEvent.click(await screen.findByRole('option', { name: 'Carla' }));
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(handleOnSaveServicos).toHaveBeenCalledWith([
      expect.objectContaining({
        idServicoEntrada: expect.any(String),
        servico: 'servico-1',
        quantidade: 2,
        repeticao: 10,
        valor: 2500,
        funcionario: 'funcionario-1',
      }),
    ]);
  });
});
