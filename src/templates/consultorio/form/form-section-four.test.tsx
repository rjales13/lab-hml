import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import { SectionFour } from './form-section-four';

function TestForm({ children }: { children: React.ReactNode }) {
  const methods = useForm({ defaultValues: { observacao: '' } });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('SectionFour', () => {
  it('renders the editable observation field', () => {
    render(
      <TestForm>
        <SectionFour />
      </TestForm>
    );

    expect(
      screen.getByRole('textbox', { name: 'Observação' })
    ).toBeInTheDocument();
  });
});
