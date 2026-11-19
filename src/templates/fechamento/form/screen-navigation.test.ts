import { describe, expect, it } from 'vitest';
import { screenNavigation } from './screen-navigation';

describe('fechamento screen navigation', () => {
  it('provides back, print, and save actions', () => {
    expect(screenNavigation).toEqual([
      { nav: 'voltar', applyDisable: false, action: 'goBack' },
      { nav: 'print', applyDisable: false, action: 'print' },
      { nav: 'salvar', applyDisable: true },
    ]);
  });
});
