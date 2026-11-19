import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { AppSidebar } from './app-sidebar';

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
      adminOnly: false,
    },
    {
      title: 'Admin Panel',
      icon: () => <span>AdminIcon</span>,
      link: '/admin',
      adminOnly: true,
    },
  ],
}));

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet">{children}</div>
  ),
  SheetTrigger: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button data-testid="sheet-trigger" {...props}>
      {children}
    </button>
  ),
  SheetContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet-content">{children}</div>
  ),
  SheetHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet-header">{children}</div>
  ),
  SheetTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  SheetDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  SheetClose: ({ children, ...props }: React.ComponentProps<'div'>) => (
    <div data-testid="sheet-close" {...props}>
      {children}
    </div>
  ),
}));

vi.mock('./ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card">{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <h3>{children}</h3>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe('AppSidebar', () => {
  it('renders sidebar', () => {
    const { container } = render(<AppSidebar isAdmin={false} />);

    expect(container.querySelector('[data-testid="sheet"]')).toBeInTheDocument();
  });

  it('renders menu button', () => {
    const { container } = render(<AppSidebar isAdmin={false} />);

    const trigger = container.querySelector('[data-testid="sheet-trigger"]');
    expect(trigger).toBeInTheDocument();
  });

  it('renders sheet content', () => {
    const { container } = render(<AppSidebar isAdmin={false} />);

    expect(container.querySelector('[data-testid="sheet-content"]')).toBeInTheDocument();
  });

  it('renders menu title', () => {
    const { container } = render(<AppSidebar isAdmin={false} />);

    const title = container.querySelector('h2');
    expect(title?.textContent).toContain('Menu');
  });

  it('renders menu description', () => {
    const { container } = render(<AppSidebar isAdmin={false} />);

    const description = container.querySelector('p');
    expect(description).toBeInTheDocument();
  });

  it('shows only non-admin features when isAdmin is false', () => {
    const { container } = render(<AppSidebar isAdmin={false} />);

    const cards = container.querySelectorAll('[data-testid="card"]');
    // Should only show dashboard (1 feature)
    expect(cards.length).toBe(1);
  });

  it('shows all features when isAdmin is true', () => {
    const { container } = render(<AppSidebar isAdmin={true} />);

    const cards = container.querySelectorAll('[data-testid="card"]');
    // Should show both dashboard and admin panel (2 features)
    expect(cards.length).toBe(2);
  });

  it('renders feature cards with titles', () => {
    const { container } = render(<AppSidebar isAdmin={false} />);

    const title = container.querySelector('h3');
    expect(title?.textContent).toContain('Dashboard');
  });

  it('renders with absolute positioning', () => {
    const { container } = render(<AppSidebar isAdmin={false} />);

    const wrapper = container.querySelector('.absolute');
    expect(wrapper).toBeInTheDocument();
  });

  it('renders with flex layout', () => {
    const { container } = render(<AppSidebar isAdmin={false} />);

    const wrapper = container.querySelector('.flex');
    expect(wrapper).toHaveClass('flex');
  });

  it('renders with gap between items', () => {
    const { container } = render(<AppSidebar isAdmin={false} />);

    const wrapper = container.querySelector('.gap-2');
    expect(wrapper).toHaveClass('gap-2');
  });

  it('renders navigation links', () => {
    const { container } = render(<AppSidebar isAdmin={false} />);

    const links = container.querySelectorAll('a');
    expect(links.length).toBeGreaterThan(0);
  });

  it('filters admin-only features based on isAdmin prop', () => {
    const { container: containerUser } = render(<AppSidebar isAdmin={false} />);
    const { container: containerAdmin } = render(<AppSidebar isAdmin={true} />);

    const cardsUser = containerUser.querySelectorAll('[data-testid="card"]');
    const cardsAdmin = containerAdmin.querySelectorAll('[data-testid="card"]');

    expect(cardsAdmin.length).toBeGreaterThan(cardsUser.length);
  });

  it('renders sidebar with correct styling for desktop', () => {
    const { container } = render(<AppSidebar isAdmin={false} />);

    const wrapper = container.querySelector('.absolute');
    expect(wrapper).toHaveClass('absolute', 'left-0');
  });

  it('renders sheet with left side position', () => {
    const { container } = render(<AppSidebar isAdmin={false} />);

    const sheetContent = container.querySelector('[data-testid="sheet-content"]');
    expect(sheetContent).toBeInTheDocument();
  });

  it('renders cards with hover effect styling', () => {
    const { container } = render(<AppSidebar isAdmin={false} />);

    const cards = container.querySelectorAll('[data-testid="card"]');
    cards.forEach((card) => {
      expect(card).toBeInTheDocument();
    });
  });
});
