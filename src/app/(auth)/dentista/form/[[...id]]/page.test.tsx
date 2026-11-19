import { isValidElement } from 'react';
import type { ComponentProps } from 'react';
import { describe, expect, it } from 'vitest';
import { DentistaFormTemplate } from '@/templates/dentista/form';
import DentistaFormPage from './page';

describe('DentistaFormPage', () => {
  it('passes the first route id to the dentist form template', async () => {
    const page = await DentistaFormPage({
      params: Promise.resolve({ id: ['dentista-123', 'ignored-id'] }),
    });

    expect(isValidElement<ComponentProps<typeof DentistaFormTemplate>>(page)).toBe(
      true
    );

    if (!isValidElement<ComponentProps<typeof DentistaFormTemplate>>(page)) {
      throw new Error('DentistaFormPage must render the dentist form template');
    }

    expect(page.type).toBe(DentistaFormTemplate);
    expect(page.props.selectedId).toBe('dentista-123');
  });

  it('uses an empty selected id when the optional route id is missing', async () => {
    const page = await DentistaFormPage({
      params: Promise.resolve({}),
    });

    expect(isValidElement<ComponentProps<typeof DentistaFormTemplate>>(page)).toBe(
      true
    );

    if (!isValidElement<ComponentProps<typeof DentistaFormTemplate>>(page)) {
      throw new Error('DentistaFormPage must render the dentist form template');
    }

    expect(page.props.selectedId).toBe('');
  });
});
