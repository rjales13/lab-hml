import { RoteiroListTemplate } from '@/templates/roteiro';

interface iRoteiroListPageProps {
  searchParams?:
    | Promise<{ [key: string]: string | string[] | undefined }>
    | { [key: string]: string | string[] | undefined };
}

function getCurrentMonthYear() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === 'year')?.value ?? '1970';
  const month = parts.find((part) => part.type === 'month')?.value ?? '01';

  return {
    year: Number(year),
    month: Number(month),
  };
}

export default async function RoteiroListPage({
  searchParams,
}: iRoteiroListPageProps) {
  const queryParams = searchParams ? await searchParams : undefined;
  const filterValue = queryParams?.filter;
  const monthValue = queryParams?.month;
  const yearValue = queryParams?.year;
  const createdAtFilterValue = queryParams?.createdAtFilter;
  const currentPeriod = getCurrentMonthYear();

  const filter =
    filterValue === 'sim' ? 'sim' : filterValue === 'nao' ? 'nao' : 'all';

  const month =
    typeof monthValue === 'string' && /^(?:[1-9]|1[0-2])$/.test(monthValue)
      ? Number(monthValue)
      : currentPeriod.month;

  const year =
    typeof yearValue === 'string' && /^\d{4}$/.test(yearValue)
      ? Number(yearValue)
      : currentPeriod.year;

  const createdAtFilterEnabled = createdAtFilterValue === 'true';

  return (
    <RoteiroListTemplate
      filter={filter}
      createdAtFilter={{
        enabled: createdAtFilterEnabled,
        month,
        year,
      }}
    />
  );
}
