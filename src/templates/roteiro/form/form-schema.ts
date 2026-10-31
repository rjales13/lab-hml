import { ERROR_MESSAGES } from '@/lib/messages/errors';
import { z } from 'zod';

export const roteiroFormSchema = z.object({
  id: z.string().optional(),
  data: z.string().min(1, {
    message: ERROR_MESSAGES.required,
  }),
  entregue: z.boolean().optional(),
  observacao: z.string().optional(),
});

export type tRoteiroFormData = z.infer<typeof roteiroFormSchema>;
