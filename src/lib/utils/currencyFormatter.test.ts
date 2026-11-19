import { describe, expect, it } from 'vitest';
import { currencyFormatter } from './currencyFormatter';

describe('currencyFormatter', () => {
  it('formats a whole number as BRL currency', () => {
    const result = currencyFormatter.format(100);
    expect(result).toMatch(/^R\$\s100,00$/);
  });

  it('formats a decimal number with cents', () => {
    const result = currencyFormatter.format(100.5);
    expect(result).toMatch(/^R\$\s100,50$/);
  });

  it('formats zero as BRL currency', () => {
    const result = currencyFormatter.format(0);
    expect(result).toMatch(/^R\$\s0,00$/);
  });

  it('formats negative values with minus sign', () => {
    const result = currencyFormatter.format(-100);
    expect(result).toMatch(/^-R\$\s100,00$/);
  });

  it('formats small decimal values correctly', () => {
    const result = currencyFormatter.format(0.01);
    expect(result).toMatch(/^R\$\s0,01$/);
  });

  it('formats large numbers with thousands separator', () => {
    const result = currencyFormatter.format(1234.56);
    expect(result).toMatch(/^R\$\s1\.234,56$/);
  });

  it('formats very large numbers correctly', () => {
    const result = currencyFormatter.format(1000000);
    expect(result).toMatch(/^R\$\s1\.000\.000,00$/);
  });

  it('rounds to two decimal places', () => {
    const result = currencyFormatter.format(100.555);
    expect(result).toMatch(/^R\$\s100,56$/);
  });

  it('uses Brazilian locale formatting (comma for decimals, dot for thousands)', () => {
    const formatted = currencyFormatter.format(1234.56);
    expect(formatted).toContain('1.234');
    expect(formatted).toContain(',56');
  });

  it('uses BRL currency symbol (R$)', () => {
    const formatted = currencyFormatter.format(50);
    expect(formatted).toContain('R$');
  });
});
