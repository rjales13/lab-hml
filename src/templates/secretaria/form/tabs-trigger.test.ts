import { describe, expect, it } from 'vitest';
import { TABS } from './tabs-trigger';

describe('secretaria form tabs', () => {
  it('provides data and phone sections in order', () => {
    expect(TABS.map(({ value, description }) => ({ value, description }))).toEqual([
      { value: 'dados', description: 'Dados' },
      { value: 'telefones', description: 'Telefones' },
    ]);
  });
});
