import { fireEvent, render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import { SectionSix } from './form-section-six';

function TestForm({ children }: { children: React.ReactNode }) {
  const methods = useForm({ defaultValues: { observacao: '' } });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('SectionSix', () => {
  it('renders and updates the employee observation', () => {
    render(
      <TestForm>
        <SectionSix />
      </TestForm>
    );
    const observation = screen.getByRole('textbox', { name: 'Observação' });

    expect(observation).toHaveAttribute(
      'placeholder',
      'ex: Funcionário responsável pelo setor de atendimento'
    );
    fireEvent.change(observation, { target: { value: 'Responsável pelo setor' } });

    expect(observation).toHaveValue('Responsável pelo setor');
  });
});
