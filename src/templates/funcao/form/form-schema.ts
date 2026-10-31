import { ERROR_MESSAGES } from '@/lib/messages/errors';
import { z } from 'zod';

export const funcaoFormSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, {
    message: ERROR_MESSAGES.required,
  }),
});

export type tFuncaoFormData = z.infer<typeof funcaoFormSchema>;
