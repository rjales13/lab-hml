import { isValidElement } from 'react';
import type { ComponentProps } from 'react';
import { describe, expect, it } from 'vitest';
import { EntradaListTemplate } from '@/templates/entrada';
import EntradaListPage from './page';

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

describe('EntradaListPage', () => {
  it('passes valid filter and period query parameters to the template', async () => {
    const page = await EntradaListPage({
      searchParams: Promise.resolve({
        filter: 'all',
        month: '7',
        year: '2027',
        createdAtFilter: 'true',
      }),
    });

    expect(isValidElement<ComponentProps<typeof EntradaListTemplate>>(page)).toBe(
      true
    );

    if (!isValidElement<ComponentProps<typeof EntradaListTemplate>>(page)) {
      throw new Error('EntradaListPage must render the entrada list template');
    }

    expect(page.props).toEqual({
      filter: 'all',
      createdAtFilter: {
        enabled: true,
        month: 7,
        year: 2027,
      },
    });
  });

  it('defaults to pending and the current period for invalid query parameters', async () => {
    const currentPeriod = getCurrentSaoPauloPeriod();
    const page = await EntradaListPage({
      searchParams: {
        filter: 'invalid',
        month: '0',
        year: '26',
        createdAtFilter: 'yes',
      },
    });

    expect(isValidElement<ComponentProps<typeof EntradaListTemplate>>(page)).toBe(
      true
    );

    if (!isValidElement<ComponentProps<typeof EntradaListTemplate>>(page)) {
      throw new Error('EntradaListPage must render the entrada list template');
    }

    expect(page.props).toEqual({
      filter: 'pending',
      createdAtFilter: {
        enabled: false,
        ...currentPeriod,
      },
    });
  });
});
