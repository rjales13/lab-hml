'use client';

import { useNavigation } from '@/hooks/navigation';
import { iNavigation } from '@/models/navigation';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Tootip } from './tootip';
import { INFO_MESSAGES } from '@/lib/messages/info';
import { ConfirmationDialog } from './confirmation-dialog';

interface iNavigationProps {
  id?: string;
  disabled?: boolean;
  navigation: iNavigation[];
  isMainTab?: boolean;
  onDelete?: () => void;
  onPrint?: () => void;
  onRefresh?: () => void;
}

export const Navigation = ({
  id,
  navigation,
  isMainTab = true,
  disabled,
  onDelete,
  onPrint,
  onRefresh,
}: iNavigationProps) => {
  const router = useRouter();
  const filteredNavigation = !id
    ? navigation.filter((item) => item.nav !== 'deletar')
    : navigation;

  const { navigationButtons } = useNavigation(filteredNavigation);

  const checkAction = (action: string) => {
    if (action === 'goBack') router.back();
    if (action === 'goHome') router.push('/');
    if (action === 'print') onPrint!();
    if (action === 'refresh') onRefresh!();
  };

  return (
    <div className="absolute -top-15 right-0 flex items-center justify-end gap-4">
      {navigationButtons.map((item) => {
        const lowerCaseItem = item.name.toLowerCase();
        const noMainTabApplyDisable =
          !isMainTab &&
          (lowerCaseItem === 'deletar' ||
            lowerCaseItem === 'salvar' ||
            lowerCaseItem === 'voltar');
        const button = (
          <Button
            key={item.name}
            type={item.type}
            title={lowerCaseItem}
            variant="outline"
            className={cn(
              lowerCaseItem === 'deletar' ? 'text-red-600' : 'text-blue-950',
              'w-fit cursor-pointer text-lg transition-shadow duration-300 hover:bg-gray-200'
            )}
            disabled={noMainTabApplyDisable || (item.applyDisable && disabled)}
            onClick={() => item.action && checkAction(item.action)}
          >
            <item.icon />
          </Button>
        );

        if (id && lowerCaseItem === 'deletar' && onDelete) {
          return (
            <ConfirmationDialog
              key={item.name}
              trigger={button}
              title="Tem certeza que deseja continuar?"
              description="Esta ação não poderá ser desfeita!"
              onConfirm={onDelete}
            />
          );
        }

        return button;
      })}
      {!isMainTab && (
        <Tootip text={INFO_MESSAGES.disabledSaveOrDelete} animate />
      )}
    </div>
  );
};
