import { isValidElement } from 'react';
import type { ComponentProps } from 'react';
import { describe, expect, it } from 'vitest';
import { FechamentoFormTemplate } from '@/templates/fechamento/form';
import FechamentoFormPage from './page';

describe('FechamentoFormPage', () => {
  it('passes the selected route id and query id to the form template', async () => {
    const page = await FechamentoFormPage({
      params: Promise.resolve({ id: 'cconsultorio-123' }),
      searchParams: Promise.resolve({ param: 'fechamento-456' }),
    });

    expect(isValidElement<ComponentProps<typeof FechamentoFormTemplate>>(page)).toBe(
      true
    );

    if (!isValidElement<ComponentProps<typeof FechamentoFormTemplate>>(page)) {
      throw new Error(
        'FechamentoFormPage must render the fechamento form template'
      );
    }

    expect(page.type).toBe(FechamentoFormTemplate);
    expect(page.props).toEqual({
      selectedId: 'cconsultorio-123',
      fechamentoId: 'fechamento-456',
    });
  });

  it('passes an undefined fechamento id when the query parameter is absent', async () => {
    const page = await FechamentoFormPage({
      params: Promise.resolve({ id: 'ddentista-123' }),
      searchParams: {},
    });

    expect(isValidElement<ComponentProps<typeof FechamentoFormTemplate>>(page)).toBe(
      true
    );

    if (!isValidElement<ComponentProps<typeof FechamentoFormTemplate>>(page)) {
      throw new Error(
        'FechamentoFormPage must render the fechamento form template'
      );
    }

    expect(page.props).toEqual({
      selectedId: 'ddentista-123',
      fechamentoId: undefined,
    });
  });
});
