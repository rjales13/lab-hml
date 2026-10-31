'use client';

import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { loginFormSchema, tLoginFormData } from './form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ControlledInput } from '@/components/controlled-input';
import Image from 'next/image';
import { ERROR_MESSAGES } from '@/lib/messages/errors';
import { authCLient } from '@/lib/auth/auth-client';
import { cn } from '@/lib/utils';

export const LoginTemplate = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [addAccount, setAddAccount] = useState(false);

  const methods = useForm<
    z.input<typeof loginFormSchema>,
    undefined,
    tLoginFormData
  >({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      isCreateAccount: false,
      name: '',
      email: '',
      password: '',
      repeat_password: '',
    },
  });

  const handleAddAccount = useCallback(() => {
    setAddAccount((value) => !value);
  }, []);

  useEffect(() => {
    methods.setValue('isCreateAccount', addAccount);
    methods.clearErrors();
  }, [addAccount, methods]);

  const handleShowPassword = useCallback((t: number) => {
    if (t === 1) {
      setShowPassword((value) => !value);
    } else if (t === 2) {
      setShowPassword2((value) => !value);
    }
  }, []);

  const handleSubmit = async (data: tLoginFormData) => {
    const { name, email, password } = data;
    try {
      if (!addAccount) {
        if (!email || !password) {
          toast.error(ERROR_MESSAGES.invalidLogin);
          return;
        }
        await authCLient.signIn.email(
          {
            email,
            password,
            callbackURL: '/',
          },
          {
            onError({ error }) {
              throw error;
            },
            onSuccess() {
              toast.success('Login realizado com sucesso!');
            },
          }
        );
      } else {
        if (!name || !email || !password || !data.repeat_password) {
          toast.error(ERROR_MESSAGES.invalidLogin);
          return;
        }

        await authCLient.signUp.email(
          {
            email,
            name,
            password,
          },
          {
            onError({ error }) {
              throw error;
            },
            onSuccess() {
              handleAddAccount();
              methods.reset();
              toast.success(
                'Conta criada com sucesso! Entre em contato com o administrador para ativar.'
              );
            },
          }
        );
      }
    } catch {
      toast.error(ERROR_MESSAGES.invalidLogin);
    }
  };

  return (
    <FormProvider {...methods}>
      <section className="flex min-h-screen items-center justify-center overflow-hidden p-4">
        <Card className="relative w-full max-w-md overflow-hidden rounded-4xl border border-slate-200/70">
          <div className="relative px-6 pb-2">
            <CardHeader className="mb-4 px-0 text-center">
              <div className="mx-auto flex flex-col gap-4">
                <CardTitle className="flex justify-center">
                  <div className="rounded-2xl border border-white/80 bg-white/90 p-3 shadow-md ring-1 shadow-sky-100/80 ring-sky-100 backdrop-blur-sm">
                    <Image src="/lm.png" alt="Logo" width={52} height={52} />
                  </div>
                </CardTitle>
                <div className="mx-auto inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 text-[11px] font-semibold tracking-[0.16em] text-sky-700 uppercase shadow-sm">
                  Área restrita do laboratório
                </div>
                {!addAccount ? (
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900">
                      Bem-vindo de volta
                    </CardTitle>
                    <CardDescription className="mx-auto max-w-xs text-sm leading-6 text-slate-500">
                      Informe suas credenciais para acessar o sistema.
                    </CardDescription>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-semibold tracking-tight text-slate-900">
                      Crie sua conta
                    </CardTitle>
                    <CardDescription className="mx-auto max-w-xs text-sm leading-6 text-slate-500">
                      Informe seus dados para criar uma nova conta.
                    </CardDescription>
                  </div>
                )}
              </div>
            </CardHeader>

            <form
              className="flex flex-col gap-4"
              onSubmit={methods.handleSubmit(handleSubmit)}
            >
              {addAccount && (
                <div className="space-y-2">
                  <ControlledInput
                    name="name"
                    label="Nome"
                    placeholder="Digite seu nome completo"
                    className="h-12 rounded-2xl border-slate-200/80 bg-slate-50/70 px-5 shadow-sm transition focus-visible:ring-sky-100"
                  />
                </div>
              )}
              <div className="space-y-2">
                <ControlledInput
                  name="email"
                  label="E-mail"
                  placeholder="ex: csp@gmail.com"
                  className="h-12 rounded-2xl border-slate-200/80 bg-slate-50/70 px-5 shadow-sm transition focus-visible:ring-sky-100"
                />
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <ControlledInput
                    name="password"
                    label="Senha"
                    placeholder="Digite sua senha"
                    className="h-12 rounded-2xl border-slate-200/80 bg-slate-50/70 px-5 shadow-sm transition focus-visible:ring-sky-100"
                    type={showPassword ? 'text' : 'password'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-8.5 right-1 size-9 cursor-pointer rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    onClick={() => handleShowPassword(1)}
                    aria-label={
                      showPassword ? 'Ocultar senha' : 'Mostrar senha'
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </Button>
                </div>
                {addAccount && (
                  <div className="relative mt-4">
                    <ControlledInput
                      name="repeat_password"
                      label="Confirmar senha"
                      placeholder="Repita sua senha"
                      className="h-12 rounded-2xl border-slate-200/80 bg-slate-50/70 px-5 shadow-sm transition focus-visible:ring-sky-100"
                      type={showPassword2 ? 'text' : 'password'}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-8.5 right-1 size-9 cursor-pointer rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      onClick={() => handleShowPassword(2)}
                      aria-label={
                        showPassword ? 'Ocultar senha' : 'Mostrar senha'
                      }
                    >
                      {showPassword2 ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </Button>
                  </div>
                )}
                <div
                  className={cn(
                    'flex pt-3 pb-1',
                    !addAccount ? 'justify-between' : 'justify-end'
                  )}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleAddAccount}
                    className="cursor-pointer rounded-2xl text-sm font-medium text-slate-500 transition-colors hover:text-sky-700"
                  >
                    {!addAccount ? 'Criar nova conta' : 'Já tem uma conta?'}
                  </Button>
                  {!addAccount && (
                    <Button
                      variant="ghost"
                      className="cursor-pointer rounded-2xl text-sm font-medium text-slate-500 transition-colors hover:text-sky-700"
                    >
                      Esqueceu a senha?
                    </Button>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                className="h-12 w-full cursor-pointer rounded-2xl bg-sky-700 text-white hover:bg-sky-800"
                disabled={methods.formState.isSubmitting}
              >
                {methods.formState.isSubmitting
                  ? !addAccount
                    ? 'Entrando...'
                    : 'Criando conta...'
                  : !addAccount
                    ? 'Acessar conta'
                    : 'Criar conta'}
                {!methods.formState.isSubmitting && (
                  <ArrowRight className="size-4" />
                )}
              </Button>
            </form>
          </div>
        </Card>
      </section>
    </FormProvider>
  );
};
