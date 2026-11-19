import { fireEvent, render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import { SectionTwo } from './form-section-two';

function TestForm({ children }: { children: React.ReactNode }) {
  const methods = useForm({ defaultValues: { observacao: '' } });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('SectionTwo', () => {
  it('renders and updates the route observation', () => {
    render(
      <TestForm>
        <SectionTwo />
      </TestForm>
    );
    const observation = screen.getByRole('textbox', { name: 'Observação' });

    expect(observation).toHaveAttribute(
      'placeholder',
      'ex: Entregar das 8h às 18h'
    );
    fireEvent.change(observation, {
      target: { value: 'Entregar pela manhã' },
    });

    expect(observation).toHaveValue('Entregar pela manhã');
  });
});
