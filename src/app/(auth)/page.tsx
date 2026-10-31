import { auth } from '@/lib/auth';
import { UserRoleValue } from '@/models/user-role';
import { HomeTemplate } from '@/templates/home';
import { headers } from 'next/headers';

interface iHomePageProps {
  searchParams?:
    | Promise<{ [key: string]: string | string[] | undefined }>
    | { [key: string]: string | string[] | undefined };
}

const START_YEAR = 2026;

function getCurrentMonthYear() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === 'year')?.value ?? '1970';
  const month = parts.find((part) => part.type === 'month')?.value ?? '01';

  return {
    month: Number(month),
    year: Number(year),
  };
}

function getPeriodFromQuery(searchParamsValue?: {
  [key: string]: string | string[] | undefined;
}) {
  const currentDate = getCurrentMonthYear();
  const monthRaw = searchParamsValue?.month;
  const yearRaw = searchParamsValue?.year;

  const month =
    typeof monthRaw === 'string' && /^(?:[1-9]|1[0-2])$/.test(monthRaw)
      ? Number(monthRaw)
      : currentDate.month;

  const year =
    typeof yearRaw === 'string' && /^\d{4}$/.test(yearRaw)
      ? Number(yearRaw)
      : currentDate.year;

  const safeYear = Math.max(year, START_YEAR);
  const safeMonth = Math.min(Math.max(month, 1), 12);

  const period = `${safeYear}-${String(safeMonth).padStart(2, '0')}`;

  return {
    period,
    year: safeYear,
    month: safeMonth,
  };
}

export default async function Home({ searchParams }: iHomePageProps) {
  const userSession = await auth.api.getSession({ headers: await headers() });
  const queryParams = searchParams ? await searchParams : undefined;
  const selectedPeriod = getPeriodFromQuery(queryParams);

  return (
    <HomeTemplate
      userRole={{ role: userSession?.user.role as UserRoleValue }}
      selectedPeriod={selectedPeriod}
    />
  );
}
