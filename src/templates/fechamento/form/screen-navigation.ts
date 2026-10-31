import { iNavigation } from '@/models/navigation';

export const screenNavigation: iNavigation[] = [
  { nav: 'voltar', applyDisable: false, action: 'goBack' },
  { nav: 'print', applyDisable: false, action: 'print' },
  { nav: 'salvar', applyDisable: true },
];
