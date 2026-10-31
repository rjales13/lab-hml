'use client';

import { Funnel, FunnelX, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CreatedAtFilter } from '@/components/created-at-filter';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export interface iFiltersToolbarProps {
  filter?: 'pending' | 'all';
  createdAtFilter: {
    enabled: boolean;
    month: number;
    year: number;
  };
  isPending?: boolean;
  showFilterButtons?: boolean;
  onFilterChange?: (nextFilter: 'pending' | 'all') => void;
  onCreatedAtFilterChange?: (nextFilter: {
    enabled: boolean;
    month: number;
    year: number;
  }) => void;
}

export const FiltersToolbar = ({
  filter,
  createdAtFilter,
  isPending = false,
  showFilterButtons = true,
  onFilterChange,
  onCreatedAtFilterChange,
}: iFiltersToolbarProps) => {
  const [isTransitionPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigateWithParams = ({
    nextFilter = filter ?? 'all',
    nextEnabled = createdAtFilter.enabled,
    nextMonth = createdAtFilter.month,
    nextYear = createdAtFilter.year,
  }: {
    nextFilter?: 'pending' | 'all';
    nextEnabled?: boolean;
    nextMonth?: number;
    nextYear?: number;
  } = {}) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('filter', nextFilter);
    params.set('month', String(nextMonth));
    params.set('year', String(nextYear));
    params.set('createdAtFilter', String(nextEnabled));

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleFilterChange = (nextFilter: 'pending' | 'all') => {
    if (onFilterChange) {
      onFilterChange(nextFilter);
      return;
    }

    navigateWithParams({ nextFilter });
  };

  const handleCreatedAtFilterChange = (nextFilter: {
    enabled: boolean;
    month: number;
    year: number;
  }) => {
    if (onCreatedAtFilterChange) {
      onCreatedAtFilterChange(nextFilter);
      return;
    }

    navigateWithParams({
      nextFilter: filter,
      nextEnabled: nextFilter.enabled,
      nextMonth: nextFilter.month,
      nextYear: nextFilter.year,
    });
  };

  return (
    <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-5">
        {showFilterButtons && filter && (
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
            <div className="grid grid-cols-1 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 md:grid-cols-2 md:p-1.5">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                className={cn(
                  'h-10 w-full cursor-pointer rounded-xl border-transparent bg-transparent px-4 text-slate-700 shadow-none transition-all duration-300 hover:bg-white hover:shadow-sm',
                  filter === 'pending' &&
                    'border-slate-900 bg-white text-slate-900 shadow-sm hover:bg-white'
                )}
                title="pendentes"
                onClick={() => handleFilterChange('pending')}
              >
                {isTransitionPending && filter !== 'pending' ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Funnel />
                )}
                Pendentes
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                className={cn(
                  'h-10 w-full cursor-pointer rounded-xl border-transparent bg-transparent px-4 text-slate-700 shadow-none transition-all duration-300 hover:bg-white hover:shadow-sm',
                  filter === 'all' &&
                    'border-slate-900 bg-white text-slate-900 shadow-sm hover:bg-white'
                )}
                title="todas"
                onClick={() => handleFilterChange('all')}
              >
                {isTransitionPending && filter !== 'all' ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <FunnelX />
                )}
                Todas
              </Button>
            </div>
          </div>
        )}

        <div className="w-full md:w-auto md:min-w-fit md:shrink-0">
          <CreatedAtFilter
            enabled={createdAtFilter.enabled}
            selectedMonth={createdAtFilter.month}
            selectedYear={createdAtFilter.year}
            isPending={isTransitionPending}
            onMonthChange={(value) =>
              handleCreatedAtFilterChange({
                ...createdAtFilter,
                month: Number(value),
              })
            }
            onYearChange={(value) =>
              handleCreatedAtFilterChange({
                ...createdAtFilter,
                year: Number(value),
              })
            }
            onEnabledChange={(checked) =>
              handleCreatedAtFilterChange({
                ...createdAtFilter,
                enabled: checked,
              })
            }
          />
        </div>
      </div>

      {(isTransitionPending || isPending) && (
        <div className="mt-3 flex items-center justify-end gap-2 text-sm font-medium text-slate-500">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Atualizando filtros...
        </div>
      )}
    </div>
  );
};
