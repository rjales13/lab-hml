import { describe, expect, it } from 'vitest';
import { screenNavigation } from './screen-navigation';

describe('consultorio screen navigation', () => {
  it('defines home, back, delete, and save actions', () => {
    expect(screenNavigation).toEqual([
      { nav: 'home', applyDisable: false, action: 'goHome' },
      { nav: 'voltar', applyDisable: false, action: 'goBack' },
      { nav: 'deletar', applyDisable: true, action: 'delete' },
      { nav: 'salvar', applyDisable: true },
    ]);
  });
});
