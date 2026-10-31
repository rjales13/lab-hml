'use client';

import { CreatedAtFilter } from '@/components/created-at-filter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export type tRoteiroFilter = 'all' | 'sim' | 'nao';

interface iRoteiroFiltersToolbarProps {
  filter: tRoteiroFilter;
  createdAtFilter: {
    enabled: boolean;
    month: number;
    year: number;
  };
}

export function RoteiroFiltersToolbar({
  filter,
  createdAtFilter,
}: iRoteiroFiltersToolbarProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigateWithParams = ({
    nextFilter = filter,
    nextEnabled = createdAtFilter.enabled,
    nextMonth = createdAtFilter.month,
    nextYear = createdAtFilter.year,
  }: {
    nextFilter?: tRoteiroFilter;
    nextEnabled?: boolean;
    nextMonth?: number;
    nextYear?: number;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('filter', nextFilter);
    params.set('month', String(nextMonth));
    params.set('year', String(nextYear));
    params.set('createdAtFilter', String(nextEnabled));

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
          <div className="grid grid-cols-1 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 md:grid-cols-3 md:p-1.5">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              className={cn(
                'h-10 w-full cursor-pointer rounded-xl border-transparent bg-transparent px-4 text-slate-700 shadow-none transition-all duration-300 hover:bg-white hover:shadow-sm',
                filter === 'sim' &&
                  'border-slate-900 bg-white text-slate-900 shadow-sm hover:bg-white'
              )}
              title="sim"
              onClick={() => navigateWithParams({ nextFilter: 'sim' })}
            >
              {isPending && filter !== 'sim' ? (
                <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
              ) : (
                <span className="text-base">✓</span>
              )}
              Sim
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              className={cn(
                'h-10 w-full cursor-pointer rounded-xl border-transparent bg-transparent px-4 text-slate-700 shadow-none transition-all duration-300 hover:bg-white hover:shadow-sm',
                filter === 'nao' &&
                  'border-slate-900 bg-white text-slate-900 shadow-sm hover:bg-white'
              )}
              title="nao"
              onClick={() => navigateWithParams({ nextFilter: 'nao' })}
            >
              {isPending && filter !== 'nao' ? (
                <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
              ) : (
                <span className="text-base">—</span>
              )}
              Não
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
              onClick={() => navigateWithParams({ nextFilter: 'all' })}
            >
              {isPending && filter !== 'all' ? (
                <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
              ) : (
                <span className="text-base">×</span>
              )}
              Todas
            </Button>
          </div>
        </div>

        <div className="w-full md:w-auto md:min-w-fit md:shrink-0">
          <CreatedAtFilter
            enabled={createdAtFilter.enabled}
            selectedMonth={createdAtFilter.month}
            selectedYear={createdAtFilter.year}
            isPending={isPending}
            onMonthChange={(value) =>
              navigateWithParams({
                nextMonth: Number(value),
              })
            }
            onYearChange={(value) =>
              navigateWithParams({
                nextYear: Number(value),
              })
            }
            onEnabledChange={(checked) =>
              navigateWithParams({
                nextEnabled: checked,
              })
            }
          />
        </div>
      </div>

      {isPending && (
        <div className="mt-3 flex items-center justify-end gap-2 text-sm font-medium text-slate-500">
          <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
          Atualizando filtros...
        </div>
      )}
    </div>
  );
}
