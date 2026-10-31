import { X } from 'lucide-react';
import { Separator } from './ui/separator';

export const EmptyData = () => {
  return (
    <>
      <div className="text-muted-foreground flex items-center justify-center gap-2 rounded-md p-4 text-sm">
        <X className="text-red-500" />
        Não há registros...
      </div>
      <Separator />
    </>
  );
};
