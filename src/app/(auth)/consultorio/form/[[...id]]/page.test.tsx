import { isValidElement } from 'react';
import type { ComponentProps } from 'react';
import { describe, expect, it } from 'vitest';
import { ConsultorioFormTemplate } from '@/templates/consultorio/form';
import ConsultorioFormPage from './page';

describe('ConsultorioFormPage', () => {
  it('passes the first route id to the office form template', async () => {
    const page = await ConsultorioFormPage({
      params: Promise.resolve({ id: ['consultorio-123', 'ignored-id'] }),
    });

    expect(
      isValidElement<ComponentProps<typeof ConsultorioFormTemplate>>(page)
    ).toBe(true);

    if (!isValidElement<ComponentProps<typeof ConsultorioFormTemplate>>(page)) {
      throw new Error('ConsultorioFormPage must render the office form template');
    }

    expect(page.type).toBe(ConsultorioFormTemplate);
    expect(page.props.selectedId).toBe('consultorio-123');
  });

  it('uses an empty selected id when the optional route id is missing', async () => {
    const page = await ConsultorioFormPage({
      params: Promise.resolve({}),
    });

    expect(
      isValidElement<ComponentProps<typeof ConsultorioFormTemplate>>(page)
    ).toBe(true);

    if (!isValidElement<ComponentProps<typeof ConsultorioFormTemplate>>(page)) {
      throw new Error('ConsultorioFormPage must render the office form template');
    }

    expect(page.props.selectedId).toBe('');
  });
});
