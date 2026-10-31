import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { cn } from '@/lib/utils';

interface iTootipProps {
  text: string;
  size?: number;
  animate?: boolean;
}

export const Tootip = ({ text, size = 20, animate = false }: iTootipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info
            size={size}
            className={cn('text-orange-700', {
              'animate-pulse': animate,
            })}
          />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs rounded-md text-sm text-wrap">
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
