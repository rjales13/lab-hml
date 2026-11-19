import { isValidElement } from 'react';
import type { ComponentProps } from 'react';
import { describe, expect, it } from 'vitest';
import { FechamentoPanelTemplate } from '@/templates/fechamento';
import FechamentoPanelPage from './page';

describe('FechamentoPanelPage', () => {
  it('renders the fechamento panel template', async () => {
    const page = await FechamentoPanelPage();

    expect(
      isValidElement<ComponentProps<typeof FechamentoPanelTemplate>>(page)
    ).toBe(true);

    if (!isValidElement<ComponentProps<typeof FechamentoPanelTemplate>>(page)) {
      throw new Error(
        'FechamentoPanelPage must render the fechamento panel template'
      );
    }

    expect(page.type).toBe(FechamentoPanelTemplate);
  });
});
