import { isValidElement } from 'react';
import type { ComponentProps } from 'react';
import { describe, expect, it } from 'vitest';
import { RoteiroListTemplate } from '@/templates/roteiro';
import RoteiroListPage from './page';

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

describe('RoteiroListPage', () => {
  it('passes valid filter and period query parameters to the template', async () => {
    const page = await RoteiroListPage({
      searchParams: Promise.resolve({
        filter: 'sim',
        month: '7',
        year: '2027',
        createdAtFilter: 'true',
      }),
    });

    expect(isValidElement<ComponentProps<typeof RoteiroListTemplate>>(page)).toBe(
      true
    );

    if (!isValidElement<ComponentProps<typeof RoteiroListTemplate>>(page)) {
      throw new Error('RoteiroListPage must render the roteiro list template');
    }

    expect(page.props).toEqual({
      filter: 'sim',
      createdAtFilter: {
        enabled: true,
        month: 7,
        year: 2027,
      },
    });
  });

  it('uses safe defaults for invalid query parameters', async () => {
    const currentPeriod = getCurrentSaoPauloPeriod();
    const page = await RoteiroListPage({
      searchParams: {
        filter: 'invalid',
        month: '13',
        year: '26',
        createdAtFilter: 'yes',
      },
    });

    expect(isValidElement<ComponentProps<typeof RoteiroListTemplate>>(page)).toBe(
      true
    );

    if (!isValidElement<ComponentProps<typeof RoteiroListTemplate>>(page)) {
      throw new Error('RoteiroListPage must render the roteiro list template');
    }

    expect(page.props).toEqual({
      filter: 'all',
      createdAtFilter: {
        enabled: false,
        ...currentPeriod,
      },
    });
  });
});
