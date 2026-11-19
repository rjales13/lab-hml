import { describe, expect, it } from 'vitest';
import { capitalize } from './capitalize';

describe('capitalize', () => {
  it('capitalizes the first letter', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('keeps the remaining letters unchanged', () => {
    expect(capitalize('hELLO')).toBe('HELLO');
  });

  it('returns an empty string when given an empty string', () => {
    expect(capitalize('')).toBe('');
  });

  it('handles a single character', () => {
    expect(capitalize('a')).toBe('A');
  });
});
