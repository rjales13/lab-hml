import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import NotFound from './not-found';

describe('NotFound', () => {
  it('shows the not-found message and a link back home', () => {
    render(<NotFound />);

    expect(screen.getByText('Página não encontrada')).toBeInTheDocument();

    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders the 404 status code', () => {
    render(<NotFound />);

    expect(screen.getAllByText('4')).toHaveLength(2);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
