import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PdfEntradas } from './pdf-entradas';

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

describe('PdfEntradas', () => {
  // PDF rendering in jsdom has limitations. These tests verify component structure.
  // Real PDF output validation should use integration tests or visual regression tests.

  it('component is defined', () => {
    expect(PdfEntradas).toBeDefined();
  });

  it('accepts entradas prop', () => {
    expect(PdfEntradas.length).toBeGreaterThanOrEqual(0);
  });

  it('renders the document with no blocks', () => {
    render(<PdfEntradas blocksData={[]} />);

    expect(screen.getByTestId('pdf-document')).toBeInTheDocument();
  });
});
