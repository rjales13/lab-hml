import { ERROR_MESSAGES } from '@/lib/messages/errors';
import { validateCPF } from '@/lib/utils/validateCPF';
import { z } from 'zod';

export const funcionarioFormSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, {
    message: ERROR_MESSAGES.required,
  }),
  cep: z.string().min(1, {
    message: ERROR_MESSAGES.required,
  }),
  numero: z.string().min(1, {
    message: ERROR_MESSAGES.required,
  }),
  complemento: z.string().optional(),
  email: z
    .string()
    .min(1, {
      message: ERROR_MESSAGES.invalidEmail,
    })
    .email(ERROR_MESSAGES.invalidEmail),
  rg: z.string().min(1, {
    message: ERROR_MESSAGES.required,
  }),
  cpf: z
    .string()
    .min(1, {
      message: ERROR_MESSAGES.required,
    })
    .refine(validateCPF, {
      message: ERROR_MESSAGES.invalidCPF,
    }),
  data_nascimento: z.string().min(1, {
    message: ERROR_MESSAGES.required,
  }),
  data_admissao: z.string().min(1, {
    message: ERROR_MESSAGES.required,
  }),
  data_recisao: z.string().optional(),
  observacao: z.string().optional(),
  telefones: z.array(z.string()),
  funcoes: z.array(z.string()),
});

export type tFuncionarioFormData = z.infer<typeof funcionarioFormSchema>;
