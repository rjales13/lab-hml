import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuth } from '@/contexts/user-contexts';
import { userRoles } from '@/models/user-role';
import AuthLayout from './layout';

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

vi.mock('@/components/header', () => ({
  Header: () => <header>Application header</header>,
}));

vi.mock('@/components/footer', () => ({
  Footer: () => <footer>Application footer</footer>,
}));

function UserSummary() {
  const { user, isAuthenticated, isAdmin } = useAuth();

  return (
    <div>
      <p>{user?.name}</p>
      <p>{user?.role}</p>
      <p>{user?.email}</p>
      <p>{user?.id}</p>
      <p>Authenticated: {String(isAuthenticated)}</p>
      <p>Admin: {String(isAdmin)}</p>
    </div>
  );
}

describe('AuthLayout', () => {
  beforeEach(() => {
    getSession.mockResolvedValue(null);
  });

  it('redirects to login when there is no session', async () => {
    await expect(
      AuthLayout({ children: <p>Protected content</p> })
    ).rejects.toThrow('NEXT_REDIRECT');

    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('redirects users with the user role to login', async () => {
    getSession.mockResolvedValue({
      user: { role: userRoles.USER },
    });

    await expect(
      AuthLayout({ children: <p>Protected content</p> })
    ).rejects.toThrow('NEXT_REDIRECT');

    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('renders the protected content and provides authenticated admin details', async () => {
    getSession.mockResolvedValue({
      user: {
        id: 'admin-1',
        name: '',
        role: userRoles.ADMIN,
        email: 'admin@example.com',
      },
    });

    render(
      await AuthLayout({
        children: (
          <>
            <p>Protected content</p>
            <UserSummary />
          </>
        ),
      })
    );

    expect(screen.getByText('Application header')).toBeInTheDocument();
    expect(screen.getByText('Application footer')).toBeInTheDocument();
    expect(screen.getByText('Protected content')).toBeInTheDocument();
    expect(screen.getByText('Usuário')).toBeInTheDocument();
    expect(screen.getByText(userRoles.ADMIN)).toBeInTheDocument();
    expect(screen.getByText('admin@example.com')).toBeInTheDocument();
    expect(screen.getByText('admin-1')).toBeInTheDocument();
    expect(screen.getByText('Authenticated: true')).toBeInTheDocument();
    expect(screen.getByText('Admin: true')).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it('allows editor sessions and marks them as non-admin', async () => {
    getSession.mockResolvedValue({
      user: {
        id: 'editor-1',
        name: 'Editor',
        role: userRoles.EDITOR,
        email: 'editor@example.com',
      },
    });

    render(
      await AuthLayout({
        children: <UserSummary />,
      })
    );

    expect(screen.getByText('Editor')).toBeInTheDocument();
    expect(screen.getByText(userRoles.EDITOR)).toBeInTheDocument();
    expect(screen.getByText('Admin: false')).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });
});
