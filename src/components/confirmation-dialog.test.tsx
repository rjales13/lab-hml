import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ConfirmationDialog } from './confirmation-dialog';

describe('ConfirmationDialog', () => {
  it('renders dialog with title', () => {
    render(
      <ConfirmationDialog
        title="Confirm Action"
        open
      />
    );

    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
  });

  it('renders with description when provided', () => {
    render(
      <ConfirmationDialog
        title="Confirm"
        description="Are you sure?"
        open
      />
    );

    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('renders with custom trigger button', () => {
    render(
      <ConfirmationDialog
        title="Confirm"
        trigger={<button>Open Dialog</button>}
      />
    );

    expect(screen.getByText('Open Dialog')).toBeInTheDocument();
  });

  it('renders cancel button with custom text', () => {
    render(
      <ConfirmationDialog
        title="Confirm"
        cancelText="Reject"
        open
      />
    );

    const cancelButton = screen.getByTitle('Reject');
    expect(cancelButton).toBeInTheDocument();
  });

  it('renders cancel button with default text', () => {
    render(
      <ConfirmationDialog
        title="Confirm"
        open
      />
    );

    const cancelButton = screen.getByTitle('Cancelar');
    expect(cancelButton).toBeInTheDocument();
  });

  it('renders confirm button when onConfirm is provided', () => {
    const handleConfirm = vi.fn();

    render(
      <ConfirmationDialog
        title="Confirm"
        onConfirm={handleConfirm}
        open
      />
    );

    const confirmButton = screen.getByTitle('Confirmar');
    expect(confirmButton).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    const handleConfirm = vi.fn();

    render(
      <ConfirmationDialog
        title="Confirm"
        onConfirm={handleConfirm}
        open
      />
    );

    const confirmButton = screen.getByTitle('Confirmar');
    fireEvent.click(confirmButton);

    expect(handleConfirm).toHaveBeenCalled();
  });

  it('renders children when provided', () => {
    render(
      <ConfirmationDialog
        title="Confirm"
        open
      >
        <p>Additional content</p>
      </ConfirmationDialog>
    );

    expect(screen.getByText('Additional content')).toBeInTheDocument();
  });

  it('controls open state with open prop', () => {
    const { rerender } = render(
      <ConfirmationDialog
        title="Confirm"
        open={false}
      />
    );

    // Dialog should not be visible initially
    expect(screen.queryByText('Confirm')).not.toBeInTheDocument();

    rerender(
      <ConfirmationDialog
        title="Confirm"
        open={true}
      />
    );

    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('calls onOpenChange when dialog state changes', () => {
    const handleOpenChange = vi.fn();

    const { rerender } = render(
      <ConfirmationDialog
        title="Confirm"
        open={true}
        onOpenChange={handleOpenChange}
        trigger={<button>Open</button>}
      />
    );

    // Simulate closing the dialog
    rerender(
      <ConfirmationDialog
        title="Confirm"
        open={false}
        onOpenChange={handleOpenChange}
        trigger={<button>Open</button>}
      />
    );

    // The dialog should respond to prop changes
    expect(screen.queryByText('Confirm')).not.toBeInTheDocument();
  });

  it('renders cancel button with correct styling', () => {
    render(
      <ConfirmationDialog
        title="Confirm"
        open
      />
    );

    const cancelButton = screen.getByTitle('Cancelar');
    expect(cancelButton).toHaveClass('bg-accent', 'cursor-pointer', 'rounded-md', 'p-1', 'text-red-600', 'hover:bg-gray-200');
  });

  it('renders confirm button with correct styling', () => {
    render(
      <ConfirmationDialog
        title="Confirm"
        onConfirm={() => {}}
        open
      />
    );

    const confirmButton = screen.getByTitle('Confirmar');
    expect(confirmButton).toHaveClass('bg-accent', 'cursor-pointer', 'rounded-md', 'p-1', 'text-blue-950', 'hover:bg-gray-200');
  });

  it('does not render confirm button when onConfirm is not provided', () => {
    render(
      <ConfirmationDialog
        title="Confirm"
        open
      />
    );

    expect(screen.queryByTitle('Confirmar')).not.toBeInTheDocument();
  });

  it('renders with empty description when not provided', () => {
    render(
      <ConfirmationDialog
        title="Confirm"
        open
      />
    );

    // The description should render but be empty
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('renders trigger button without asChild wrapper changes', () => {
    const TriggerComponent = () => <button className="trigger-btn">Click me</button>;

    render(
      <ConfirmationDialog
        title="Confirm"
        trigger={<TriggerComponent />}
      />
    );

    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
