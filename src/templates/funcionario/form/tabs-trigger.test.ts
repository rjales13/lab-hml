import { describe, expect, it } from 'vitest';
import { TABS } from './tabs-trigger';

describe('funcionario form tabs', () => {
  it('provides data, phone, and function sections in order', () => {
    expect(TABS.map(({ value, description }) => ({ value, description }))).toEqual([
      { value: 'dados', description: 'Dados' },
      { value: 'telefones', description: 'Telefones' },
      { value: 'funcoes', description: 'Funções' },
    ]);
  });
});
