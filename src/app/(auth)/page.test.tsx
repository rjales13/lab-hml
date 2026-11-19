import { isValidElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { userRoles } from '@/models/user-role';
import { HomeTemplate } from '@/templates/home';
import HomePage from './page';

const { getSession } = vi.hoisted(() => ({
  getSession: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession,
    },
  },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn(async () => new Headers()),
}));

interface HomeTemplateProps {
  userRole: { role: string };
  selectedPeriod: {
    period: string;
    year: number;
    month: number;
  };
}

async function getHomeTemplateProps(
  searchParams?: Record<string, string | string[] | undefined>
) {
  const page = await HomePage({ searchParams });

  if (!isValidElement<HomeTemplateProps>(page)) {
    throw new Error('HomePage must render the HomeTemplate');
  }

  expect(page.type).toBe(HomeTemplate);
  return page.props;
}

function getCurrentSaoPauloPeriod() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(new Date());

  return {
    year: Number(parts.find((part) => part.type === 'year')?.value),
    month: Number(parts.find((part) => part.type === 'month')?.value),
  };
}

describe('HomePage', () => {
  beforeEach(() => {
    getSession.mockResolvedValue({
      user: { role: userRoles.ADMIN },
    });
  });

  it('passes the session role and requested period to the home template', async () => {
    const props = await getHomeTemplateProps({
      month: '7',
      year: '2027',
    });

    expect(props.userRole).toEqual({ role: userRoles.ADMIN });
    expect(props.selectedPeriod).toEqual({
      period: '2027-07',
      year: 2027,
      month: 7,
    });
  });

  it('keeps the requested month but clamps years before 2026', async () => {
    const props = await getHomeTemplateProps({
      month: '3',
      year: '2025',
    });

    expect(props.selectedPeriod).toEqual({
      period: '2026-03',
      year: 2026,
      month: 3,
    });
  });

  it('uses the current São Paulo period when query values are invalid', async () => {
    const currentPeriod = getCurrentSaoPauloPeriod();
    const props = await getHomeTemplateProps({
      month: ['2'],
      year: '26',
    });

    expect(props.selectedPeriod).toEqual({
      period: `${currentPeriod.year}-${String(currentPeriod.month).padStart(2, '0')}`,
      ...currentPeriod,
    });
  });
});
