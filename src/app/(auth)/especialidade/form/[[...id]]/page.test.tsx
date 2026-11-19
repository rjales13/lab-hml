import { isValidElement } from 'react';
import type { ComponentProps } from 'react';
import { describe, expect, it } from 'vitest';
import { EspecialidadeFormTemplate } from '@/templates/especialidade/form';
import EspecialidadeFormPage from './page';

describe('EspecialidadeFormPage', () => {
  it('passes the first route id to the specialty form template', async () => {
    const page = await EspecialidadeFormPage({
      params: Promise.resolve({ id: ['especialidade-123', 'ignored-id'] }),
    });

    expect(
      isValidElement<ComponentProps<typeof EspecialidadeFormTemplate>>(page)
    ).toBe(true);

    if (!isValidElement<ComponentProps<typeof EspecialidadeFormTemplate>>(page)) {
      throw new Error(
        'EspecialidadeFormPage must render the specialty form template'
      );
    }

    expect(page.type).toBe(EspecialidadeFormTemplate);
    expect(page.props.selectedId).toBe('especialidade-123');
  });

  it('uses an empty selected id when the optional route id is missing', async () => {
    const page = await EspecialidadeFormPage({
      params: Promise.resolve({}),
    });

    expect(
      isValidElement<ComponentProps<typeof EspecialidadeFormTemplate>>(page)
    ).toBe(true);

    if (!isValidElement<ComponentProps<typeof EspecialidadeFormTemplate>>(page)) {
      throw new Error(
        'EspecialidadeFormPage must render the specialty form template'
      );
    }

    expect(page.props.selectedId).toBe('');
  });
});
