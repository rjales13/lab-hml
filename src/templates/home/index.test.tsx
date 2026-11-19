import { Suspense } from 'react';
import { describe, expect, it } from 'vitest';
import { userRoles } from '@/models/user-role';
import { DashboardSkeleton } from './dashboard-skeleton';
import { HomeTemplate } from './index';

describe('HomeTemplate', () => {
  const selectedPeriod = {
    period: '2026-07',
    year: 2026,
    month: 7,
  };

  it('wraps admin dashboard content in a suspense boundary with admin placeholders', async () => {
    const template = await HomeTemplate({
      userRole: { role: userRoles.ADMIN },
      selectedPeriod,
    });
    const suspense = template.props.children;

    expect(suspense.type).toBe(Suspense);
    expect(suspense.props.fallback).toEqual(
      expect.objectContaining({
        type: DashboardSkeleton,
        props: { isAdmin: true },
      })
    );
    expect(suspense.props.children.props).toEqual({
      isAdmin: true,
      selectedPeriod,
    });
  });

  it('uses non-admin placeholders for non-admin dashboard content', async () => {
    const template = await HomeTemplate({
      userRole: { role: userRoles.USER },
      selectedPeriod,
    });
    const suspense = template.props.children;

    expect(suspense.props.fallback).toEqual(
      expect.objectContaining({
        type: DashboardSkeleton,
        props: { isAdmin: false },
      })
    );
  });
});
