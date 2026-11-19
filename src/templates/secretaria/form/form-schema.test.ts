import { describe, expect, it } from 'vitest';
import { secretariaFormSchema } from './form-schema';

describe('secretariaFormSchema', () => {
  const validSecretaria = {
    nome: 'Rafaela Silva',
    email: 'rafaela@example.com',
    telefones: ['(11) 98765-4321'],
  };

  it('accepts valid secretary data with optional id omitted', () => {
    expect(secretariaFormSchema.safeParse(validSecretaria).success).toBe(true);
  });

  it.each(['nome', 'email'] as const)(
    'rejects an empty required field: %s',
    (field) => {
      expect(
        secretariaFormSchema.safeParse({
          ...validSecretaria,
          [field]: '',
        }).success
      ).toBe(false);
    }
  );

  it('rejects malformed email addresses', () => {
    expect(
      secretariaFormSchema.safeParse({
        ...validSecretaria,
        email: 'not-an-email',
      }).success
    ).toBe(false);
  });

  it('accepts existing record ids and an empty phone list', () => {
    expect(
      secretariaFormSchema.safeParse({
        ...validSecretaria,
        id: 'secretaria-1',
        telefones: [],
      }).success
    ).toBe(true);
  });
});
