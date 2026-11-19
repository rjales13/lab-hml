import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ScrollToTop } from './scroll-to-top';

// Mock the scrollToTop utility
vi.mock('@/lib/utils/scrollToTop', () => ({
  scrollToTop: vi.fn(),
}));

describe('ScrollToTop', () => {
  it('renders scroll to top button', () => {
    const { container } = render(<ScrollToTop />);

    // The component renders a CircleArrowUp icon
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
  it('renders with correct title attribute', () => {
    const { container } = render(<ScrollToTop />);

    const title = container.querySelector('title');
    expect(title?.textContent).toBe('Top');
  });

  it('renders icon with clickable styling', () => {
    const { container } = render(<ScrollToTop />);

    const svg = container.querySelector('svg');
    // The svg element should have the styling classes
    expect(svg).toHaveClass('cursor-pointer');
  });

  it('renders with flex justify-end wrapper', () => {
    const { container } = render(<ScrollToTop />);

    const wrapper = container.querySelector('.flex');
    expect(wrapper).toHaveClass('flex', 'justify-end');
  });

  it('renders CircleArrowUp icon', () => {
    const { container } = render(<ScrollToTop />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders button without additional props', () => {
    const { container } = render(<ScrollToTop />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with accessible structure', () => {
    const { container } = render(<ScrollToTop />);

    // The component should have proper structure
    const wrapper = container.querySelector('.flex');
    expect(wrapper).toBeInTheDocument();
  });

  it('applies animation classes to icon', () => {
    const { container } = render(<ScrollToTop />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('animate-pulse');
  });

  it('renders with correct styling for right alignment', () => {
    const { container } = render(<ScrollToTop />);

    const wrapper = container.querySelector('.flex');
    expect(wrapper).toHaveClass('justify-end');
  });
});
