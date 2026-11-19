import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import { SectionSix } from './form-section-six';

function TestForm({ children }: { children: React.ReactNode }) {
  const methods = useForm({
    defaultValues: { complemento_entrega: '' },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('SectionSix', () => {
  it('shows the delivery region and editable complement', () => {
    render(
      <TestForm>
        <SectionSix
          estado="RJ"
          cidade="Niterói"
          bairro="Icaraí"
          loading={false}
        />
      </TestForm>
    );

    expect(screen.getByRole('textbox', { name: 'Estado' })).toHaveValue('RJ');
    expect(screen.getByRole('textbox', { name: 'Cidade' })).toHaveValue(
      'Niterói'
    );
    expect(screen.getByRole('textbox', { name: 'Bairro' })).toHaveValue(
      'Icaraí'
    );
    expect(
      screen.getByRole('textbox', { name: 'Complemento' })
    ).toBeInTheDocument();
  });
});
