import { render, screen } from '@testing-library/react';
import { Star } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { DashboardCard } from './dashboard-card';

describe('DashboardCard', () => {
  it('renders its title, value, subtitle, and additional content', () => {
    render(
      <DashboardCard
        title="Entradas"
        icon={Star}
        value={12}
        subtitle="Neste período"
      >
        <span>Detalhes do período</span>
      </DashboardCard>
    );

    expect(screen.getByText('Entradas')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '12' })).toBeInTheDocument();
    expect(screen.getByText('Neste período')).toBeInTheDocument();
    expect(screen.getByText('Detalhes do período')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('makes the card navigable when a destination is provided', () => {
    render(
      <DashboardCard
        title="Roteiros"
        icon={Star}
        value="5"
        href="/roteiro"
      />
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', '/roteiro');
    expect(screen.getByRole('heading', { name: '5' })).toBeInTheDocument();
  });

  it('omits optional subtitle and content when they are not provided', () => {
    render(
      <DashboardCard title="Resumo" icon={Star} value={0} />
    );

    expect(screen.getByText('Resumo')).toBeInTheDocument();
    expect(screen.queryByText('Detalhes do período')).not.toBeInTheDocument();
  });
});
