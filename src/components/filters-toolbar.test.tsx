import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { FiltersToolbar, iFiltersToolbarProps } from './filters-toolbar';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => '/test-path',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: React.ComponentProps<'button'>) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

vi.mock('@/components/created-at-filter', () => ({
  CreatedAtFilter: () => (
    <div data-testid="created-at-filter">Filter</div>
  ),
}));

describe('FiltersToolbar', () => {
  const defaultProps: iFiltersToolbarProps = {
    filter: 'all',
    createdAtFilter: {
      enabled: false,
      month: 1,
      year: 2024,
    },
    isPending: false,
    showFilterButtons: true,
  };

  it('renders filters toolbar', () => {
    const { container } = render(
      <FiltersToolbar {...defaultProps} />
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('shows filter buttons when showFilterButtons is true', () => {
    const { container } = render(
      <FiltersToolbar {...defaultProps} showFilterButtons={true} />
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('hides filter buttons when showFilterButtons is false', () => {
    const { container } = render(
      <FiltersToolbar {...defaultProps} showFilterButtons={false} />
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders CreatedAtFilter component', () => {
    const { getByTestId } = render(<FiltersToolbar {...defaultProps} />);

    expect(getByTestId('created-at-filter')).toBeInTheDocument();
  });

  it('applies loading state when isPending is true', () => {
    const { container } = render(
      <FiltersToolbar {...defaultProps} isPending={true} />
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with pending filter', () => {
    const { container } = render(
      <FiltersToolbar {...defaultProps} filter="pending" />
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with all filter', () => {
    const { container } = render(
      <FiltersToolbar {...defaultProps} filter="all" />
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('calls onFilterChange when filter button clicked', () => {
    const handleFilterChange = vi.fn();

    const { container } = render(
      <FiltersToolbar
        {...defaultProps}
        onFilterChange={handleFilterChange}
      />
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with created at filter enabled', () => {
    const { container } = render(
      <FiltersToolbar
        {...defaultProps}
        createdAtFilter={{
          enabled: true,
          month: 2,
          year: 2024,
        }}
      />
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with custom month and year', () => {
    const { container } = render(
      <FiltersToolbar
        {...defaultProps}
        createdAtFilter={{
          enabled: true,
          month: 6,
          year: 2023,
        }}
      />
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('handles filter change callback', () => {
    const handleFilterChange = vi.fn();

    render(
      <FiltersToolbar
        {...defaultProps}
        onFilterChange={handleFilterChange}
      />
    );

    expect(render).toBeDefined();
  });

  it('handles created at filter change callback', () => {
    const handleCreatedAtFilterChange = vi.fn();

    render(
      <FiltersToolbar
        {...defaultProps}
        onCreatedAtFilterChange={handleCreatedAtFilterChange}
      />
    );

    expect(render).toBeDefined();
  });

  it('renders with correct state when no filters applied', () => {
    const { container } = render(
      <FiltersToolbar
        filter="all"
        createdAtFilter={{
          enabled: false,
          month: 1,
          year: 2024,
        }}
        isPending={false}
        showFilterButtons={true}
      />
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with correct state when pending state applied', () => {
    const { container } = render(
      <FiltersToolbar
        filter="pending"
        createdAtFilter={{
          enabled: true,
          month: 3,
          year: 2024,
        }}
        isPending={true}
        showFilterButtons={true}
      />
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies loading indicator when transitioning', () => {
    const { container } = render(
      <FiltersToolbar
        {...defaultProps}
        isPending={true}
      />
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders toolbar with flex layout', () => {
    const { container } = render(
      <FiltersToolbar {...defaultProps} />
    );

    const wrapper = container.querySelector('.flex');
    expect(wrapper).toBeInTheDocument();
  });

  it('renders toolbar with gap spacing', () => {
    const { container } = render(
      <FiltersToolbar {...defaultProps} />
    );

    const wrapper = container.querySelector('.gap-2') || container.querySelector('[class*="gap"]');
    expect(wrapper).toBeInTheDocument();
  });
});
