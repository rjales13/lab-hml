import { isValidElement } from 'react';
import type { ComponentProps } from 'react';
import { describe, expect, it } from 'vitest';
import { EspecialidadeListTemplate } from '@/templates/especialidade';
import EspecialidadeListPage from './page';

describe('EspecialidadeListPage', () => {
  it('renders the specialty list template', async () => {
    const page = await EspecialidadeListPage();

    expect(
      isValidElement<ComponentProps<typeof EspecialidadeListTemplate>>(page)
    ).toBe(true);

    if (!isValidElement<ComponentProps<typeof EspecialidadeListTemplate>>(page)) {
      throw new Error(
        'EspecialidadeListPage must render the specialty list template'
      );
    }

    expect(page.type).toBe(EspecialidadeListTemplate);
  });
});
