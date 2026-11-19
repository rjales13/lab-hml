import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import { SectionTwo } from './form-section-two';

function TestForm({ children }: { children: React.ReactNode }) {
  const methods = useForm({
    defaultValues: { cro: '', email: '' },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('SectionTwo', () => {
  it('renders the CRO and email fields', () => {
    render(
      <TestForm>
        <SectionTwo />
      </TestForm>
    );

    expect(screen.getByRole('textbox', { name: 'CRO' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'E-mail' })).toBeInTheDocument();
  });
});
