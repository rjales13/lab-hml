import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ControlledComboBox } from './controlled-combo-box';

const items = [
  { id: '1', value: 'Maria' },
  { id: '2', value: 'João' },
];

function Form({ children }: { children: React.ReactNode }) {
  const methods = useForm({ defaultValues: { contact: '' } });
  const value = useWatch({ control: methods.control, name: 'contact' });

  return (
    <FormProvider {...methods}>
      {children}
      <output aria-label="Valor selecionado">{value}</output>
    </FormProvider>
  );
}

describe('ControlledComboBox', () => {
  const originalScrollIntoView = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollIntoView');

  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: vi.fn() });
    vi.stubGlobal('ResizeObserver', class {
      observe() {}
      unobserve() {}
      disconnect() {}
    });
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
    name: 'contact',
    label: 'Contato',
    placeholder: 'Buscar contato',
    itens: items,
  };

  it('displays the label and placeholder selection', () => {
    render(<Form><ControlledComboBox {...props} /></Form>);

    expect(screen.getByRole('combobox', { name: 'Contato' })).toHaveTextContent('Selecione');
  });

  it('displays and updates the selected option when idValue changes', () => {
    const { rerender } = render(<Form><ControlledComboBox {...props} idValue="1" /></Form>);

    expect(screen.getByRole('combobox', { name: 'Contato' })).toHaveTextContent('Maria');
    rerender(<Form><ControlledComboBox {...props} idValue="2" /></Form>);
    expect(screen.getByRole('combobox', { name: 'Contato' })).toHaveTextContent('João');
  });

  it('selects an option and updates the form and callback', async () => {
    const onChange = vi.fn();
    render(<Form><ControlledComboBox {...props} onChange={onChange} /></Form>);

    fireEvent.click(screen.getByRole('combobox', { name: 'Contato' }));
    fireEvent.click(await screen.findByText('Maria'));

    expect(screen.getByRole('combobox', { name: 'Contato' })).toHaveTextContent('Maria');
    expect(screen.getByLabelText('Valor selecionado')).toHaveTextContent('1');
    expect(onChange).toHaveBeenCalledWith({ field: 'contact', id: '1' });
    await waitFor(() => expect(screen.queryByPlaceholderText('Buscar contato')).not.toBeInTheDocument());
  });

  it('disables the selection control', () => {
    render(<Form><ControlledComboBox {...props} disabled /></Form>);

    expect(screen.getByRole('combobox', { name: 'Contato' })).toBeDisabled();
  });

  it('does not render a combobox while loading', () => {
    render(<Form><ControlledComboBox {...props} loading /></Form>);

    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(screen.getByText('Contato')).toBeInTheDocument();
  });
});
