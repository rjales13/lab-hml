import { describe, expect, it } from 'vitest';
import { roteiroFormSchema } from './form-schema';

describe('roteiroFormSchema', () => {
  it('accepts a valid route with optional fields omitted', () => {
    expect(roteiroFormSchema.safeParse({ data: '2026-07-14' }).success).toBe(
      true
    );
  });

  it('requires a route date', () => {
    const result = roteiroFormSchema.safeParse({ data: '' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe('Campo obrigatório.');
    }
  });

  it('accepts optional id, delivery state, and observation', () => {
    expect(
      roteiroFormSchema.safeParse({
        id: 'roteiro-1',
        data: '2026-07-14',
        entregue: true,
        observacao: 'Entregar pela manhã',
      }).success
    ).toBe(true);
  });
});
