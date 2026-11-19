import { isValidElement } from 'react';
import type { ComponentProps } from 'react';
import { describe, expect, it } from 'vitest';
import { SecretariaListTemplate } from '@/templates/secretaria';
import SecretariaListPage from './page';

describe('SecretariaListPage', () => {
  it('renders the secretary list template', async () => {
    const page = await SecretariaListPage();

    expect(isValidElement<ComponentProps<typeof SecretariaListTemplate>>(page)).toBe(
      true
    );

    if (!isValidElement<ComponentProps<typeof SecretariaListTemplate>>(page)) {
      throw new Error('SecretariaListPage must render the secretary list template');
    }

    expect(page.type).toBe(SecretariaListTemplate);
  });
});
