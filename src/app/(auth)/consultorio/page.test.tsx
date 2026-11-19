import { isValidElement } from 'react';
import type { ComponentProps } from 'react';
import { describe, expect, it } from 'vitest';
import { ConsultorioListTemplate } from '@/templates/consultorio';
import ConsultorioListPage from './page';

describe('ConsultorioListPage', () => {
  it('renders the office list template', async () => {
    const page = await ConsultorioListPage();

    expect(
      isValidElement<ComponentProps<typeof ConsultorioListTemplate>>(page)
    ).toBe(true);

    if (!isValidElement<ComponentProps<typeof ConsultorioListTemplate>>(page)) {
      throw new Error('ConsultorioListPage must render the office list template');
    }

    expect(page.type).toBe(ConsultorioListTemplate);
  });
});
