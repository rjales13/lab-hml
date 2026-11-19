import { describe, expect, it } from 'vitest';
import { dentistaFormSchema } from './form-schema';

describe('dentistaFormSchema', () => {
  const validDentista = {
    nome: 'Marcelo Jales',
    cro: '20987266',
    email: 'marcelo@example.com',
    telefones: ['(11) 98765-9876'],
    especialidades: ['especialidade-id'],
  };

  it('accepts valid dentist data with optional id omitted', () => {
    const result = dentistaFormSchema.safeParse(validDentista);

    expect(result.success).toBe(true);
  });

  it.each(['nome', 'cro', 'email'] as const)(
    'rejects an empty required field: %s',
    (field) => {
      const result = dentistaFormSchema.safeParse({
        ...validDentista,
        [field]: '',
      });

      expect(result.success).toBe(false);
    }
  );

  it('rejects a malformed email address', () => {
    const result = dentistaFormSchema.safeParse({
      ...validDentista,
      email: 'not-an-email',
    });

    expect(result.success).toBe(false);
  });

  it('accepts an existing record id and empty list fields', () => {
    const result = dentistaFormSchema.safeParse({
      ...validDentista,
      id: 'dentista-id',
      telefones: [],
      especialidades: [],
    });

    expect(result.success).toBe(true);
  });
});
