import { beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { saveEspecialidade } from './actions';
import type { tEspecialidadeFormData } from './form/form-schema';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    especialidade: {
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('saveEspecialidade', () => {
  const formData: tEspecialidadeFormData = {
    nome: 'Cirurgia Geral',
  };

  const savedEspecialidade = {
    id: 'especialidade-id',
    nome: formData.nome,
    created_at: new Date('2026-01-01T00:00:00Z'),
    updated_at: new Date('2026-01-01T00:00:00Z'),
  } satisfies Awaited<ReturnType<typeof prisma.especialidade.create>>;

  beforeEach(() => {
    vi.mocked(prisma.especialidade.create).mockResolvedValue(
      savedEspecialidade
    );
    vi.mocked(prisma.especialidade.update).mockResolvedValue(
      savedEspecialidade
    );
  });

  it('creates a specialty and revalidates its list path', async () => {
    const result = await saveEspecialidade(formData);

    expect(prisma.especialidade.create).toHaveBeenCalledWith({
      data: formData,
    });
    expect(prisma.especialidade.update).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/especialidade');
    expect(result).toBeUndefined();
  });

  it('updates an existing specialty without passing its id as data', async () => {
    const result = await saveEspecialidade({
      ...formData,
      id: savedEspecialidade.id,
    });

    expect(prisma.especialidade.update).toHaveBeenCalledWith({
      where: { id: savedEspecialidade.id },
      data: formData,
    });
    expect(prisma.especialidade.create).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/especialidade');
    expect(result).toBeUndefined();
  });

  it('returns an error when persistence fails', async () => {
    vi.mocked(prisma.especialidade.create).mockRejectedValue(
      new Error('Database unavailable')
    );
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await saveEspecialidade(formData);

    expect(result).toEqual({ error: 'Erro ao criar especialidade' });
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledOnce();
  });
});
