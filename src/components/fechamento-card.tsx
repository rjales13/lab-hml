import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  CircleDollarSign,
  Download,
  List,
  LoaderCircle,
  Undo,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { ConfirmationDialog } from './confirmation-dialog';
import { iFechamentoCloseProps } from '@/models/fechamento';
import { currencyFormatter } from '@/lib/utils/currencyFormatter';

type FechamentoCardProps = {
  id: string;
  date: Date;
  status: 'aberto' | 'fechado';
  value: number;
  beforeLast: string | null;
  onHandleViewCard: (id: string) => void;
  onHandleCloseCard: ({ date }: iFechamentoCloseProps) => Promise<void>;
  onHandleUnCloseCard: ({ id }: iFechamentoCloseProps) => Promise<void>;
  onHandleDownload: (id: string) => Promise<void>;
  isDownloading: boolean;
  isClosing: boolean;
  isUnclosing: boolean;
};

export const FechamentoCard = ({
  id,
  date,
  status,
  value,
  beforeLast,
  onHandleViewCard,
  onHandleCloseCard,
  onHandleUnCloseCard,
  onHandleDownload,
  isDownloading,
  isClosing,
  isUnclosing,
}: FechamentoCardProps) => {
  const statusMap = {
    aberto: { label: 'Aberto', variant: 'outline' as const },
    fechado: { label: 'Fechado', variant: 'default' as const },
  };

  const statusInfo = statusMap[status];
  const START = status === 'aberto' && value > 0;
  const UNDO = status === 'fechado' && id === beforeLast;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Card
          className={cn(
            'w-full cursor-pointer transition-shadow hover:shadow-lg lg:max-w-xs',
            status === 'fechado' ? 'opacity-65' : ''
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold capitalize">
              {date.toLocaleString('pt-BR', {
                month: 'long',
                timeZone: 'UTC',
              })}
            </CardTitle>
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </CardHeader>

          <CardContent>
            <div className="col flex items-center justify-between">
              <div className="flex gap-1">
                <CircleDollarSign size={22} />
              </div>
              <span className="text-lg font-bold">
                {currencyFormatter.format(value)}
              </span>
            </div>
          </CardContent>
        </Card>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-(--radix-dropdown-menu-trigger-width)"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onHandleViewCard(id as string)}
          >
            <List />
            Visualizar
          </DropdownMenuItem>
          {status === 'fechado' && (
            <DropdownMenuItem
              className="cursor-pointer"
              disabled={isDownloading}
              onClick={() => onHandleDownload(id as string)}
            >
              {isDownloading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <Download />
              )}
              {isDownloading ? 'Baixando PDF...' : 'Baixar PDF'}
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        {(START || UNDO) && <DropdownMenuSeparator />}
        <DropdownMenuGroup>
          {START && (
            <ConfirmationDialog
              trigger={
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  disabled={isClosing}
                  className="flex cursor-pointer items-center gap-2"
                >
                  {isClosing ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  {isClosing ? 'Iniciando Fechamento...' : 'Iniciar Fechamento'}
                </DropdownMenuItem>
              }
              title="Tem certeza que deseja continuar?"
              onConfirm={() => onHandleCloseCard({ id, date })}
            />
          )}
          {UNDO && (
            <ConfirmationDialog
              trigger={
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  disabled={isUnclosing}
                  className="flex cursor-pointer items-center gap-2"
                  variant="destructive"
                >
                  {isUnclosing ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Undo />
                  )}
                  {isUnclosing
                    ? 'Revertendo Fechamento...'
                    : 'Reverter Fechamento'}
                </DropdownMenuItem>
              }
              title="Tem certeza que deseja continuar?"
              onConfirm={() => onHandleUnCloseCard({ id })}
            />
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
