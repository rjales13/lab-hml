import { fireEvent, render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import { SectionOne } from './form-section-one';

function TestForm({ children }: { children: React.ReactNode }) {
  const methods = useForm({ defaultValues: { nome: '' } });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('SectionOne', () => {
  it('renders and updates the function name field', () => {
    render(
      <TestForm>
        <SectionOne />
      </TestForm>
    );
    const name = screen.getByRole('textbox', { name: 'Nome' });

    expect(name).toHaveAttribute('placeholder', 'ex: Protético');
    fireEvent.change(name, { target: { value: 'Auxiliar' } });

    expect(name).toHaveValue('Auxiliar');
  });
});
