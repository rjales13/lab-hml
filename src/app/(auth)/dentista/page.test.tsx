import { isValidElement } from 'react';
import type { ComponentProps } from 'react';
import { describe, expect, it } from 'vitest';
import { DentistaListTemplate } from '@/templates/dentista';
import DentistaListPage from './page';

describe('DentistaListPage', () => {
  it('renders the dentist list template', async () => {
    const page = await DentistaListPage();

    expect(isValidElement<ComponentProps<typeof DentistaListTemplate>>(page)).toBe(
      true
    );

    if (!isValidElement<ComponentProps<typeof DentistaListTemplate>>(page)) {
      throw new Error('DentistaListPage must render the dentist list template');
    }

    expect(page.type).toBe(DentistaListTemplate);
  });
});
