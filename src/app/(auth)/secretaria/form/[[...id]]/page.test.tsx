import { isValidElement } from 'react';
import type { ComponentProps } from 'react';
import { describe, expect, it } from 'vitest';
import { SecretariaFormTemplate } from '@/templates/secretaria/form';
import SecretariaFormPage from './page';

describe('SecretariaFormPage', () => {
  it('passes the first route id to the secretary form template', async () => {
    const page = await SecretariaFormPage({
      params: Promise.resolve({ id: ['secretaria-123', 'ignored-id'] }),
    });

    expect(isValidElement<ComponentProps<typeof SecretariaFormTemplate>>(page)).toBe(
      true
    );

    if (!isValidElement<ComponentProps<typeof SecretariaFormTemplate>>(page)) {
      throw new Error(
        'SecretariaFormPage must render the secretary form template'
      );
    }

    expect(page.type).toBe(SecretariaFormTemplate);
    expect(page.props.selectedId).toBe('secretaria-123');
  });

  it('uses an empty selected id when the optional route id is missing', async () => {
    const page = await SecretariaFormPage({
      params: Promise.resolve({}),
    });

    expect(isValidElement<ComponentProps<typeof SecretariaFormTemplate>>(page)).toBe(
      true
    );

    if (!isValidElement<ComponentProps<typeof SecretariaFormTemplate>>(page)) {
      throw new Error(
        'SecretariaFormPage must render the secretary form template'
      );
    }

    expect(page.props.selectedId).toBe('');
  });
});
