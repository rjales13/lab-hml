import { beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { saveFuncao } from './actions';
import type { tFuncaoFormData } from './form/form-schema';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    funcao: {
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('saveFuncao', () => {
  const formData: tFuncaoFormData = { nome: 'Protético' };

  const savedFuncao = {
    id: 'funcao-id',
    nome: formData.nome,
    created_at: new Date('2026-01-01T00:00:00Z'),
    updated_at: new Date('2026-01-01T00:00:00Z'),
  } satisfies Awaited<ReturnType<typeof prisma.funcao.create>>;

  beforeEach(() => {
    vi.mocked(prisma.funcao.create).mockResolvedValue(savedFuncao);
    vi.mocked(prisma.funcao.update).mockResolvedValue(savedFuncao);
  });

  it('creates a function and revalidates its list path', async () => {
    const result = await saveFuncao(formData);

    expect(prisma.funcao.create).toHaveBeenCalledWith({ data: formData });
    expect(prisma.funcao.update).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/funcao');
    expect(result).toBeUndefined();
  });

  it('updates an existing function without passing the id as data', async () => {
    const result = await saveFuncao({ ...formData, id: savedFuncao.id });

    expect(prisma.funcao.update).toHaveBeenCalledWith({
      where: { id: savedFuncao.id },
      data: formData,
    });
    expect(prisma.funcao.create).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/funcao');
    expect(result).toBeUndefined();
  });

  it('returns an error when persistence fails', async () => {
    vi.mocked(prisma.funcao.create).mockRejectedValue(
      new Error('Database unavailable')
    );
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await saveFuncao(formData);

    expect(result).toEqual({ error: 'Erro ao criar funcao' });
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledOnce();
  });
});
