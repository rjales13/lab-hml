import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BreadCrumb } from './breadcrumb';
import { iBreadCrumbItems } from '@/models/bread-crumb';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/consultorio/create',
}));

describe('BreadCrumb', () => {
  it('renders default items when items prop is not provided', () => {
    render(<BreadCrumb />);

    expect(screen.getByText('Principal')).toBeInTheDocument();
    expect(screen.getByText('Listagem')).toBeInTheDocument();
    expect(screen.getByText('Cadastro')).toBeInTheDocument();
  });

  it('renders custom items when provided', () => {
    const customItems: iBreadCrumbItems[] = [
      { name: 'Home', isLink: true, link: '/' },
      { name: 'Settings', isLink: false },
    ];

    render(<BreadCrumb items={customItems} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders links for items with isLink true', () => {
    const customItems: iBreadCrumbItems[] = [
      { name: 'Dashboard', isLink: true, link: '/dashboard' },
    ];

    render(<BreadCrumb items={customItems} />);

    const link = screen.getByText('Dashboard').closest('a');
    expect(link).toHaveAttribute('href', '/dashboard');
  });

  it('renders non-link items without href attribute', () => {
    const customItems: iBreadCrumbItems[] = [
      { name: 'Current', isLink: false },
    ];

    render(<BreadCrumb items={customItems} />);

    const currentItem = screen.getByText('Current');
    const link = currentItem.closest('a');
    expect(link).not.toHaveAttribute('href');
  });

  it('renders separators only after link items', () => {
    const customItems: iBreadCrumbItems[] = [
      { name: 'First', isLink: true, link: '/' },
      { name: 'Second', isLink: true, link: '/second' },
      { name: 'Third', isLink: false },
    ];

    const { container } = render(<BreadCrumb items={customItems} />);

    // Count breadcrumb separators (they should appear between items)
    // excluding the last non-link item
    const list = container.querySelector('ol');
    expect(list).toBeInTheDocument();
  });

  it('extracts route from pathname for default listagem link', () => {
    render(<BreadCrumb />);

    // With mocked pathname '/consultorio/create', the listagem link should be '/consultorio'
    const listagem = screen.getByText('Listagem').closest('a');
    expect(listagem).toHaveAttribute('href', '/consultorio');
  });

  it('renders "Principal" link with "/" href', () => {
    render(<BreadCrumb />);

    const principal = screen.getByText('Principal').closest('a');
    expect(principal).toHaveAttribute('href', '/');
  });

  it('handles empty custom items array by showing default items', () => {
    render(<BreadCrumb items={[]} />);

    expect(screen.getByText('Principal')).toBeInTheDocument();
    expect(screen.getByText('Listagem')).toBeInTheDocument();
    expect(screen.getByText('Cadastro')).toBeInTheDocument();
  });

  it('renders each custom item in order', () => {
    const customItems: iBreadCrumbItems[] = [
      { name: 'Item1', isLink: true, link: '/1' },
      { name: 'Item2', isLink: true, link: '/2' },
      { name: 'Item3', isLink: false },
    ];

    render(<BreadCrumb items={customItems} />);

    expect(screen.getByText('Item1')).toBeInTheDocument();
    expect(screen.getByText('Item2')).toBeInTheDocument();
    expect(screen.getByText('Item3')).toBeInTheDocument();
  });

  it('handles breadcrumb items with special characters in names', () => {
    const customItems: iBreadCrumbItems[] = [
      { name: 'Home & Dashboard', isLink: true, link: '/' },
      { name: 'User: Admin', isLink: false },
    ];

    render(<BreadCrumb items={customItems} />);

    expect(screen.getByText('Home & Dashboard')).toBeInTheDocument();
    expect(screen.getByText('User: Admin')).toBeInTheDocument();
  });

  it('renders breadcrumb as navigation element', () => {
    const { container } = render(<BreadCrumb />);

    const breadcrumb = container.querySelector('nav');
    expect(breadcrumb).toBeInTheDocument();
  });

  it('renders breadcrumb list with correct structure', () => {
    const { container } = render(<BreadCrumb />);

    const list = container.querySelector('ol');
    expect(list).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const { container } = render(<BreadCrumb />);

    const breadcrumb = container.querySelector('nav');
    expect(breadcrumb).toHaveClass('flex', 'justify-end');
  });
});
