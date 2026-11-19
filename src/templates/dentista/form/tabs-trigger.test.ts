import { describe, expect, it } from 'vitest';
import { TABS } from './tabs-trigger';

describe('dentista form tabs', () => {
  it('provides the expected form sections in navigation order', () => {
    expect(TABS.map(({ value, description }) => ({ value, description }))).toEqual([
      { value: 'dados', description: 'Dados' },
      { value: 'telefones', description: 'Telefones' },
      { value: 'especialidades', description: 'Especialidades' },
    ]);
  });
});
