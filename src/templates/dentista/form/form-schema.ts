import { ERROR_MESSAGES } from '@/lib/messages/errors';
import { z } from 'zod';

export const dentistaFormSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, {
    message: ERROR_MESSAGES.required,
  }),
  telefones: z.array(z.string()),
  cro: z.string().min(1, {
    message: ERROR_MESSAGES.required,
  }),
  email: z
    .string()
    .min(1, {
      message: ERROR_MESSAGES.required,
    })
    .email(ERROR_MESSAGES.invalidEmail),
  especialidades: z.array(z.string()),
});

export type tDentistaFormData = z.infer<typeof dentistaFormSchema>;
