import { isValidElement } from 'react';
import type { ComponentProps } from 'react';
import { describe, expect, it } from 'vitest';
import { FuncionarioListTemplate } from '@/templates/funcionario';
import FuncionarioListPage from './page';

describe('FuncionarioListPage', () => {
  it('renders the employee list template', async () => {
    const page = await FuncionarioListPage();

    expect(isValidElement<ComponentProps<typeof FuncionarioListTemplate>>(page)).toBe(
      true
    );

    if (!isValidElement<ComponentProps<typeof FuncionarioListTemplate>>(page)) {
      throw new Error('FuncionarioListPage must render the employee list template');
    }

    expect(page.type).toBe(FuncionarioListTemplate);
  });
});
