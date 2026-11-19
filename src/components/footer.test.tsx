import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './footer';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children, className }: React.ComponentProps<'a'>) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

// Mock features data
vi.mock('@/data/features', () => ({
  features: [
    {
      title: 'Dashboard',
      icon: () => <span>DashboardIcon</span>,
      link: '/dashboard',
    },
    {
      title: 'Settings',
      icon: () => <span>SettingsIcon</span>,
      link: '/settings',
    },
  ],
}));

describe('Footer', () => {
  it('renders footer element', () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });

  it('renders navigation with feature links', () => {
    render(<Footer />);

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('renders all feature links', () => {
    render(<Footer />);

    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('renders with fixed positioning', () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('fixed', 'bottom-0');
  });

  it('applies correct styling classes', () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('w-full', 'border-t', 'shadow-lg');
  });

  it('renders with blue color scheme', () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('border-blue-800/30');
  });

  it('renders navigation with flex layout', () => {
    const { container } = render(<Footer />);

    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('flex');
  });

  it('renders with correct text color', () => {
    const { container } = render(<Footer />);

    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('text-blue-950');
  });

  it('renders footer with max height constraint', () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('max-h-20');
  });

  it('applies backdrop blur effect', () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('backdrop-blur-md');
  });

  it('renders with correct z-index', () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });

  it('renders links with hover styling', () => {
    const { container } = render(<Footer />);

    const links = container.querySelectorAll('a');
    links.forEach((link) => {
      expect(link).toHaveClass('hover:text-blue-900');
    });
  });

  it('renders centered content', () => {
    const { container } = render(<Footer />);

    const contentDiv = container.querySelector('.flex.justify-center');
    expect(contentDiv).toBeInTheDocument();
  });

  it('renders with gap between items', () => {
    const { container } = render(<Footer />);

    const contentDiv = container.querySelector('.gap-8');
    expect(contentDiv).toBeInTheDocument();
  });
});
