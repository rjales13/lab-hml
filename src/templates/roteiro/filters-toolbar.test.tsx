import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RoteiroFiltersToolbar } from './filters-toolbar';

const { routerPush } = vi.hoisted(() => ({
  routerPush: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: routerPush }),
  usePathname: () => '/roteiro',
  useSearchParams: () => new URLSearchParams('keep=value'),
}));

vi.mock('@/components/created-at-filter', () => ({
  CreatedAtFilter: ({
    enabled,
    selectedMonth,
    selectedYear,
    onMonthChange,
    onYearChange,
    onEnabledChange,
  }: {
    enabled: boolean;
    selectedMonth: number;
    selectedYear: number;
    onMonthChange: (month: string) => void;
    onYearChange: (year: string) => void;
    onEnabledChange: (enabled: boolean) => void;
  }) => (
    <div>
      <span>{`${enabled}-${selectedMonth}-${selectedYear}`}</span>
      <button onClick={() => onMonthChange('8')}>Change month</button>
      <button onClick={() => onYearChange('2027')}>Change year</button>
      <button onClick={() => onEnabledChange(false)}>Disable date filter</button>
    </div>
  ),
}));

describe('RoteiroFiltersToolbar', () => {
  const createdAtFilter = { enabled: true, month: 7, year: 2026 };

  it('shows delivery filters and the selected date filter state', () => {
    render(
      <RoteiroFiltersToolbar filter="nao" createdAtFilter={createdAtFilter} />
    );

    expect(screen.getByTitle('sim')).toBeInTheDocument();
    expect(screen.getByTitle('nao')).toBeInTheDocument();
    expect(screen.getByTitle('todas')).toBeInTheDocument();
    expect(screen.getByText('true-7-2026')).toBeInTheDocument();
  });

  it('preserves existing query parameters when changing delivery status', () => {
    render(
      <RoteiroFiltersToolbar filter="nao" createdAtFilter={createdAtFilter} />
    );

    fireEvent.click(screen.getByTitle('sim'));

    expect(routerPush).toHaveBeenCalledWith(
      '/roteiro?keep=value&filter=sim&month=7&year=2026&createdAtFilter=true'
    );
  });

  it('updates month, year, and date-filter query values', () => {
    render(
      <RoteiroFiltersToolbar filter="all" createdAtFilter={createdAtFilter} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Change month' }));
    fireEvent.click(screen.getByRole('button', { name: 'Change year' }));
    fireEvent.click(
      screen.getByRole('button', { name: 'Disable date filter' })
    );

    expect(routerPush).toHaveBeenNthCalledWith(
      1,
      '/roteiro?keep=value&filter=all&month=8&year=2026&createdAtFilter=true'
    );
    expect(routerPush).toHaveBeenNthCalledWith(
      2,
      '/roteiro?keep=value&filter=all&month=7&year=2027&createdAtFilter=true'
    );
    expect(routerPush).toHaveBeenNthCalledWith(
      3,
      '/roteiro?keep=value&filter=all&month=7&year=2026&createdAtFilter=false'
    );
  });
});
