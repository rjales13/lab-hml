import { describe, expect, it } from 'vitest';
import { TABS } from './tabs-trigger';

describe('roteiro form tabs', () => {
  it('provides data and entry sections in order', () => {
    expect(TABS.map(({ value, description }) => ({ value, description }))).toEqual([
      { value: 'dados', description: 'Dados' },
      { value: 'entradas', description: 'Entradas' },
    ]);
  });
});
