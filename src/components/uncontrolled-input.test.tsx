import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UnControlledInput } from './uncontrolled-input';

describe('UnControlledInput', () => {
  it('renders input with label', () => {
    render(
      <UnControlledInput
        name="testField"
        label="Test Label"
        placeholder="Enter text"
        className="text-input"
        value=""
      />
    );

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('displays input value', () => {
    render(
      <UnControlledInput
        name="testField"
        label="Test"
        placeholder="Enter"
        className="input-class"
        value="test value"
      />
    );

    const input = screen.getByLabelText('Test') as HTMLInputElement;
    expect(input.value).toBe('test value');
  });

  it('renders with placeholder', () => {
    render(
      <UnControlledInput
        name="testField"
        label="Email"
        placeholder="user@example.com"
        className="email-input"
        value=""
      />
    );

    expect(screen.getByPlaceholderText('user@example.com')).toBeInTheDocument();
  });

  it('disables input when disabled prop is true', () => {
    render(
      <UnControlledInput
        name="testField"
        label="Disabled"
        placeholder="Enter"
        className="input"
        value="text"
        disabled
      />
    );

    expect(screen.getByLabelText('Disabled')).toBeDisabled();
  });

  it('shows skeleton when loading prop is true', () => {
    render(
      <UnControlledInput
        name="testField"
        label="Loading"
        placeholder="Enter"
        className="input"
        value="text"
        loading
      />
    );

    // Skeleton component should be rendered instead of input
    const input = screen.queryByLabelText('Loading') as HTMLInputElement;
    // Input should not be in the document when loading
    expect(input).not.toBeInTheDocument();
  });

  it('shows input when loading prop is false', () => {
    render(
      <UnControlledInput
        name="testField"
        label="Loaded"
        placeholder="Enter"
        className="input"
        value="loaded"
        loading={false}
      />
    );

    expect(screen.getByLabelText('Loaded')).toBeInTheDocument();
  });

  it('applies custom className to input', () => {
    const { container } = render(
      <UnControlledInput
        name="testField"
        label="Styled"
        placeholder="Enter"
        className="custom-class"
        value=""
      />
    );

    const input = container.querySelector('input.custom-class');
    expect(input).toBeInTheDocument();
  });

  it('sets autoComplete to off', () => {
    render(
      <UnControlledInput
        name="testField"
        label="Test"
        placeholder="Enter"
        className="input"
        value=""
      />
    );

    const input = screen.getByLabelText('Test') as HTMLInputElement;
    // The input element has autoComplete="off" set
    expect(input).toHaveAttribute('autoComplete', 'off');
  });

  it('renders input with correct id attribute', () => {
    render(
      <UnControlledInput
        name="userId"
        label="User ID"
        placeholder="Enter ID"
        className="input"
        value="123"
      />
    );

    const input = screen.getByLabelText('User ID') as HTMLInputElement;
    expect(input.id).toBe('userId');
  });

  it('applies label styling classes', () => {
    const { container } = render(
      <UnControlledInput
        name="testField"
        label="Label"
        placeholder="Enter"
        className="input"
        value=""
      />
    );

    const label = container.querySelector('label');
    expect(label).toHaveClass('text-gray-700', 'min-h-5');
  });

  it('handles empty value', () => {
    render(
      <UnControlledInput
        name="testField"
        label="Empty"
        placeholder="Type here"
        className="input"
        value=""
      />
    );

    const input = screen.getByLabelText('Empty') as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('renders input with aria-label for accessibility', () => {
    render(
      <UnControlledInput
        name="testField"
        label="Accessible"
        placeholder="Enter"
        className="input"
        value="text"
      />
    );

    const input = screen.getByLabelText('Accessible');
    expect(input).toHaveAttribute('aria-label', 'Accessible');
  });

  it('renders wrapper with flex layout', () => {
    const { container } = render(
      <UnControlledInput
        name="testField"
        label="Layout"
        placeholder="Enter"
        className="input"
        value=""
      />
    );

    const wrapper = container.querySelector('.flex');
    expect(wrapper).toHaveClass('flex', 'flex-col', 'gap-2');
  });

  it('renders input with correct html structure', () => {
    const { container } = render(
      <UnControlledInput
        name="testField"
        label="Test"
        placeholder="Enter"
        className="input"
        value="text"
      />
    );

    const label = container.querySelector('label');
    const input = container.querySelector('input');

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });
});
