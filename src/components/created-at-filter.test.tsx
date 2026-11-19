import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CreatedAtFilter, iCreatedAtFilterProps } from './created-at-filter';

describe('CreatedAtFilter', () => {
  const originalScrollIntoView = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollIntoView');
  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: vi.fn() });
  });
  afterEach(() => {
    if (originalScrollIntoView) {
      Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', originalScrollIntoView);
    } else {
      Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView');
    }
  });

  const props: iCreatedAtFilterProps = {
    enabled: true,
    selectedMonth: 1,
    selectedYear: 2026,
    isPending: false,
    onMonthChange: vi.fn(),
    onYearChange: vi.fn(),
    onEnabledChange: vi.fn(),
  };

  it('shows selected month and year and its default label', () => {
    render(<CreatedAtFilter {...props} />);

    expect(screen.getByRole('checkbox', { name: 'Filtro por data' })).toBeChecked();
    const [month, year] = screen.getAllByRole('combobox');
    expect(month).toHaveTextContent('Janeiro');
    expect(year).toHaveTextContent('2026');
    expect(month).toBeEnabled();
    expect(year).toBeEnabled();
  });

  it('reports the selected month', async () => {
    const onMonthChange = vi.fn();
    render(<CreatedAtFilter {...props} onMonthChange={onMonthChange} />);

    fireEvent.keyDown(screen.getAllByRole('combobox')[0], { key: 'ArrowDown' });
    fireEvent.keyDown(await screen.findByRole('option', { name: 'Fevereiro' }), { key: 'Enter' });
    expect(onMonthChange).toHaveBeenCalledWith('2');
  });

  it('reports the selected year', async () => {
    const onYearChange = vi.fn();
    render(<CreatedAtFilter {...props} selectedYear={2025} onYearChange={onYearChange} />);

    fireEvent.keyDown(screen.getAllByRole('combobox')[1], { key: 'ArrowDown' });
    fireEvent.keyDown(await screen.findByRole('option', { name: '2026' }), { key: 'Enter' });
    expect(onYearChange).toHaveBeenCalledWith('2026');
  });

  it('reports enabling the filter and uses a custom label', () => {
    const onEnabledChange = vi.fn();
    render(<CreatedAtFilter {...props} enabled={false} label="Por data" onEnabledChange={onEnabledChange} />);

    fireEvent.click(screen.getByRole('checkbox', { name: 'Por data' }));
    expect(onEnabledChange).toHaveBeenCalledWith(true);
    expect(screen.getAllByRole('combobox')).toHaveLength(2);
    expect(screen.getAllByRole('combobox').every((element) => element.hasAttribute('disabled'))).toBe(true);
  });

  it('disables all controls while pending', () => {
    render(<CreatedAtFilter {...props} isPending />);

    expect(screen.getByRole('checkbox')).toBeDisabled();
    screen.getAllByRole('combobox').forEach((control) => expect(control).toBeDisabled());
  });
});
