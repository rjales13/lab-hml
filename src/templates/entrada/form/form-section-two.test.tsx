import { fireEvent, render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import { SectionTwo } from './form-section-two';

function TestForm({ children }: { children: React.ReactNode }) {
  const methods = useForm({ defaultValues: { observacao: '' } });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('SectionTwo', () => {
  it('renders an editable observation field', () => {
    render(
      <TestForm>
        <SectionTwo />
      </TestForm>
    );

    expect(
      screen.getByRole('textbox', { name: 'Observação' })
    ).toBeInTheDocument();
  });

  it('updates the observation field when edited', () => {
    render(
      <TestForm>
        <SectionTwo />
      </TestForm>
    );
    const observation = screen.getByRole('textbox', { name: 'Observação' });

    fireEvent.change(observation, {
      target: { value: 'Retornar na próxima semana' },
    });

    expect(observation).toHaveValue('Retornar na próxima semana');
  });
});
