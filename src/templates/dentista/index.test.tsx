import { describe, expect, it } from 'vitest';
import { DentistaListTemplate } from './index';

describe('DentistaListTemplate', () => {
  it('renders the list heading and provides a suspense boundary', () => {
    const template = DentistaListTemplate();

    expect(template).toMatchObject({
      props: {
        children: [
          {
            props: {
              title: 'Listagem de Dentistas',
              subtitle: 'Veja todos os dentistas cadastrados',
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
  });
});
