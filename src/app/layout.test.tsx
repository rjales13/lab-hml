import type { ComponentProps } from 'react';
import { isValidElement } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import RootLayout from './layout';

vi.mock('next/font/google', () => ({
  Roboto: () => ({
    className: 'roboto',
    variable: 'roboto-variable',
  }),
}));

describe('RootLayout', () => {
  it('provides the document language and renders children in the main landmark', () => {
    const layout = RootLayout({ children: <p>Page content</p> });

    if (!isValidElement<ComponentProps<'html'>>(layout)) {
      throw new Error('RootLayout must return an HTML document element');
    }

    expect(layout.props.lang).toBe('en');

    const body = layout.props.children;
    if (!isValidElement<ComponentProps<'body'>>(body)) {
      throw new Error('RootLayout must render a body element');
    }

    render(body.props.children);
    expect(screen.getByRole('main')).toContainElement(
      screen.getByText('Page content')
    );
  });
});
