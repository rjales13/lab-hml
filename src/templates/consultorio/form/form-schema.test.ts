import { describe, expect, it } from 'vitest';
import { consultorioFormSchema } from './form-schema';

describe('consultorioFormSchema', () => {
  const validConsultorio = {
    nome: 'Consultório Central',
    cobranca: 'consultorio',
    cep: '09078-580',
    numero: '203',
    email: 'contato@consultorio.com',
    telefones: ['(11) 98765-9876'],
    dentistas: ['dentista-id'],
    secretarias: ['secretaria-id'],
  };

  it('accepts a valid consultorio with optional fields omitted', () => {
    const result = consultorioFormSchema.safeParse(validConsultorio);

    expect(result.success).toBe(true);
  });

  it.each(['nome', 'cobranca', 'cep', 'numero', 'email'] as const)(
    'rejects an empty required field: %s',
    (field) => {
      const result = consultorioFormSchema.safeParse({
        ...validConsultorio,
        [field]: '',
      });

      expect(result.success).toBe(false);
    }
  );

  it('rejects a malformed email address', () => {
    const result = consultorioFormSchema.safeParse({
      ...validConsultorio,
      email: 'not-an-email',
    });

    expect(result.success).toBe(false);
  });

  it('accepts an existing record id and optional delivery details', () => {
    const result = consultorioFormSchema.safeParse({
      ...validConsultorio,
      id: 'consultorio-id',
      cep_entrega: '01310-100',
      numero_entrega: '10',
      complemento_entrega: 'Sala 2',
    });

    expect(result.success).toBe(true);
  });
});
