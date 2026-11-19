import { describe, expect, it } from 'vitest';
import { servicoFormSchema } from './form-schema';

describe('servicoFormSchema', () => {
  const validServico = {
    nome: 'Prótese Dentária',
    valor_sem_nota: ['50,00', 'R$ 1.234,56'],
    valor_com_nota: [2500],
    valor_unicid: [],
    valor_pinheros: ['invalid'],
  };

  it('accepts service data and converts Brazilian currency values to cents', () => {
    const result = servicoFormSchema.safeParse(validServico);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        ...validServico,
        valor_sem_nota: [5000, 123456],
        valor_com_nota: [2500],
        valor_pinheros: [0],
      });
    }
  });

  it('requires a service name', () => {
    const result = servicoFormSchema.safeParse({
      ...validServico,
      nome: '',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Campo obrigatório.');
    }
  });

  it('accepts an optional record id and empty price lists', () => {
    expect(
      servicoFormSchema.safeParse({
        id: 'servico-1',
        nome: 'Prótese Dentária',
        valor_sem_nota: [],
        valor_com_nota: [],
        valor_unicid: [],
        valor_pinheros: [],
      }).success
    ).toBe(true);
  });

  it('rounds decimal values to the nearest cent', () => {
    const result = servicoFormSchema.safeParse({
      nome: 'Prótese Dentária',
      valor_sem_nota: ['1,999'],
      valor_com_nota: [],
      valor_unicid: [],
      valor_pinheros: [],
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.valor_sem_nota).toEqual([200]);
    }
  });
});
