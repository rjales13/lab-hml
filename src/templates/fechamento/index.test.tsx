import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FechamentoPanelTemplate } from './index';

vi.mock('./panel', () => ({
  Panel: () => <div>Fechamento dashboard</div>,
}));

describe('FechamentoPanelTemplate', () => {
  it('renders the panel heading and suspends the dashboard content', () => {
    const template = FechamentoPanelTemplate();

    expect(template).toMatchObject({
      props: {
        children: [
          {
            props: {
              title: 'Painel de Fechamento',
              subtitle: 'Veja todos os fechamentos cadastrados',
            },
          },
          {
            props: {
              children: {
                props: {
                  fallback: expect.anything(),
                },
              },
            },
          },
        ],
      },
    });

    render(template);
    expect(screen.getByText('Fechamento dashboard')).toBeInTheDocument();
  });
});
