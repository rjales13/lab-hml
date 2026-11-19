import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AdminLayout from './layout';

const { getSession, redirect } = vi.hoisted(() => ({
  getSession: vi.fn(),
  redirect: vi.fn(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession,
    },
  },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn(async () => new Headers()),
}));

vi.mock('next/navigation', () => ({
  redirect,
}));

describe('AdminLayout', () => {
  beforeEach(() => {
    getSession.mockResolvedValue(null);
  });

  it('redirects to the home page when there is no session', async () => {
    await expect(
      AdminLayout({ children: <p>Admin content</p> })
    ).rejects.toThrow('NEXT_REDIRECT');

    expect(redirect).toHaveBeenCalledWith('/');
  });

  it('redirects users without the admin role', async () => {
    getSession.mockResolvedValue({
      user: { role: 'editor' },
    });

    await expect(
      AdminLayout({ children: <p>Admin content</p> })
    ).rejects.toThrow('NEXT_REDIRECT');

    expect(redirect).toHaveBeenCalledWith('/');
  });

  it('renders the children for an admin session', async () => {
    getSession.mockResolvedValue({
      user: { role: 'admin' },
    });

    render(
      await AdminLayout({
        children: <p>Admin content</p>,
      })
    );

    expect(screen.getByText('Admin content')).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });
});
