import { fireEvent, render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SectionOne } from './form-section-one';

const originalScrollIntoView = Element.prototype.scrollIntoView;

class TestResizeObserver implements ResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    void callback;
  }

  observe(target: Element, options?: ResizeObserverOptions) {
    void target;
    void options;
  }

  unobserve(target: Element) {
    void target;
  }

  disconnect() {}
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', TestResizeObserver);
  Object.defineProperty(Element.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  if (originalScrollIntoView) {
    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      configurable: true,
      value: originalScrollIntoView,
    });
  } else {
    Reflect.deleteProperty(Element.prototype, 'scrollIntoView');
  }
});

function TestForm({ children }: { children: React.ReactNode }) {
  const methods = useForm({
    defaultValues: { consultorio: '', dentista: '', paciente: '' },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('SectionOne', () => {
  const props = {
    consultorioData: [
      { id: 'consultorio-1', value: 'Central' },
      { id: 'consultorio-2', value: 'Vila' },
    ],
    dentistaData: [{ id: 'dentista-1', value: 'Dra. Ana' }],
    isLoadingConsultorio: false,
    isLoadingDentista: false,
    consultorioId: '',
    dentistaId: 'dentista-1',
    handleConsultorioChange: vi.fn(),
    handleDentistaChange: vi.fn(),
  };

  it('renders office, dentist, and patient fields and disables dentist selection without an office', () => {
    render(
      <TestForm>
        <SectionOne {...props} />
      </TestForm>
    );

    expect(
      screen.getByRole('combobox', { name: 'Consultório' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: 'Dentista' })
    ).toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'Paciente' })).toBeInTheDocument();
  });

  it('selects an office and clears the previously selected dentist', async () => {
    const handleConsultorioChange = vi.fn();
    const handleDentistaChange = vi.fn();

    render(
      <TestForm>
        <SectionOne
          {...props}
          consultorioId="consultorio-1"
          handleConsultorioChange={handleConsultorioChange}
          handleDentistaChange={handleDentistaChange}
        />
      </TestForm>
    );

    fireEvent.click(screen.getByRole('combobox', { name: 'Consultório' }));
    fireEvent.click(await screen.findByRole('option', { name: 'Vila' }));

    expect(handleConsultorioChange).toHaveBeenCalledWith('consultorio-2');
    expect(handleDentistaChange).toHaveBeenCalledWith('');
  });
});
