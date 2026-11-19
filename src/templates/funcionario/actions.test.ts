import { beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { saveFuncionario } from './actions';
import type { tFuncionarioFormData } from './form/form-schema';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    funcionario: {
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('saveFuncionario', () => {
  const formData: tFuncionarioFormData = {
    nome: 'Alberto Silva',
    cep: '09078-580',
    numero: '203',
    complemento: 'Sala 2',
    email: 'alberto@example.com',
    rg: '123456789',
    cpf: '529.982.247-25',
    data_nascimento: '01/01/1990',
    data_admissao: '01/01/2020',
    data_recisao: '',
    observacao: 'Equipe clínica',
    telefones: ['(11) 98765-9876'],
    funcoes: ['funcao-id'],
  };

  const savedFuncionario = {
    id: 'funcionario-id',
    ...formData,
    complemento: formData.complemento ?? null,
    observacao: formData.observacao ?? null,
    data_recisao: formData.data_recisao ?? null,
    created_at: new Date('2026-01-01T00:00:00Z'),
    updated_at: new Date('2026-01-01T00:00:00Z'),
  } satisfies Awaited<ReturnType<typeof prisma.funcionario.create>>;

  beforeEach(() => {
    vi.mocked(prisma.funcionario.create).mockResolvedValue(savedFuncionario);
    vi.mocked(prisma.funcionario.update).mockResolvedValue(savedFuncionario);
  });

  it('creates an employee and revalidates the list path', async () => {
    const result = await saveFuncionario(formData);

    expect(prisma.funcionario.create).toHaveBeenCalledWith({ data: formData });
    expect(prisma.funcionario.update).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/funcionario');
    expect(result).toBeUndefined();
  });

  it('updates an existing employee without including the id in data', async () => {
    const result = await saveFuncionario({
      ...formData,
      id: savedFuncionario.id,
    });

    expect(prisma.funcionario.update).toHaveBeenCalledWith({
      where: { id: savedFuncionario.id },
      data: formData,
    });
    expect(prisma.funcionario.create).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/funcionario');
    expect(result).toBeUndefined();
  });

  it('returns an error when persistence fails', async () => {
    vi.mocked(prisma.funcionario.create).mockRejectedValue(
      new Error('Database unavailable')
    );
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await saveFuncionario(formData);

    expect(result).toEqual({ error: 'Erro ao criar funcionario' });
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledOnce();
  });

  it('rejects invalid CPF data before persisting', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await saveFuncionario({ ...formData, cpf: '111.111.111-11' });

    expect(result).toEqual({ error: 'Erro ao criar funcionario' });
    expect(prisma.funcionario.create).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledOnce();
  });
});
