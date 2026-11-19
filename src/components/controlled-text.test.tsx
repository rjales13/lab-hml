import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { ControlledText } from './controlled-text';

function TestWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const methods = useForm({
    defaultValues: {
      testField: '',
      descriptionField: '',
    },
  });

  return (
    <FormProvider {...methods}>
      {children}
    </FormProvider>
  );
}

describe('ControlledText', () => {
  it('renders textarea with label', () => {
    render(
      <TestWrapper>
        <ControlledText name="testField" label="Description" />
      </TestWrapper>
    );

    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('updates form value when user types', () => {
    render(
      <TestWrapper>
        <ControlledText name="testField" label="Notes" />
      </TestWrapper>
    );

    const textarea = screen.getByLabelText('Notes') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Test notes' } });

    expect(textarea.value).toBe('Test notes');
  });

  it('renders with placeholder when provided', () => {
    render(
      <TestWrapper>
        <ControlledText
          name="testField"
          label="Comments"
          placeholder="Enter your comments"
        />
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText('Enter your comments')).toBeInTheDocument();
  });

  it('hides textarea when hidden prop is true', () => {
    const { container } = render(
      <TestWrapper>
        <ControlledText
          name="testField"
          label="Hidden Field"
          hidden
        />
      </TestWrapper>
    );

    const wrapper = container.querySelector('.hidden');
    expect(wrapper).toBeInTheDocument();
  });

  it('renders with tooltip when tootip prop is provided', () => {
    render(
      <TestWrapper>
        <ControlledText
          name="testField"
          label="Field with Tooltip"
          tootip="Help text"
        />
      </TestWrapper>
    );

    expect(screen.getByText('Field with Tooltip')).toBeInTheDocument();
  });

  it('calls onChange callback when value changes', () => {
    const handleChange = vi.fn();

    render(
      <TestWrapper>
        <ControlledText
          name="testField"
          label="Test"
          onChange={handleChange}
        />
      </TestWrapper>
    );

    const textarea = screen.getByLabelText('Test');
    fireEvent.change(textarea, { target: { value: 'test' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('applies custom className to textarea', () => {
    const { container } = render(
      <TestWrapper>
        <ControlledText
          name="testField"
          label="Styled"
          className="custom-class"
        />
      </TestWrapper>
    );

    const textarea = container.querySelector('textarea.custom-class');
    expect(textarea).toBeInTheDocument();
  });

  it('sets autoComplete to off', () => {
    render(
      <TestWrapper>
        <ControlledText name="testField" label="Test" />
      </TestWrapper>
    );

    const textarea = screen.getByLabelText('Test') as HTMLTextAreaElement;
    expect(textarea).toHaveAttribute('autoComplete', 'off');
  });

  it('renders with correct aria-label for accessibility', () => {
    render(
      <TestWrapper>
        <ControlledText name="testField" label="Accessible" />
      </TestWrapper>
    );

    const textarea = screen.getByLabelText('Accessible');
    expect(textarea).toHaveAttribute('aria-label', 'Accessible');
  });

  it('applies label styling classes', () => {
    const { container } = render(
      <TestWrapper>
        <ControlledText name="testField" label="Styled Label" />
      </TestWrapper>
    );

    const label = container.querySelector('label');
    expect(label).toHaveClass('text-gray-700', 'min-h-5');
  });

  it('handles multiline input', () => {
    render(
      <TestWrapper>
        <ControlledText name="testField" label="Multiline" />
      </TestWrapper>
    );

    const textarea = screen.getByLabelText('Multiline') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Line 1\nLine 2\nLine 3' } });

    expect(textarea.value).toBe('Line 1\nLine 2\nLine 3');
  });

  it('renders wrapper with flex layout', () => {
    const { container } = render(
      <TestWrapper>
        <ControlledText name="testField" label="Layout" />
      </TestWrapper>
    );

    const wrapper = container.querySelector('.flex');
    expect(wrapper).toHaveClass('flex', 'flex-col', 'gap-2');
  });

  it('handles empty textarea value', () => {
    render(
      <TestWrapper>
        <ControlledText name="testField" label="Empty" />
      </TestWrapper>
    );

    const textarea = screen.getByLabelText('Empty') as HTMLTextAreaElement;
    expect(textarea.value).toBe('');
  });

  it('renders textarea with correct id attribute', () => {
    render(
      <TestWrapper>
        <ControlledText name="userId" label="User Notes" />
      </TestWrapper>
    );

    const textarea = screen.getByLabelText('User Notes') as HTMLTextAreaElement;
    expect(textarea.id).toBe('userId');
  });
});
