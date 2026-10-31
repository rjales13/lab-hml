import { iNavigation } from '@/models/navigation';

export const screenNavigation: iNavigation[] = [
  { nav: 'voltar', applyDisable: false, action: 'goBack' },
  {
    nav: 'deletar',
    applyDisable: true,
    action: 'delete',
  },
  { nav: 'salvar', applyDisable: true },
];
