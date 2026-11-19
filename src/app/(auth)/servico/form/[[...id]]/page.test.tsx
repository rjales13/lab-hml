import { isValidElement } from 'react';
import type { ComponentProps } from 'react';
import { describe, expect, it } from 'vitest';
import { ServicoFormTemplate } from '@/templates/servico/form';
import ServicoFormPage from './page';

describe('ServicoFormPage', () => {
  it('passes the first route id to the service form template', async () => {
    const page = await ServicoFormPage({
      params: Promise.resolve({ id: ['servico-123', 'ignored-id'] }),
    });

    expect(isValidElement<ComponentProps<typeof ServicoFormTemplate>>(page)).toBe(
      true
    );

    if (!isValidElement<ComponentProps<typeof ServicoFormTemplate>>(page)) {
      throw new Error('ServicoFormPage must render the service form template');
    }

    expect(page.type).toBe(ServicoFormTemplate);
    expect(page.props.selectedId).toBe('servico-123');
  });

  it('uses an empty selected id when the optional route id is missing', async () => {
    const page = await ServicoFormPage({
      params: Promise.resolve({}),
    });

    expect(isValidElement<ComponentProps<typeof ServicoFormTemplate>>(page)).toBe(
      true
    );

    if (!isValidElement<ComponentProps<typeof ServicoFormTemplate>>(page)) {
      throw new Error('ServicoFormPage must render the service form template');
    }

    expect(page.props.selectedId).toBe('');
  });
});
