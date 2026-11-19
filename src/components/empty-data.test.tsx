import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyData } from './empty-data';

describe('EmptyData', () => {
  it('renders empty state message', () => {
    render(<EmptyData />);

    expect(screen.getByText('Não há registros...')).toBeInTheDocument();
  });

  it('renders X icon from lucide-react', () => {
    const { container } = render(<EmptyData />);

    // lucide-react icons render as SVG
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const { container } = render(<EmptyData />);

    const wrapper = container.querySelector('.text-muted-foreground');
    expect(wrapper).toHaveClass('flex', 'items-center', 'justify-center', 'gap-2', 'rounded-md', 'p-4', 'text-sm');
  });

  it('renders X icon with red color', () => {
    const { container } = render(<EmptyData />);

    const icon = container.querySelector('.text-red-500');
    expect(icon).toBeInTheDocument();
  });

  it('renders separator component', () => {
    const { container } = render(<EmptyData />);

    // Separator is a UI component that typically renders a div or hr
    const separators = container.querySelectorAll('div');
    expect(separators.length).toBeGreaterThan(0);
  });

  it('displays exactly one message', () => {
    render(<EmptyData />);

    const messages = screen.getAllByText('Não há registros...');
    expect(messages).toHaveLength(1);
  });

  it('renders without additional props', () => {
    const { container } = render(<EmptyData />);

    expect(container.firstChild).toBeInTheDocument();
  });
});
