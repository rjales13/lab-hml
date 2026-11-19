import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DashboardSkeleton } from './dashboard-skeleton';

describe('DashboardSkeleton', () => {
  it('renders three placeholder cards for administrators', () => {
    const { container } = render(<DashboardSkeleton isAdmin />);

    expect(container.querySelectorAll('[data-slot="card"]')).toHaveLength(3);
  });

  it('renders two placeholder cards for non-administrators', () => {
    const { container } = render(<DashboardSkeleton isAdmin={false} />);

    expect(container.querySelectorAll('[data-slot="card"]')).toHaveLength(2);
  });
});
