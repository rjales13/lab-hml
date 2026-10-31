import { ERROR_MESSAGES } from '@/lib/messages/errors';
import { z } from 'zod';

export const especialidadeFormSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, {
    message: ERROR_MESSAGES.required,
  }),
});

export type tEspecialidadeFormData = z.infer<typeof especialidadeFormSchema>;
