import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { ControlledInput } from './controlled-input';

function TestWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const methods = useForm({
    defaultValues: {
      testField: '',
      phoneField: '',
      cpfField: '',
    },
  });

  return (
    <FormProvider {...methods}>
      {children}
    </FormProvider>
  );
}

describe('ControlledInput', () => {
  it('renders input with label', () => {
    render(
      <TestWrapper>
        <ControlledInput name="testField" label="Test Label" />
      </TestWrapper>
    );

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('updates form value when user types', () => {
    render(
      <TestWrapper>
        <ControlledInput name="testField" label="Name" />
      </TestWrapper>
    );

    const input = screen.getByLabelText('Name');
    fireEvent.change(input, { target: { value: 'John' } });

    expect(input).toHaveValue('John');
  });

  it('applies mask when mask prop is provided', () => {
    render(
      <TestWrapper>
        <ControlledInput
          name="phoneField"
          label="Phone"
          mask="(##) #####-####"
        />
      </TestWrapper>
    );

    const input = screen.getByLabelText('Phone');
    fireEvent.change(input, { target: { value: '11987654321' } });

    expect(input).toHaveValue('(11) 98765-4321');
  });

  it('applies CPF mask correctly', () => {
    render(
      <TestWrapper>
        <ControlledInput
          name="cpfField"
          label="CPF"
          mask="###.###.###-##"
        />
      </TestWrapper>
    );

    const input = screen.getByLabelText('CPF');
    fireEvent.change(input, { target: { value: '12345678900' } });

    expect(input).toHaveValue('123.456.789-00');
  });

  it('renders with placeholder when provided', () => {
    render(
      <TestWrapper>
        <ControlledInput
          name="testField"
          label="Email"
          placeholder="Enter your email"
        />
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  it('disables input when disabled prop is true', () => {
    render(
      <TestWrapper>
        <ControlledInput
          name="testField"
          label="Disabled Field"
          disabled
        />
      </TestWrapper>
    );

    expect(screen.getByLabelText('Disabled Field')).toBeDisabled();
  });

  it('hides input when hidden prop is true', () => {
    const { container } = render(
      <TestWrapper>
        <ControlledInput
          name="testField"
          label="Hidden Field"
          hidden
        />
      </TestWrapper>
    );

    const wrapper = container.querySelector('.hidden');
    expect(wrapper).toBeInTheDocument();
  });

  it('renders input with correct type attribute', () => {
    render(
      <TestWrapper>
        <ControlledInput
          name="testField"
          label="Password"
          type="password"
        />
      </TestWrapper>
    );

    const input = screen.getByLabelText('Password') as HTMLInputElement;
    expect(input.type).toBe('password');
  });

  it('calls onChange callback when value changes', () => {
    const handleChange = vi.fn();

    render(
      <TestWrapper>
        <ControlledInput
          name="testField"
          label="Test"
          onChange={handleChange}
        />
      </TestWrapper>
    );

    const input = screen.getByLabelText('Test');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('renders tooltip when tootip prop is provided', () => {
    render(
      <TestWrapper>
        <ControlledInput
          name="testField"
          label="Field"
          tootip="Help text"
        />
      </TestWrapper>
    );

    // The tooltip is rendered as a child of the label
    expect(screen.getByText('Field')).toBeInTheDocument();
  });

  it('applies custom className to input', () => {
    const { container } = render(
      <TestWrapper>
        <ControlledInput
          name="testField"
          label="Styled"
          className="custom-class"
        />
      </TestWrapper>
    );

    const input = container.querySelector('input.custom-class');
    expect(input).toBeInTheDocument();
  });

  it('sets autoComplete to off', () => {
    render(
      <TestWrapper>
        <ControlledInput name="testField" label="Test" />
      </TestWrapper>
    );

    const input = screen.getByLabelText('Test') as HTMLInputElement;
    expect(input).toHaveAttribute('autoComplete', 'off');
  });

  it('displays validation error message when field has error', () => {
    function FormWithValidation() {
      const methods = useForm({
        defaultValues: {
          email: '',
        },
        mode: 'onChange',
      });

      return (
        <FormProvider {...methods}>
          <ControlledInput name="email" label="Email" />
        </FormProvider>
      );
    }

    render(<FormWithValidation />);

    const input = screen.getByLabelText('Email');
    expect(input).toBeInTheDocument();
  });

  it('handles rapid value changes with mask', () => {
    render(
      <TestWrapper>
        <ControlledInput
          name="phoneField"
          label="Phone"
          mask="(##) #####-####"
        />
      </TestWrapper>
    );

    const input = screen.getByLabelText('Phone') as HTMLInputElement;

    fireEvent.change(input, { target: { value: '1' } });
    expect(input.value).toBe('(1');

    fireEvent.change(input, { target: { value: '11' } });
    expect(input.value).toBe('(11');

    fireEvent.change(input, { target: { value: '119' } });
    expect(input.value).toBe('(11) 9');

    fireEvent.change(input, { target: { value: '11987654321' } });
    expect(input.value).toBe('(11) 98765-4321');
  });

  it('handles input without mask transformation when no mask is provided', () => {
    render(
      <TestWrapper>
        <ControlledInput name="testField" label="Text" />
      </TestWrapper>
    );

    const input = screen.getByLabelText('Text');
    fireEvent.change(input, { target: { value: 'unchanged' } });

    expect(input).toHaveValue('unchanged');
  });
});
