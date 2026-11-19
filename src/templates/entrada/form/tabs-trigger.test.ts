import { describe, expect, it } from 'vitest';
import { TABS } from './tabs-trigger';

describe('entrada form tabs', () => {
  it('provides the entry data and services sections in navigation order', () => {
    expect(TABS.map(({ value, description }) => ({ value, description }))).toEqual([
      { value: 'dados', description: 'Dados' },
      { value: 'servicos', description: 'Serviços' },
    ]);
  });
});
