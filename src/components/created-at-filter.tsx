'use client';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface iCreatedAtFilterProps {
  enabled: boolean;
  selectedMonth: number;
  selectedYear: number;
  isPending: boolean;
  onMonthChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onEnabledChange: (checked: boolean) => void;
  label?: string;
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
  return MONTH_NAMES.map((label, index) => ({
    value: String(index + 1),
    label,
  }));
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

export const CreatedAtFilter = ({
  enabled,
  selectedMonth,
  selectedYear,
  isPending,
  onMonthChange,
  onYearChange,
  onEnabledChange,
  label = 'Filtro por data',
}: iCreatedAtFilterProps) => {
  return (
    <div className="flex w-full justify-end">
      <div className="flex w-full flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 md:w-auto md:flex-row md:flex-nowrap md:items-center md:gap-2 md:bg-white md:p-1.5">
        <Select
          value={String(selectedMonth)}
          onValueChange={onMonthChange}
          disabled={!enabled || isPending}
        >
          <SelectTrigger
            className="w-full border-slate-200 bg-white md:w-36"
            disabled={!enabled || isPending}
          >
            <SelectValue placeholder="Mês" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {getMonthOptions().map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={String(selectedYear)}
          onValueChange={onYearChange}
          disabled={!enabled || isPending}
        >
          <SelectTrigger
            className="w-full border-slate-200 bg-white md:w-28"
            disabled={!enabled || isPending}
          >
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {getYearOptions().map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <label
          htmlFor="created-at-filter"
          className="flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium whitespace-nowrap text-slate-700 md:shrink-0 md:justify-end"
        >
          <Checkbox
            id="created-at-filter"
            checked={enabled}
            disabled={isPending}
            onCheckedChange={(checked) => onEnabledChange(checked === true)}
          />
          {label}
        </label>
      </div>
    </div>
  );
};
