import { LucideIcon } from 'lucide-react';

export type tNavigationProviders =
  | 'voltar'
  | 'salvar'
  | 'deletar'
  | 'home'
  | 'print'
  | 'refresh';

export type tNavigationButtonType = 'submit' | 'button';

export interface iNavigationItensProps {
  name: string;
  type: tNavigationButtonType;
  icon: LucideIcon;
}

export interface iNavigation {
  nav: tNavigationProviders;
  applyDisable: boolean;
  action?: string;
}
