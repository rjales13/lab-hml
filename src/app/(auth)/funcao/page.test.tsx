import { isValidElement } from 'react';
import type { ComponentProps } from 'react';
import { describe, expect, it } from 'vitest';
import { FuncaoListTemplate } from '@/templates/funcao';
import FuncaoListPage from './page';

describe('FuncaoListPage', () => {
  it('renders the function list template', async () => {
    const page = await FuncaoListPage();

    expect(isValidElement<ComponentProps<typeof FuncaoListTemplate>>(page)).toBe(
      true
    );

    if (!isValidElement<ComponentProps<typeof FuncaoListTemplate>>(page)) {
      throw new Error('FuncaoListPage must render the function list template');
    }

    expect(page.type).toBe(FuncaoListTemplate);
  });
});
