import { isValidElement } from 'react';
import type { ComponentProps } from 'react';
import { describe, expect, it } from 'vitest';
import { RoteiroFormTemplate } from '@/templates/roteiro/form';
import RoteiroFormPage from './page';

describe('RoteiroFormPage', () => {
  it('passes the first route id to the roteiro form template', async () => {
    const page = await RoteiroFormPage({
      params: Promise.resolve({ id: ['roteiro-123', 'ignored-id'] }),
    });

    expect(isValidElement<ComponentProps<typeof RoteiroFormTemplate>>(page)).toBe(
      true
    );

    if (!isValidElement<ComponentProps<typeof RoteiroFormTemplate>>(page)) {
      throw new Error('RoteiroFormPage must render the roteiro form template');
    }

    expect(page.type).toBe(RoteiroFormTemplate);
    expect(page.props.selectedId).toBe('roteiro-123');
  });

  it('uses an empty selected id when the optional route id is missing', async () => {
    const page = await RoteiroFormPage({
      params: Promise.resolve({}),
    });

    expect(isValidElement<ComponentProps<typeof RoteiroFormTemplate>>(page)).toBe(
      true
    );

    if (!isValidElement<ComponentProps<typeof RoteiroFormTemplate>>(page)) {
      throw new Error('RoteiroFormPage must render the roteiro form template');
    }

    expect(page.props.selectedId).toBe('');
  });
});
