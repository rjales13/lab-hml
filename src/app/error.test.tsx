import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ErrorBoundary from './error';

describe('ErrorBoundary', () => {
  it('shows the error message and invokes reset when retry is selected', () => {
    const reset = vi.fn();

    render(
      <ErrorBoundary error={new Error('Unable to load the page')} reset={reset} />
    );

    expect(screen.getByText('Algo deu errado!')).toBeInTheDocument();
    expect(screen.getByText('Unable to load the page')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(reset).toHaveBeenCalledOnce();
  });

  it('does not render an error message when the error has no message', () => {
    const { container } = render(
      <ErrorBoundary error={new Error()} reset={vi.fn()} />
    );

    expect(screen.getByText('Algo deu errado!')).toBeInTheDocument();
    expect(container.querySelector('p')).not.toBeInTheDocument();
  });
});
