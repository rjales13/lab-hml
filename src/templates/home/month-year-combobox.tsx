'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoaderCircle } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

interface iMonthYearComboboxProps {
  selectedMonth: number;
  selectedYear: number;
}

const START_YEAR = 2026;
const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

function getMonthOptions() {
  const monthOrder = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1];

  return monthOrder.map((month) => {
    return {
      value: String(month),
      label: MONTH_NAMES[month - 1],
    };
  });
}

function getYearOptions() {
  const currentYear = new Date().getFullYear();
  const totalYears = currentYear - START_YEAR + 1;

  return Array.from({ length: Math.max(totalYears, 1) }, (_, index) => {
    const year = START_YEAR + index;
    return {
      value: String(year),
      label: String(year),
    };
  });
}

export const MonthYearCombobox = ({
  selectedMonth,
  selectedYear,
}: iMonthYearComboboxProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const monthOptions = getMonthOptions();
  const yearOptions = getYearOptions();

  const navigateToPeriod = (month: string, year: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('month', month);
    params.set('year', year);

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleMonthChange = (value: string) => {
    if (value === String(selectedMonth)) return;
    navigateToPeriod(value, String(selectedYear));
  };

  const handleYearChange = (value: string) => {
    if (value === String(selectedYear)) return;
    navigateToPeriod(String(selectedMonth), value);
  };

  return (
    <div className="my-4 flex flex-wrap items-center justify-end gap-2">
      {isPending && (
        <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500">
          <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
          Atualizando dashboard...
        </div>
      )}

      <Select
        value={String(selectedMonth)}
        onValueChange={handleMonthChange}
        disabled={isPending}
      >
        <SelectTrigger
          className="w-full cursor-pointer md:w-40"
          disabled={isPending}
        >
          <SelectValue placeholder="Mês" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {monthOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={String(selectedYear)}
        onValueChange={handleYearChange}
        disabled={isPending}
      >
        <SelectTrigger
          className="w-full cursor-pointer md:w-32"
          disabled={isPending}
        >
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {yearOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
