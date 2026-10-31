import { ERROR_MESSAGES } from '@/lib/messages/errors';
import { z } from 'zod';

export const consultorioFormSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, {
    message: ERROR_MESSAGES.required,
  }),
  cobranca: z.string().min(1, {
    message: ERROR_MESSAGES.required,
  }),
  cep: z.string().min(1, {
    message: ERROR_MESSAGES.required,
  }),
  numero: z.string().min(1, {
    message: ERROR_MESSAGES.required,
  }),
  email: z
    .string()
    .min(1, {
      message: ERROR_MESSAGES.invalidEmail,
    })
    .email(ERROR_MESSAGES.invalidEmail),
  complemento: z.string().optional(),
  cep_entrega: z.string().optional(),
  numero_entrega: z.string().optional(),
  complemento_entrega: z.string().optional(),
  observacao: z.string().optional(),
  telefones: z.array(z.string()),
  dentistas: z.array(z.string()),
  secretarias: z.array(z.string()),
});

export type tConsultorioFormData = z.infer<typeof consultorioFormSchema>;
