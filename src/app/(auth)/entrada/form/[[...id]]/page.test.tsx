import { isValidElement } from 'react';
import type { ComponentProps } from 'react';
import { describe, expect, it } from 'vitest';
import { EntradaFormTemplate } from '@/templates/entrada/form';
import EntradaFormPage from './page';

describe('EntradaFormPage', () => {
  it('passes the first route id to the entrada form template', async () => {
    const page = await EntradaFormPage({
      params: Promise.resolve({ id: ['entrada-123', 'ignored-id'] }),
    });

    expect(isValidElement<ComponentProps<typeof EntradaFormTemplate>>(page)).toBe(
      true
    );

    if (!isValidElement<ComponentProps<typeof EntradaFormTemplate>>(page)) {
      throw new Error('EntradaFormPage must render the entrada form template');
    }

    expect(page.type).toBe(EntradaFormTemplate);
    expect(page.props.selectedId).toBe('entrada-123');
  });

  it('uses an empty selected id when the optional route id is missing', async () => {
    const page = await EntradaFormPage({
      params: Promise.resolve({}),
    });

    expect(isValidElement<ComponentProps<typeof EntradaFormTemplate>>(page)).toBe(
      true
    );

    if (!isValidElement<ComponentProps<typeof EntradaFormTemplate>>(page)) {
      throw new Error('EntradaFormPage must render the entrada form template');
    }

    expect(page.props.selectedId).toBe('');
  });
});
