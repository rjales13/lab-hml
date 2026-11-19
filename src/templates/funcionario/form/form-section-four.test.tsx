import { fireEvent, render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';
import { SectionFour } from './form-section-four';

function TestForm({ children }: { children: React.ReactNode }) {
  const methods = useForm({ defaultValues: { cep: '', numero: '' } });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('SectionFour', () => {
  it('shows the postal code, fetched address, and number fields', () => {
    render(
      <TestForm>
        <SectionFour
          endereco="Rua Central"
          loading={false}
          onCepChange={vi.fn()}
        />
      </TestForm>
    );

    expect(screen.getByRole('textbox', { name: 'Cep' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Endereço' })).toHaveValue(
      'Rua Central'
    );
    expect(screen.getByRole('textbox', { name: 'Endereço' })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'Número' })).toBeInTheDocument();
  });

  it('notifies the form when the postal code changes', () => {
    const onCepChange = vi.fn();

    render(
      <TestForm>
        <SectionFour endereco="" loading={false} onCepChange={onCepChange} />
      </TestForm>
    );

    fireEvent.change(screen.getByRole('textbox', { name: 'Cep' }), {
      target: { value: '09078580' },
    });

    expect(onCepChange).toHaveBeenCalledOnce();
  });
});
