import { fireEvent, render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import { SectionOne } from './form-section-one';

function TestForm({ children }: { children: React.ReactNode }) {
  const methods = useForm({ defaultValues: { observacao: '' } });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('SectionOne', () => {
  it('renders and updates the observation field', () => {
    render(
      <TestForm>
        <SectionOne />
      </TestForm>
    );
    const observation = screen.getByRole('textbox', { name: 'Observação' });

    expect(observation).toHaveAttribute(
      'placeholder',
      'ex: Desconto de 10% para pagamento à vista'
    );
    fireEvent.change(observation, {
      target: { value: 'Desconto aprovado' },
    });

    expect(observation).toHaveValue('Desconto aprovado');
  });
});
