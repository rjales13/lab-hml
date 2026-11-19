import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authCLient } from '@/lib/auth/auth-client';
import { ERROR_MESSAGES } from '@/lib/messages/errors';
import { LoginTemplate } from './index';

const { signInEmail, signUpEmail, toastError, toastSuccess } = vi.hoisted(() => ({
  signInEmail: vi.fn(),
  signUpEmail: vi.fn(),
  toastError: vi.fn(),
  toastSuccess: vi.fn(),
}));

vi.mock('@/lib/auth/auth-client', () => ({
  authCLient: {
    signIn: { email: signInEmail },
    signUp: { email: signUpEmail },
  },
}));

vi.mock('sonner', () => ({
  toast: {
    error: toastError,
    success: toastSuccess,
  },
}));

describe('LoginTemplate', () => {
  beforeEach(() => {
    vi.mocked(authCLient.signIn.email).mockImplementation(
      async (_credentials, callbacks) => {
        callbacks?.onSuccess?.({} as never);
        return undefined;
      }
    );
    vi.mocked(authCLient.signUp.email).mockImplementation(
      async (_credentials, callbacks) => {
        callbacks?.onSuccess?.({} as never);
        return undefined;
      }
    );
  });

  it('renders the login form and its restricted-area heading', () => {
    render(<LoginTemplate />);

    expect(
      screen.getByText('Bem-vindo de volta')
    ).toBeInTheDocument();
    expect(screen.getByText('Área restrita do laboratório')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'E-mail' })).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password');
    expect(
      screen.getByRole('button', { name: 'Acessar conta' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Esqueceu a senha?' })).toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    render(<LoginTemplate />);
    const password = screen.getByLabelText('Senha');

    fireEvent.click(screen.getByRole('button', { name: 'Mostrar senha' }));

    expect(password).toHaveAttribute('type', 'text');
    fireEvent.click(screen.getByRole('button', { name: 'Ocultar senha' }));
    expect(password).toHaveAttribute('type', 'password');
  });

  it('submits valid login credentials and shows a success notification', async () => {
    render(<LoginTemplate />);

    fireEvent.change(screen.getByRole('textbox', { name: 'E-mail' }), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Senha'), {
      target: { value: 'StrongPass1!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Acessar conta' }));

    await waitFor(() => {
      expect(authCLient.signIn.email).toHaveBeenCalledWith(
        {
          email: 'user@example.com',
          password: 'StrongPass1!',
          callbackURL: '/',
        },
        expect.objectContaining({
          onError: expect.any(Function),
          onSuccess: expect.any(Function),
        })
      );
    });
    expect(toastSuccess).toHaveBeenCalledWith('Login realizado com sucesso!');
  });

  it('shows validation errors and does not sign in with invalid credentials', async () => {
    render(<LoginTemplate />);

    fireEvent.click(screen.getByRole('button', { name: 'Acessar conta' }));

    expect(await screen.findByText(ERROR_MESSAGES.required)).toBeInTheDocument();
    expect(authCLient.signIn.email).not.toHaveBeenCalled();
  });

  it('switches to account creation and shows its additional fields', () => {
    render(<LoginTemplate />);

    fireEvent.click(screen.getByRole('button', { name: 'Criar nova conta' }));

    expect(screen.getByText('Crie sua conta')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Nome' })).toBeInTheDocument();
    expect(
      screen.getByLabelText('Confirmar senha')
    ).toHaveAttribute('type', 'password');
    expect(
      screen.getByRole('button', { name: 'Criar conta' })
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Esqueceu a senha?' })).not.toBeInTheDocument();
  });

  it('creates an account and returns to the login form after success', async () => {
    render(<LoginTemplate />);
    fireEvent.click(screen.getByRole('button', { name: 'Criar nova conta' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Nome' }), {
      target: { value: 'Example User' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: 'E-mail' }), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Senha'), {
      target: { value: 'StrongPass1!' },
    });
    fireEvent.change(screen.getByLabelText('Confirmar senha'), {
      target: { value: 'StrongPass1!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Criar conta' }));

    await waitFor(() => {
      expect(authCLient.signUp.email).toHaveBeenCalledWith(
        {
          email: 'user@example.com',
          name: 'Example User',
          password: 'StrongPass1!',
        },
        expect.objectContaining({
          onError: expect.any(Function),
          onSuccess: expect.any(Function),
        })
      );
    });
    expect(toastSuccess).toHaveBeenCalledWith(
      'Conta criada com sucesso! Entre em contato com o administrador para ativar.'
    );
    expect(
      await screen.findByText('Bem-vindo de volta')
    ).toBeInTheDocument();
  });

  it('shows an error notification when authentication fails', async () => {
    vi.mocked(authCLient.signIn.email).mockImplementation(
      async (_credentials, callbacks) => {
        callbacks?.onError?.({
          response: new Response(),
          request: new Request('http://localhost/login'),
          error: {
            name: 'BetterFetchError',
            message: 'Invalid credentials',
            status: 401,
            statusText: 'Unauthorized',
            error: 'INVALID_CREDENTIALS',
          },
        });
        return undefined;
      }
    );
    render(<LoginTemplate />);
    fireEvent.change(screen.getByRole('textbox', { name: 'E-mail' }), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Senha'), {
      target: { value: 'StrongPass1!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Acessar conta' }));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(ERROR_MESSAGES.invalidLogin);
    });
  });
});
