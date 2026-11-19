import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import { SectionOne } from './form-section-one';

function TestForm({ children }: { children: React.ReactNode }) {
  const methods = useForm({ defaultValues: { data: '' } });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('SectionOne', () => {
  it('renders the route date field', () => {
    render(
      <TestForm>
        <SectionOne />
      </TestForm>
    );

    expect(screen.getByLabelText('Data')).toHaveAttribute('type', 'date');
    expect(screen.getByLabelText('Data')).toHaveAttribute(
      'placeholder',
      'ex: 01/01/2026'
    );
  });
});
