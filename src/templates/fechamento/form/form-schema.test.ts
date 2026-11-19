import { describe, expect, it } from 'vitest';
import { fechamentoFormSchema } from './form-schema';

describe('fechamentoFormSchema', () => {
  it('accepts a discount list containing string and numeric values', () => {
    expect(
      fechamentoFormSchema.safeParse({
        desconto: ['150', 250],
        observacao: 'Acordo especial',
      }).success
    ).toBe(true);
  });

  it('accepts an empty discount list and optional observation', () => {
    expect(fechamentoFormSchema.safeParse({ desconto: [] }).success).toBe(true);
  });

  it('rejects a discount value of an unsupported type', () => {
    expect(
      fechamentoFormSchema.safeParse({ desconto: [true] }).success
    ).toBe(false);
  });
});
