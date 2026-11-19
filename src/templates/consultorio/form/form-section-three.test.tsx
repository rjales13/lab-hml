import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import { SectionThree } from './form-section-three';

function TestForm({ children }: { children: React.ReactNode }) {
  const methods = useForm({ defaultValues: { complemento: '' } });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('SectionThree', () => {
  it('shows the fetched region and the editable address complement', () => {
    render(
      <TestForm>
        <SectionThree
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
    expect(
      screen.getByRole('textbox', { name: 'Complemento' })
    ).toBeInTheDocument();
  });
});
