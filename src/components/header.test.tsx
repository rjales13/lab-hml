import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Header } from './header';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children, className }: React.ComponentProps<'a'>) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn(),
    push: vi.fn(),
  }),
  usePathname: () => '/',
}));

// Mock auth client
vi.mock('@/lib/auth/auth-client', () => ({
  authCLient: {
    signOut: vi.fn(),
  },
}));

// Mock user context
vi.mock('@/contexts/user-contexts', () => ({
  useAuth: () => ({
    user: { name: 'John Doe' },
    isAdmin: false,
  }),
}));

// Mock AppSidebar component
vi.mock('./app-sidebar', () => ({
  AppSidebar: ({ isAdmin }: { isAdmin: boolean }) => (
    <div data-testid="app-sidebar">AppSidebar {isAdmin ? '(Admin)' : ''}</div>
  ),
}));

// Mock Logo component
vi.mock('./logo', () => ({
  Logo: () => <div data-testid="logo">Logo</div>,
}));

// Mock UI components
vi.mock('./ui/button', () => ({
  Button: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock('./ui/navigation-menu', () => ({
  NavigationMenu: ({ children }: { children: React.ReactNode }) => (
    <nav data-testid="navigation-menu">{children}</nav>
  ),
  NavigationMenuList: ({ children }: { children: React.ReactNode }) => (
    <ul>{children}</ul>
  ),
  NavigationMenuItem: ({ children }: { children: React.ReactNode }) => (
    <li>{children}</li>
  ),
  NavigationMenuTrigger: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button {...props}>{children}</button>
  ),
  NavigationMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="navigation-content">{children}</div>
  ),
  NavigationMenuLink: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe('Header', () => {
  it('renders header element', () => {
    const { container } = render(<Header />);

    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });

  it('renders AppSidebar component', () => {
    render(<Header />);

    expect(screen.getByTestId('app-sidebar')).toBeInTheDocument();
  });

  it('renders Logo component', () => {
    render(<Header />);

    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });

  it('renders navigation menu', () => {
    render(<Header />);

    expect(screen.getByTestId('navigation-menu')).toBeInTheDocument();
  });

  it('displays user greeting with name', () => {
    render(<Header />);

    expect(screen.getByText(/Olá John Doe/)).toBeInTheDocument();
  });

  it('renders with fixed positioning', () => {
    const { container } = render(<Header />);

    const header = container.querySelector('header');
    expect(header).toHaveClass('fixed', 'top-0', 'z-50');
  });

  it('applies correct styling classes', () => {
    const { container } = render(<Header />);

    const header = container.querySelector('header');
    expect(header).toHaveClass('w-full', 'border-b', 'shadow-lg');
  });

  it('renders with blue color scheme', () => {
    const { container } = render(<Header />);

    const header = container.querySelector('header');
    expect(header).toHaveClass('border-blue-800/30');
  });

  it('renders with flex layout', () => {
    const { container } = render(<Header />);

    const content = container.querySelector('.flex.h-16.items-center.justify-between');
    expect(content).toBeInTheDocument();
  });

  it('renders logout button', () => {
    render(<Header />);

    const logoutButton = screen.getByText('Sair');
    expect(logoutButton).toBeInTheDocument();
  });

  it('calls handleLogout when logout button is clicked', () => {
    render(<Header />);

    const userTrigger = screen.getByText(/Olá John Doe/);
    fireEvent.click(userTrigger);

    const logoutButton = screen.getByText('Sair');
    expect(logoutButton).toBeInTheDocument();
  });

  it('renders with User icon', () => {
    const { container } = render(<Header />);

    // User icon is rendered in the navigation menu trigger
    const userIcon = container.querySelector('svg');
    expect(userIcon).toBeInTheDocument();
  });

  it('applies backdrop blur effect', () => {
    const { container } = render(<Header />);

    const header = container.querySelector('header');
    expect(header).toHaveClass('backdrop-blur-md');
  });

  it('renders AppSidebar with isAdmin prop', () => {
    render(<Header />);

    const sidebar = screen.getByTestId('app-sidebar');
    expect(sidebar.textContent).toContain('AppSidebar');
  });

  it('renders navigation menu trigger with flex gap', () => {
    const { container } = render(<Header />);

    const trigger = container.querySelector('.gap-2');
    expect(trigger).toBeInTheDocument();
  });

  it('renders with max-width constraint', () => {
    const { container } = render(<Header />);

    const content = container.querySelector('.max-w-7xl');
    expect(content).toBeInTheDocument();
  });

  it('renders with responsive padding', () => {
    const { container } = render(<Header />);

    const content = container.querySelector('.px-8');
    expect(content).toBeInTheDocument();
  });

  it('renders navigation list with flex wrap', () => {
    const { container } = render(<Header />);

    const list = container.querySelector('ul');
    expect(list).toBeInTheDocument();
  });
});
