import { ERROR_MESSAGES } from '@/lib/messages/errors';
import { z } from 'zod';

const servicoFormSchema = z.object({
  idServicoEntrada: z.string(),
  servico: z.string(),
  valor: z.number(),
  desconto: z.number(),
  quantidade: z.number(),
  repeticao: z.number(),
  funcionario: z.string(),
  data_previsao: z.date(),
  data_saida: z.date().nullable().optional(),
  roteiro: z.string().nullable().optional(),
  entregue: z.boolean().nullable().optional(),
  fechamento: z.string().nullable().optional(),
});

export const entradaFormSchema = z.object({
  id: z.string().optional(),
  consultorio: z.string().min(1, {
    message: ERROR_MESSAGES.required,
  }),
  dentista: z.string().min(1, {
    message: ERROR_MESSAGES.required,
  }),
  paciente: z.string().min(1, {
    message: ERROR_MESSAGES.required,
  }),
  observacao: z.string().optional(),
  servicos: z.array(servicoFormSchema),
});

export type tEntradaFormData = z.infer<typeof entradaFormSchema>;
