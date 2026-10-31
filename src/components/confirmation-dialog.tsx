import { Check, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

interface iConfirmationDialogProps {
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  title: string;
  cancelText?: string;
  description?: string;
  onConfirm?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const ConfirmationDialog = ({
  children,
  trigger,
  title,
  description,
  cancelText = 'Cancelar',
  onConfirm,
  open,
  onOpenChange,
}: iConfirmationDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description || ''}</AlertDialogDescription>
        </AlertDialogHeader>
        {children && <div className="my-4">{children}</div>}
        <AlertDialogFooter>
          <AlertDialogCancel
            title={cancelText}
            className="bg-accent cursor-pointer rounded-md p-1 text-red-600 hover:bg-gray-200"
          >
            <X />
          </AlertDialogCancel>
          {onConfirm && (
            <AlertDialogAction
              title="Confirmar"
              className="bg-accent cursor-pointer rounded-md p-1 text-blue-950 hover:bg-gray-200"
              onClick={onConfirm}
            >
              <Check />
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
