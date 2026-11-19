import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ListSheet } from './list-sheet';

describe('ListSheet', () => {
  const originalScrollIntoView = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollIntoView');
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', class {
      observe() {}
      unobserve() {}
      disconnect() {}
    });
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: vi.fn() });
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    if (originalScrollIntoView) {
      Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', originalScrollIntoView);
    } else {
      Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView');
    }
  });

  const props = {
    type: 'input' as const,
    oldData: '',
    fieldForm: 'telefones',
    fieldLabel: 'telefone',
    placeholder: 'Informe o telefone',
    open: true,
    getValue: vi.fn(),
    setOpen: vi.fn(),
  };

  it('prevents saving an empty value', () => {
    render(<ListSheet {...props} />);

    expect(screen.getByRole('heading', { name: 'Adicionar Telefone' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled();
  });

  it('saves entered data and closes the sheet', () => {
    const getValue = vi.fn();
    const setOpen = vi.fn();
    render(<ListSheet {...props} getValue={getValue} setOpen={setOpen} />);

    fireEvent.change(screen.getByPlaceholderText('Informe o telefone'), { target: { value: '12345' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(getValue).toHaveBeenCalledWith({
      idOrValue: '12345',
      action: 'save',
      oldIdOrValue: '',
      fieldForm: 'telefones',
    });
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it('loads the existing value and includes it when saving an edit', () => {
    const getValue = vi.fn();
    render(<ListSheet {...props} oldData="antigo" getValue={getValue} />);

    const input = screen.getByPlaceholderText('Informe o telefone');
    expect(input).toHaveValue('antigo');
    fireEvent.change(input, { target: { value: 'novo' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));
    expect(getValue).toHaveBeenCalledWith(expect.objectContaining({ idOrValue: 'novo', oldIdOrValue: 'antigo' }));
  });

  it('requires a complete masked telephone number', () => {
    render(<ListSheet {...props} mask="(##) #####-####" />);
    const input = screen.getByPlaceholderText('Informe o telefone');

    fireEvent.change(input, { target: { value: '11999' } });
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled();
    fireEvent.change(input, { target: { value: '11999999999' } });
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeEnabled();
  });

  it('only enables saving positive monetary values', () => {
    render(<ListSheet {...props} monetary />);
    const input = screen.getByPlaceholderText('Informe o telefone');

    fireEvent.change(input, { target: { value: '0' } });
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled();
    fireEvent.change(input, { target: { value: '100' } });
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeEnabled();
  });

  it('saves the selected item id', async () => {
    const getValue = vi.fn();
    render(
      <ListSheet
        {...props}
        type="select"
        commandData={[{ id: 'a', value: 'Maria' }, { id: 'b', value: 'João' }]}
        getValue={getValue}
      />
    );

    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled();
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(await screen.findByText('João'));
    expect(screen.getByRole('combobox')).toHaveTextContent('João');
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));
    expect(getValue).toHaveBeenCalledWith({
      idOrValue: 'b',
      action: 'save',
      oldIdOrValue: '',
      fieldForm: 'telefones',
    });
  });

  it('closes without saving when the user clicks Fechar', () => {
    const getValue = vi.fn();
    const setOpen = vi.fn();
    render(<ListSheet {...props} getValue={getValue} setOpen={setOpen} />);

    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
    expect(setOpen).toHaveBeenCalledWith(false);
    expect(getValue).not.toHaveBeenCalled();
  });
});
