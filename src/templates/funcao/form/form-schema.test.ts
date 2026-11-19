import { describe, expect, it } from 'vitest';
import { funcaoFormSchema } from './form-schema';

describe('funcaoFormSchema', () => {
  it('accepts a function name when the optional id is omitted', () => {
    expect(funcaoFormSchema.safeParse({ nome: 'Protético' }).success).toBe(true);
  });

  it('rejects an empty function name with the required-field message', () => {
    const result = funcaoFormSchema.safeParse({ nome: '' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Campo obrigatório.');
    }
  });

  it('accepts a function name with an existing id', () => {
    expect(
      funcaoFormSchema.safeParse({ id: 'funcao-1', nome: 'Protético' }).success
    ).toBe(true);
  });
});
