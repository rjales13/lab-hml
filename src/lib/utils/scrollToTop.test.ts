import { describe, expect, it, vi } from 'vitest';
import { scrollToTop } from './scrollToTop';

describe('scrollToTop', () => {
  it('calls window.scrollTo with top 0 and smooth behavior', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo');

    scrollToTop();

    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });

    scrollToSpy.mockRestore();
  });

  it('scrolls to the top of the page', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo');

    scrollToTop();

    expect(scrollToSpy).toHaveBeenCalledWith(
      expect.objectContaining({ top: 0 }),
    );

    scrollToSpy.mockRestore();
  });

  it('uses smooth scroll behavior', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo');

    scrollToTop();

    expect(scrollToSpy).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: 'smooth' }),
    );

    scrollToSpy.mockRestore();
  });

  it('can be called multiple times', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo');

    scrollToTop();
    scrollToTop();
    scrollToTop();

    expect(scrollToSpy).toHaveBeenCalledTimes(3);
    expect(scrollToSpy).toHaveBeenLastCalledWith({
      top: 0,
      behavior: 'smooth',
    });

    scrollToSpy.mockRestore();
  });

  it('does not return any value', () => {
    const result = scrollToTop();
    expect(result).toBeUndefined();
  });
});
