import { ERROR_MESSAGES } from '@/lib/messages/errors';
import { z } from 'zod';

export const secretariaFormSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, {
    message: ERROR_MESSAGES.required,
  }),
  telefones: z.array(z.string()),
  email: z
    .string()
    .min(1, {
      message: ERROR_MESSAGES.required,
    })
    .email(ERROR_MESSAGES.invalidEmail),
});

export type tSecretariaFormData = z.infer<typeof secretariaFormSchema>;
