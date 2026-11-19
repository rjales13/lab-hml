import { describe, expect, it, vi } from 'vitest';
import { monetaryFormat } from './monetaryFormat';

vi.mock('./currencyFormatter', () => ({
  currencyFormatter: {
    format: vi.fn((value: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    }),
  },
}));

describe('monetaryFormat', () => {
  it('formats a string with cents to monetary value', () => {
    const result = monetaryFormat('15050');
    expect(result).toMatch(/R\$\s150,50/);
  });

  it('formats a string with only whole cents to monetary value', () => {
    const result = monetaryFormat('100');
    expect(result).toMatch(/R\$\s1,00/);
  });

  it('formats zero correctly', () => {
    const result = monetaryFormat('0');
    expect(result).toMatch(/R\$\s0,00/);
  });

  it('formats single digit as cents', () => {
    const result = monetaryFormat('5');
    expect(result).toMatch(/R\$\s0,05/);
  });

  it('removes non-numeric characters before formatting', () => {
    const result = monetaryFormat('R$ 100,50');
    expect(result).toMatch(/R\$\s100,50/);
  });

  it('handles monetary string with special characters', () => {
    const result = monetaryFormat('R$ 1.234,56');
    expect(result).toMatch(/R\$\s1\.234,56/);
  });

  it('formats large amounts correctly', () => {
    const result = monetaryFormat('1000000');
    expect(result).toMatch(/R\$\s10.000,00/);
  });

  it('formats amount with thousands correctly', () => {
    const result = monetaryFormat('123456');
    expect(result).toMatch(/R\$\s1.234,56/);
  });

  it('handles empty string', () => {
    const result = monetaryFormat('');
    expect(result).toBe('');
  });

  it('handles string with only non-numeric characters', () => {
    const result = monetaryFormat('abc-def');
    expect(result).toBe('');
  });

  it('formats two digit input as cents', () => {
    const result = monetaryFormat('99');
    expect(result).toMatch(/R\$\s0,99/);
  });

  it('formats three digit input correctly', () => {
    const result = monetaryFormat('123');
    expect(result).toMatch(/R\$\s1,23/);
  });

  it('rounds correctly when necessary', () => {
    const result = monetaryFormat('12345');
    expect(result).toMatch(/R\$\s123,45/);
  });

  it('handles leading zeros', () => {
    const result = monetaryFormat('00100');
    expect(result).toMatch(/R\$\s1,00/);
  });

  it('extracts only digits from mixed input', () => {
    const result = monetaryFormat('R$ 50-00');
    expect(result).toMatch(/R\$\s50,00/);
  });
});
