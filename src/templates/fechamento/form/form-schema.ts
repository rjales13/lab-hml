import { z } from 'zod';

export const fechamentoFormSchema = z.object({
  id: z.string().optional(),
  desconto: z.array(z.union([z.string(), z.number()])),
  observacao: z.string().optional(),
});

export type tFechamentoFormData = z.infer<typeof fechamentoFormSchema>;
