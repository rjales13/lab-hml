import { describe, expect, it } from 'vitest';
import { funcionarioFormSchema } from './form-schema';

describe('funcionarioFormSchema', () => {
  const validFuncionario = {
    nome: 'Alberto Silva',
    cep: '09078-580',
    numero: '203',
    email: 'alberto@example.com',
    rg: '123456789',
    cpf: '529.982.247-25',
    data_nascimento: '01/01/1990',
    data_admissao: '01/01/2020',
    telefones: ['(11) 98765-9876'],
    funcoes: ['funcao-id'],
  };

  it('accepts valid employee data when optional fields are omitted', () => {
    expect(funcionarioFormSchema.safeParse(validFuncionario).success).toBe(true);
  });

  it.each([
    'nome',
    'cep',
    'numero',
    'rg',
    'data_nascimento',
    'data_admissao',
  ] as const)('rejects an empty required field: %s', (field) => {
    const result = funcionarioFormSchema.safeParse({
      ...validFuncionario,
      [field]: '',
    });

    expect(result.success).toBe(false);
  });

  it('rejects an empty or malformed email', () => {
    for (const email of ['', 'not-an-email']) {
      const result = funcionarioFormSchema.safeParse({
        ...validFuncionario,
        email,
      });

      expect(result.success).toBe(false);
    }
  });

  it('rejects an invalid CPF', () => {
    const result = funcionarioFormSchema.safeParse({
      ...validFuncionario,
      cpf: '111.111.111-11',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.find((issue) => issue.path[0] === 'cpf')?.message)
        .toBe('CPF inválido.');
    }
  });

  it('accepts an existing employee with empty list fields and optional data', () => {
    expect(
      funcionarioFormSchema.safeParse({
        ...validFuncionario,
        id: 'funcionario-id',
        complemento: '',
        data_recisao: '01/01/2025',
        observacao: 'Atendimento',
        telefones: [],
        funcoes: [],
      }).success
    ).toBe(true);
  });
});
