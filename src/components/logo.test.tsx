import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Logo } from './logo';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children, className }: React.ComponentProps<'a'>) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe('Logo', () => {
  it('renders logo link', () => {
    const { container } = render(<Logo />);

    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders logo image', () => {
    const { container } = render(<Logo />);

    const image = container.querySelector('img');
    expect(image).toBeInTheDocument();
    expect(new URL(image!.src).searchParams.get('url')).toBe('/lm.png');
    expect(image).toHaveAttribute('alt', 'Laboratorio Marcelo');
  });

  it('renders image with correct dimensions', () => {
    const { container } = render(<Logo />);

    const image = container.querySelector('img');
    expect(image).toHaveAttribute('width', '300');
    expect(image).toHaveAttribute('height', '300');
  });

  it('renders logo text', () => {
    const { container } = render(<Logo />);

    expect(container.textContent).toContain('Laboratório Marcelo');
  });

  it('applies correct styling classes to link', () => {
    const { container } = render(<Logo />);

    const link = container.querySelector('a');
    expect(link).toHaveClass('flex', 'items-center', 'gap-4', 'text-blue-950', 'bg-clip-text');
  });

  it('applies correct styling to image container', () => {
    const { container } = render(<Logo />);

    const imageDiv = container.querySelector('.w-12');
    expect(imageDiv).toHaveClass('w-12', 'h-12', 'rounded-full', 'overflow-hidden', 'shrink-0');
  });

  it('applies object-cover class to image', () => {
    const { container } = render(<Logo />);

    const image = container.querySelector('img');
    expect(image).toHaveClass('object-cover');
  });

  it('renders text with responsive display class', () => {
    const { container } = render(<Logo />);

    const textSpan = container.querySelector('.hidden');
    expect(textSpan).toHaveClass('hidden', 'md:block');
  });

  it('renders logo as a clickable link', () => {
    const { container } = render(<Logo />);

    const link = container.querySelector('a');
    expect(link?.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders image with correct alt text for accessibility', () => {
    const { container } = render(<Logo />);

    const image = container.querySelector('img');
    expect(image?.getAttribute('alt')).toBe('Laboratorio Marcelo');
  });

  it('renders both image and text in a flex container', () => {
    const { container } = render(<Logo />);

    const link = container.querySelector('a');
    const children = link?.children;

    expect(children?.length).toBe(2); // image container and text span
  });

  it('renders logo without breaking on hydration', () => {
    const { container } = render(<Logo />);

    expect(container.firstChild).toBeInTheDocument();
  });
});
