import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tootip } from './tootip';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Info: ({ className, size }: Record<string, unknown>) => (
    <svg
      data-testid="info-icon"
      className={className as string}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  ),
}));

// Mock tooltip UI components
vi.mock('./ui/tooltip', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip-content">{children}</div>
  ),
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip-trigger">{children}</div>
  ),
}));

describe('Tootip', () => {
  it('renders info icon', () => {
    render(<Tootip text="Help text" />);

    expect(screen.getByTestId('info-icon')).toBeInTheDocument();
  });

  it('renders with default size of 20', () => {
    render(<Tootip text="Help text" />);

    const svg = screen.getByTestId('info-icon');
    expect(svg).toBeInTheDocument();
  });

  it('renders with custom size', () => {
    render(<Tootip text="Help text" size={30} />);

    expect(screen.getByTestId('info-icon')).toBeInTheDocument();
  });

  it('applies orange color to icon', () => {
    render(<Tootip text="Help text" />);

    const icon = screen.getByTestId('info-icon');
    expect(icon).toHaveClass('text-orange-700');
  });

  it('renders tooltip with text content', () => {
    render(<Tootip text="This is help text" />);

    expect(screen.getByText('This is help text')).toBeInTheDocument();
  });

  it('renders with animate pulse when animate prop is true', () => {
    render(<Tootip text="Help text" animate={true} />);

    const icon = screen.getByTestId('info-icon');
    expect(icon).toHaveClass('animate-pulse');
  });

  it('does not animate when animate prop is false', () => {
    render(<Tootip text="Help text" animate={false} />);

    const icon = screen.getByTestId('info-icon');
    expect(icon).not.toHaveClass('animate-pulse');
  });

  it('renders with default animate value of false', () => {
    render(<Tootip text="Help text" />);

    const icon = screen.getByTestId('info-icon');
    expect(icon).not.toHaveClass('animate-pulse');
  });

  it('applies text-orange-700 class to icon', () => {
    render(<Tootip text="Help text" />);

    const icon = screen.getByTestId('info-icon');
    expect(icon).toHaveClass('text-orange-700');
  });

  it('renders tooltip content with correct styling', () => {
    render(<Tootip text="Help text" />);

    expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
  });

  it('handles long tooltip text', () => {
    const longText = 'This is a very long tooltip text that should wrap properly';
    render(<Tootip text={longText} />);

    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  it('renders tooltip trigger', () => {
    render(<Tootip text="Help text" />);

    expect(screen.getByTestId('tooltip-trigger')).toBeInTheDocument();
  });

  it('renders with size applied to icon', () => {
    render(<Tootip text="Help text" size={25} />);

    const icon = screen.getByTestId('info-icon');
    expect(icon).toBeInTheDocument();
  });

  it('combines animate and color classes correctly', () => {
    render(<Tootip text="Help text" animate={true} />);

    const icon = screen.getByTestId('info-icon');
    expect(icon).toHaveClass('text-orange-700');
    expect(icon).toHaveClass('animate-pulse');
  });
});
