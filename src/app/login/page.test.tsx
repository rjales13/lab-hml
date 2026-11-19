import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LoginPage from './page';

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

vi.mock('@/templates/login', () => ({
  LoginTemplate: () => <div>Login form</div>,
}));

describe('LoginPage', () => {
  beforeEach(() => {
    getSession.mockResolvedValue(null);
  });

  it('renders the login template when there is no session', async () => {
    render(await LoginPage());

    expect(screen.getByText('Login form')).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it('renders the login template for a user-role session', async () => {
    getSession.mockResolvedValue({
      user: { role: 'user' },
    });

    render(await LoginPage());

    expect(screen.getByText('Login form')).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it('redirects sessions with a non-user role to the home page', async () => {
    getSession.mockResolvedValue({
      user: { role: 'admin' },
    });

    await expect(LoginPage()).rejects.toThrow('NEXT_REDIRECT');

    expect(redirect).toHaveBeenCalledWith('/');
  });

  it('retrieves the session using request headers', async () => {
    await LoginPage();

    expect(getSession).toHaveBeenCalledOnce();
    expect(getSession).toHaveBeenCalledWith({
      headers: expect.any(Headers),
    });
  });
});
