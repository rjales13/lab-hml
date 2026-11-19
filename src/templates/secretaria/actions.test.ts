import { beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { saveSecretaria } from './actions';
import type { tSecretariaFormData } from './form/form-schema';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    secretaria: {
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('saveSecretaria', () => {
  const formData: tSecretariaFormData = {
    nome: 'Rafaela Silva',
    email: 'rafaela@example.com',
    telefones: ['(11) 98765-4321'],
  };

  const savedSecretaria = {
    id: 'secretaria-1',
    ...formData,
    created_at: new Date('2026-01-01T00:00:00Z'),
    updated_at: new Date('2026-01-01T00:00:00Z'),
  } satisfies Awaited<ReturnType<typeof prisma.secretaria.create>>;

  beforeEach(() => {
    vi.mocked(prisma.secretaria.create).mockResolvedValue(savedSecretaria);
    vi.mocked(prisma.secretaria.update).mockResolvedValue(savedSecretaria);
  });

  it('creates a secretary and revalidates the list path', async () => {
    const result = await saveSecretaria(formData);

    expect(prisma.secretaria.create).toHaveBeenCalledWith({ data: formData });
    expect(prisma.secretaria.update).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/secretaria');
    expect(result).toBeUndefined();
  });

  it('updates an existing secretary without including id in data', async () => {
    const result = await saveSecretaria({
      ...formData,
      id: 'secretaria-1',
    });

    expect(prisma.secretaria.update).toHaveBeenCalledWith({
      where: { id: 'secretaria-1' },
      data: formData,
    });
    expect(prisma.secretaria.create).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/secretaria');
    expect(result).toBeUndefined();
  });

  it('returns an error when persistence fails', async () => {
    vi.mocked(prisma.secretaria.create).mockRejectedValue(
      new Error('Database unavailable')
    );
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await saveSecretaria(formData);

    expect(result).toEqual({ error: 'Erro ao criar secretaria' });
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledOnce();
  });

  it('rejects invalid secretary data before persistence', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await saveSecretaria({ ...formData, email: 'invalid' });

    expect(result).toEqual({ error: 'Erro ao criar secretaria' });
    expect(prisma.secretaria.create).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledOnce();
  });
});
