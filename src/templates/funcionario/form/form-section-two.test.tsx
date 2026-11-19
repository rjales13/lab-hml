import { fireEvent, render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import { SectionTwo } from './form-section-two';

function TestForm({ children }: { children: React.ReactNode }) {
  const methods = useForm({ defaultValues: { rg: '', cpf: '' } });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('SectionTwo', () => {
  it('renders RG and CPF inputs', () => {
    render(
      <TestForm>
        <SectionTwo />
      </TestForm>
    );

    expect(screen.getByRole('textbox', { name: 'RG' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'CPF' })).toHaveAttribute(
      'placeholder',
      'ex: 123.456.789-00'
    );
  });

  it('formats the CPF as the user enters digits', () => {
    render(
      <TestForm>
        <SectionTwo />
      </TestForm>
    );
    const cpf = screen.getByRole('textbox', { name: 'CPF' });

    fireEvent.change(cpf, { target: { value: '52998224725' } });

    expect(cpf).toHaveValue('529.982.247-25');
  });
});
