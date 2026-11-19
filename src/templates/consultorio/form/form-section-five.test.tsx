import { fireEvent, render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';
import { SectionFive } from './form-section-five';

function TestForm({ children }: { children: React.ReactNode }) {
  const methods = useForm({
    defaultValues: { cep_entrega: '', numero_entrega: '' },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('SectionFive', () => {
  it('renders delivery postal code, address, and number fields', () => {
    render(
      <TestForm>
        <SectionFive
          endereco="Rua de Entrega"
          loading={false}
          onCepChange={vi.fn()}
        />
      </TestForm>
    );

    expect(screen.getByRole('textbox', { name: 'Cep' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Endereço' })).toHaveValue(
      'Rua de Entrega'
    );
    expect(screen.getByRole('textbox', { name: 'Número' })).toBeInTheDocument();
  });

  it('notifies when the delivery postal code changes', () => {
    const onCepChange = vi.fn();

    render(
      <TestForm>
        <SectionFive endereco="" loading={false} onCepChange={onCepChange} />
      </TestForm>
    );

    fireEvent.change(screen.getByRole('textbox', { name: 'Cep' }), {
      target: { value: '01310100' },
    });

    expect(onCepChange).toHaveBeenCalledWith('cep_entrega');
  });
});
