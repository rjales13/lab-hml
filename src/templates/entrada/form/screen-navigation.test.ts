import { describe, expect, it } from 'vitest';
import { screenNavigation } from './screen-navigation';

describe('entrada screen navigation', () => {
  it('defines back, refresh, delete, and save actions', () => {
    expect(screenNavigation).toEqual([
      { nav: 'voltar', applyDisable: false, action: 'goBack' },
      { nav: 'refresh', applyDisable: false, action: 'refresh' },
      { nav: 'deletar', applyDisable: true, action: 'delete' },
      { nav: 'salvar', applyDisable: true },
    ]);
  });
});
