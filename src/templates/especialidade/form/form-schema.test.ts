import { describe, expect, it } from 'vitest';
import { especialidadeFormSchema } from './form-schema';

describe('especialidadeFormSchema', () => {
  it('accepts a specialty name when the optional id is omitted', () => {
    expect(
      especialidadeFormSchema.safeParse({ nome: 'Cirurgia Geral' }).success
    ).toBe(true);
  });

  it('rejects an empty specialty name', () => {
    const result = especialidadeFormSchema.safeParse({ nome: '' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Campo obrigatório.');
    }
  });

  it('accepts a specialty name with an existing id', () => {
    expect(
      especialidadeFormSchema.safeParse({
        id: 'especialidade-1',
        nome: 'Cirurgia Geral',
      }).success
    ).toBe(true);
  });
});
