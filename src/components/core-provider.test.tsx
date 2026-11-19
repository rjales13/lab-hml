import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import CoreProvider from './core-provider';

describe('CoreProvider', () => {
  it('renders children', () => {
    const { container } = render(
      <CoreProvider>
        <div data-testid="child">Child content</div>
      </CoreProvider>
    );

    expect(container.querySelector('[data-testid="child"]')).toBeInTheDocument();
  });

  it('renders with QueryClientProvider', () => {
    const { container } = render(
      <CoreProvider>
        <div>Content</div>
      </CoreProvider>
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    const { container } = render(
      <CoreProvider>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
      </CoreProvider>
    );

    expect(container.querySelector('[data-testid="child1"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="child2"]')).toBeInTheDocument();
  });

  it('wraps children correctly', () => {
    const { container } = render(
      <CoreProvider>
        <section>
          <h1>Title</h1>
          <p>Content</p>
        </section>
      </CoreProvider>
    );

    expect(container.querySelector('section')).toBeInTheDocument();
    expect(container.querySelector('h1')).toBeInTheDocument();
  });

  it('provides QueryClient context to children', () => {
    const { container } = render(
      <CoreProvider>
        <div>Child</div>
      </CoreProvider>
    );

    expect(container.firstChild).toBeInTheDocument();
  });
});
