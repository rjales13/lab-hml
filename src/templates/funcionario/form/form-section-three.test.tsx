import { fireEvent, render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import { SectionThree } from './form-section-three';

function TestForm({ children }: { children: React.ReactNode }) {
  const methods = useForm({
    defaultValues: {
      data_nascimento: '',
      data_admissao: '',
      data_recisao: '',
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('SectionThree', () => {
  it('renders birth, admission, and termination date fields', () => {
    render(
      <TestForm>
        <SectionThree />
      </TestForm>
    );

    expect(
      screen.getByRole('textbox', { name: 'Data de Nascimento' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Data de Admissão' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Data de Rescisão' })
    ).toBeInTheDocument();
  });

  it('applies the date mask to entered values', () => {
    render(
      <TestForm>
        <SectionThree />
      </TestForm>
    );
    const birthDate = screen.getByRole('textbox', {
      name: 'Data de Nascimento',
    });

    fireEvent.change(birthDate, { target: { value: '01011990' } });

    expect(birthDate).toHaveValue('01/01/1990');
  });
});
