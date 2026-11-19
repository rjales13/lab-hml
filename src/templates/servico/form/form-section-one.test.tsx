import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import { SectionOne } from './form-section-one';

function TestForm({ children }: { children: React.ReactNode }) {
  const methods = useForm({ defaultValues: { nome: '' } });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('SectionOne', () => {
  it('renders the service name field', () => {
    render(
      <TestForm>
        <SectionOne />
      </TestForm>
    );

    expect(screen.getByRole('textbox', { name: 'Nome' })).toHaveAttribute(
      'placeholder',
      'ex: Protese Dentária'
    );
  });
});
