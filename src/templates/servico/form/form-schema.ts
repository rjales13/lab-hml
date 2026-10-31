import { ERROR_MESSAGES } from '@/lib/messages/errors';
import { z } from 'zod';

// Convert Brazilian format directly to cents
const brlToCents = (value: string | number): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const cleaned = value
      .trim()
      .replace(/R\$\s*/g, '')
      .replace(/\./g, '')
      .replace(',', '.');

    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : Math.round(num * 100);
  }

  return 0;
};

export const servicoFormSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, { message: ERROR_MESSAGES.required }),
  valor_sem_nota: z.array(z.preprocess(brlToCents, z.number().int())),
  valor_com_nota: z.array(z.preprocess(brlToCents, z.number().int())),
  valor_unicid: z.array(z.preprocess(brlToCents, z.number().int())),
  valor_pinheros: z.array(z.preprocess(brlToCents, z.number().int())),
});

// Types
export type tServicoFormInput = z.input<typeof servicoFormSchema>; // Accepts "R$ 3,00"
export type tServicoFormOutput = z.output<typeof servicoFormSchema>; // Outputs 300 (cents)
export type tServicoFormData = tServicoFormInput;
