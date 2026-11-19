import { describe, expect, it } from 'vitest';
import { entradaFormSchema } from './form-schema';

describe('entradaFormSchema', () => {
  const validEntrada = {
    consultorio: 'consultorio-id',
    dentista: 'dentista-id',
    paciente: 'João da Silva',
    servicos: [
      {
        idServicoEntrada: 'item-1',
        servico: 'servico-id',
        valor: 2500,
        desconto: 0,
        quantidade: 1,
        repeticao: 0,
        funcionario: 'funcionario-id',
        data_previsao: new Date('2026-03-15T00:00:00.000Z'),
      },
    ],
  };

  it('accepts a valid entry with optional fields omitted', () => {
    expect(entradaFormSchema.safeParse(validEntrada).success).toBe(true);
  });

  it.each(['consultorio', 'dentista', 'paciente'] as const)(
    'rejects an empty required field: %s',
    (field) => {
      const result = entradaFormSchema.safeParse({
        ...validEntrada,
        [field]: '',
      });

      expect(result.success).toBe(false);
    }
  );

  it('accepts an existing id, observation, and nullable service completion date', () => {
    const result = entradaFormSchema.safeParse({
      ...validEntrada,
      id: 'entrada-id',
      observacao: 'Retornar na próxima semana',
      servicos: [{ ...validEntrada.servicos[0], data_saida: null }],
    });

    expect(result.success).toBe(true);
  });

  it('rejects a service with an invalid numeric field', () => {
    const result = entradaFormSchema.safeParse({
      ...validEntrada,
      servicos: [{ ...validEntrada.servicos[0], quantidade: '1' }],
    });

    expect(result.success).toBe(false);
  });
});
