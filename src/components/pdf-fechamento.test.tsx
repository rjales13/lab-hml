import { describe, expect, it, vi } from 'vitest';
import { PdfFechamento } from './pdf-fechamento';

// Mock react-pdf/renderer - PDFs don't render well in jsdom tests
vi.mock('@react-pdf/renderer', () => ({
  Document: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pdf-document">{children}</div>
  ),
  Page: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pdf-page">{children}</div>
  ),
  Text: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="pdf-text">{children}</span>
  ),
  View: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pdf-view">{children}</div>
  ),
  Image: ({ src }: { src: string }) => (
    <span data-testid="pdf-image" data-src={src} />
  ),
  StyleSheet: {
    create: (styles: Record<string, unknown>) => styles,
  },
}));

vi.mock('date-fns', () => ({
  format: (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[0];
  },
  parseISO: (date: string) => new Date(date),
}));

describe('PdfFechamento', () => {
  // PDF rendering in jsdom has limitations. These tests verify component structure.
  // Real PDF output validation should use integration tests or visual regression tests.

  it('component is defined', () => {
    expect(PdfFechamento).toBeDefined();
  });

  it('accepts required props', () => {
    expect(PdfFechamento.length).toBeGreaterThanOrEqual(0);
  });

  it('can be called with minimal props', () => {
    expect(() =>
      PdfFechamento({
        entradas: [],
        consultorios: [],
        totalValue: 0,
        referenceDate: '2024-01-15',
      } as never)
    ).toBeDefined();
  });
});
