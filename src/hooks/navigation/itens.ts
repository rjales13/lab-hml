import {
  iNavigationItensProps,
  tNavigationProviders,
} from '@/models/navigation';
import {
  ArrowBigLeft,
  Home,
  Printer,
  RefreshCw,
  Save,
  Trash,
} from 'lucide-react';

type tNavigationItems = Record<tNavigationProviders, iNavigationItensProps>;

export const NAVIGATION_ITENS: tNavigationItems = {
  home: {
    name: 'HOME',
    type: 'button',
    icon: Home,
  },
  voltar: {
    name: 'VOLTAR',
    type: 'button',
    icon: ArrowBigLeft,
  },
  salvar: {
    name: 'SALVAR',
    type: 'submit',
    icon: Save,
  },
  deletar: {
    name: 'DELETAR',
    type: 'button',
    icon: Trash,
  },
  print: {
    name: 'IMPRIMIR',
    type: 'button',
    icon: Printer,
  },
  refresh: {
    name: 'ATUALIZAR',
    type: 'button',
    icon: RefreshCw,
  },
};
