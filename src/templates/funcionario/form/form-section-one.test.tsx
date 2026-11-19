import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import { SectionOne } from './form-section-one';

function TestForm({ children }: { children: React.ReactNode }) {
  const methods = useForm({ defaultValues: { nome: '', email: '' } });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('SectionOne', () => {
  it('renders employee name and email fields', () => {
    render(
      <TestForm>
        <SectionOne />
      </TestForm>
    );

    expect(screen.getByRole('textbox', { name: 'Nome' })).toHaveAttribute(
      'placeholder',
      'ex: Alberto Silva'
    );
    expect(screen.getByRole('textbox', { name: 'E-mail' })).toHaveAttribute(
      'placeholder',
      'ex: albertosilva@gmail.com'
    );
  });
});
