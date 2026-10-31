import { useMemo } from 'react';
import { iNavigation, iNavigationItensProps } from '@/models/navigation';
import { NAVIGATION_ITENS } from './itens';

interface iUseNavigationResponse extends iNavigationItensProps {
  applyDisable: boolean;
  action?: string;
}

export const useNavigation = (navigation: iNavigation[]) => {
  const navigationButtons = useMemo<iUseNavigationResponse[]>(
    () =>
      navigation.map((item) => ({
        name: NAVIGATION_ITENS[item.nav].name,
        type: NAVIGATION_ITENS[item.nav].type,
        applyDisable: item.applyDisable,
        icon: NAVIGATION_ITENS[item.nav].icon,
        action: item.action,
      })),
    [navigation]
  );

  return { navigationButtons };
};
