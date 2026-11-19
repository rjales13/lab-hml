import { describe, expect, it } from 'vitest';
import { TABS } from './tabs-trigger';

describe('servico form tabs', () => {
  it('provides data and all price categories in order', () => {
    expect(TABS.map(({ value, description }) => ({ value, description }))).toEqual([
      { value: 'dados', description: 'Dados' },
      { value: 'valor_sem_nota', description: 'Valores Sem Nota' },
      { value: 'valor_com_nota', description: 'Valores Com Nota' },
      { value: 'valor_unicid', description: 'Valores Unicid' },
      { value: 'valor_pinheros', description: 'Valores Pinheros' },
    ]);
  });
});
