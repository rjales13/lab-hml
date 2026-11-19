import { isValidElement } from 'react';
import type { ComponentProps } from 'react';
import { describe, expect, it } from 'vitest';
import { FuncaoFormTemplate } from '@/templates/funcao/form';
import FuncaoFormPage from './page';

describe('FuncaoFormPage', () => {
  it('passes the first route id to the function form template', async () => {
    const page = await FuncaoFormPage({
      params: Promise.resolve({ id: ['funcao-123', 'ignored-id'] }),
    });

    expect(isValidElement<ComponentProps<typeof FuncaoFormTemplate>>(page)).toBe(
      true
    );

    if (!isValidElement<ComponentProps<typeof FuncaoFormTemplate>>(page)) {
      throw new Error('FuncaoFormPage must render the function form template');
    }

    expect(page.type).toBe(FuncaoFormTemplate);
    expect(page.props.selectedId).toBe('funcao-123');
  });

  it('uses an empty selected id when the optional route id is missing', async () => {
    const page = await FuncaoFormPage({
      params: Promise.resolve({}),
    });

    expect(isValidElement<ComponentProps<typeof FuncaoFormTemplate>>(page)).toBe(
      true
    );

    if (!isValidElement<ComponentProps<typeof FuncaoFormTemplate>>(page)) {
      throw new Error('FuncaoFormPage must render the function form template');
    }

    expect(page.props.selectedId).toBe('');
  });
});
