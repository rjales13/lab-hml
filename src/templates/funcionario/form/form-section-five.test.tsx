import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import { SectionFive } from './form-section-five';

function TestForm({ children }: { children: React.ReactNode }) {
  const methods = useForm({ defaultValues: { complemento: '' } });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('SectionFive', () => {
  it('shows fetched state, city, and neighborhood with editable complement', () => {
    render(
      <TestForm>
        <SectionFive
          estado="SP"
          cidade="Santo André"
          bairro="Centro"
          loading={false}
        />
      </TestForm>
    );

    expect(screen.getByRole('textbox', { name: 'Estado' })).toHaveValue('SP');
    expect(screen.getByRole('textbox', { name: 'Cidade' })).toHaveValue(
      'Santo André'
    );
    expect(screen.getByRole('textbox', { name: 'Bairro' })).toHaveValue(
      'Centro'
    );
    expect(screen.getByRole('textbox', { name: 'Complemento' })).toBeEnabled();
  });
});
