import { fireEvent, render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';
import { SectionTwo } from './form-section-two';

function TestForm({ children }: { children: React.ReactNode }) {
  const methods = useForm({
    defaultValues: { cobranca: '', cep: '', numero: '' },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('SectionTwo', () => {
  it('renders billing, address, and number fields', () => {
    render(
      <TestForm>
        <SectionTwo endereco="Rua Central" loading={false} onCepChange={vi.fn()} />
      </TestForm>
    );

    expect(screen.getByRole('combobox', { name: 'Cobrança' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Cep' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Endereço' })).toHaveValue(
      'Rua Central'
    );
    expect(screen.getByRole('textbox', { name: 'Número' })).toBeInTheDocument();
  });

  it('notifies when the billing address postal code changes', () => {
    const onCepChange = vi.fn();

    render(
      <TestForm>
        <SectionTwo endereco="" loading={false} onCepChange={onCepChange} />
      </TestForm>
    );

    fireEvent.change(screen.getByRole('textbox', { name: 'Cep' }), {
      target: { value: '09078580' },
    });

    expect(onCepChange).toHaveBeenCalledWith('cep');
  });
});
