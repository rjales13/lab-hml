import { describe, expect, it } from 'vitest';
import { TABS } from './tabs-trigger';

describe('fechamento form tabs', () => {
  it('provides data, discounts, and observation sections in order', () => {
    expect(TABS.map(({ value, description }) => ({ value, description }))).toEqual([
      { value: 'dados', description: 'Dados' },
      { value: 'descontos', description: 'Descontos' },
      { value: 'observacao', description: 'Observação' },
    ]);
  });
});
