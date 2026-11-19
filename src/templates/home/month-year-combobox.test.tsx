import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MonthYearCombobox } from './month-year-combobox';

const { routerPush } = vi.hoisted(() => ({
  routerPush: vi.fn(),
}));

const scrollIntoViewDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'scrollIntoView'
);

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: routerPush }),
  usePathname: () => '/home',
  useSearchParams: () => new URLSearchParams('filter=active'),
}));

describe('MonthYearCombobox', () => {
  afterEach(() => {
    vi.useRealTimers();
    if (scrollIntoViewDescriptor) {
      Object.defineProperty(
        HTMLElement.prototype,
        'scrollIntoView',
        scrollIntoViewDescriptor
      );
    } else {
      Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView');
    }
  });

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-07-14T12:00:00-03:00'));
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: () => {},
    });
  });

  it('shows the selected month and year', () => {
    render(<MonthYearCombobox selectedMonth={7} selectedYear={2026} />);

    expect(screen.getAllByRole('combobox')).toHaveLength(2);
    expect(screen.getByText('Julho')).toBeInTheDocument();
    expect(screen.getAllByText('2026')).toHaveLength(1);
  });

  it('updates the month while preserving the selected year and query parameters', async () => {
    render(<MonthYearCombobox selectedMonth={7} selectedYear={2026} />);

    fireEvent.keyDown(screen.getAllByRole('combobox')[0], {
      key: 'ArrowDown',
    });
    fireEvent.click(await screen.findByRole('option', { name: 'Janeiro' }));

    expect(routerPush).toHaveBeenCalledWith(
      '/home?filter=active&month=1&year=2026'
    );
  });

  it('updates the year while preserving the selected month and query parameters', async () => {
    vi.setSystemTime(new Date('2027-07-14T12:00:00-03:00'));
    render(<MonthYearCombobox selectedMonth={7} selectedYear={2026} />);

    fireEvent.keyDown(screen.getAllByRole('combobox')[1], {
      key: 'ArrowDown',
    });
    fireEvent.click(await screen.findByRole('option', { name: '2027' }));

    expect(routerPush).toHaveBeenCalledWith(
      '/home?filter=active&month=7&year=2027'
    );
  });
});
