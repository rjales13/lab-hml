import { isValidElement } from 'react';
import type { ComponentProps } from 'react';
import { describe, expect, it } from 'vitest';
import { FechamentoListTemplate } from '@/templates/fechamento/list';
import FechamentoListPage from './page';

describe('FechamentoListPage', () => {
  it('passes the route id to the fechamento list template', async () => {
    const page = await FechamentoListPage({
      params: Promise.resolve({ id: 'consultorio-123' }),
    });

    expect(isValidElement<ComponentProps<typeof FechamentoListTemplate>>(page)).toBe(
      true
    );

    if (!isValidElement<ComponentProps<typeof FechamentoListTemplate>>(page)) {
      throw new Error(
        'FechamentoListPage must render the fechamento list template'
      );
    }

    expect(page.type).toBe(FechamentoListTemplate);
    expect(page.props.id).toBe('consultorio-123');
  });
});
