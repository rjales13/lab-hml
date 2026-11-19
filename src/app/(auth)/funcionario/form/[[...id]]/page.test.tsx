import { isValidElement } from 'react';
import type { ComponentProps } from 'react';
import { describe, expect, it } from 'vitest';
import { FuncionarioFormTemplate } from '@/templates/funcionario/form';
import FuncionarioFormPage from './page';

describe('FuncionarioFormPage', () => {
  it('passes the first route id to the employee form template', async () => {
    const page = await FuncionarioFormPage({
      params: Promise.resolve({ id: ['funcionario-123', 'ignored-id'] }),
    });

    expect(isValidElement<ComponentProps<typeof FuncionarioFormTemplate>>(page)).toBe(
      true
    );

    if (!isValidElement<ComponentProps<typeof FuncionarioFormTemplate>>(page)) {
      throw new Error(
        'FuncionarioFormPage must render the employee form template'
      );
    }

    expect(page.type).toBe(FuncionarioFormTemplate);
    expect(page.props.selectedId).toBe('funcionario-123');
  });

  it('uses an empty selected id when the optional route id is missing', async () => {
    const page = await FuncionarioFormPage({
      params: Promise.resolve({}),
    });

    expect(isValidElement<ComponentProps<typeof FuncionarioFormTemplate>>(page)).toBe(
      true
    );

    if (!isValidElement<ComponentProps<typeof FuncionarioFormTemplate>>(page)) {
      throw new Error(
        'FuncionarioFormPage must render the employee form template'
      );
    }

    expect(page.props.selectedId).toBe('');
  });
});
