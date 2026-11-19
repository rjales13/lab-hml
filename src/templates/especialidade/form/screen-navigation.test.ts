import { describe, expect, it } from 'vitest';
import { screenNavigation } from './screen-navigation';

describe('especialidade screen navigation', () => {
  it('defines back, delete, and save actions', () => {
    expect(screenNavigation).toEqual([
      { nav: 'voltar', applyDisable: false, action: 'goBack' },
      { nav: 'deletar', applyDisable: true, action: 'delete' },
      { nav: 'salvar', applyDisable: true },
    ]);
  });
});
