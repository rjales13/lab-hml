import { isValidElement } from 'react';
import type { ComponentProps } from 'react';
import { describe, expect, it } from 'vitest';
import { ServicoListTemplate } from '@/templates/servico';
import ServicoListPage from './page';

describe('ServicoListPage', () => {
  it('renders the service list template', async () => {
    const page = await ServicoListPage();

    expect(isValidElement<ComponentProps<typeof ServicoListTemplate>>(page)).toBe(
      true
    );

    if (!isValidElement<ComponentProps<typeof ServicoListTemplate>>(page)) {
      throw new Error('ServicoListPage must render the service list template');
    }

    expect(page.type).toBe(ServicoListTemplate);
  });
});
