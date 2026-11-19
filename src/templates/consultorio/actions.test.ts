import { beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { saveConsultorio } from './actions';
import type { tConsultorioFormData } from './form/form-schema';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    consultorio: {
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('saveConsultorio', () => {
  const formData: tConsultorioFormData = {
    nome: 'Consultório Central',
    cobranca: 'consultorio',
    cep: '09078-580',
    numero: '203',
    email: 'contato@consultorio.com',
    telefones: ['(11) 98765-9876'],
    dentistas: ['dentista-id'],
    secretarias: ['secretaria-id'],
  };

  const savedConsultorio = {
    id: 'consultorio-id',
    ...formData,
    complemento: null,
    cep_entrega: null,
    numero_entrega: null,
    complemento_entrega: null,
    observacao: null,
    created_at: new Date('2026-01-01T00:00:00Z'),
    updated_at: new Date('2026-01-01T00:00:00Z'),
  } satisfies Awaited<ReturnType<typeof prisma.consultorio.create>>;

  beforeEach(() => {
    vi.mocked(prisma.consultorio.create).mockResolvedValue(savedConsultorio);
    vi.mocked(prisma.consultorio.update).mockResolvedValue(savedConsultorio);
  });

  it('creates a consultorio and revalidates its list path', async () => {
    const result = await saveConsultorio(formData);

    expect(prisma.consultorio.create).toHaveBeenCalledWith({
      data: formData,
    });
    expect(prisma.consultorio.update).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/consultorio');
    expect(result).toBeUndefined();
  });

  it('updates an existing consultorio without passing the id as data', async () => {
    const result = await saveConsultorio({
      ...formData,
      id: savedConsultorio.id,
    });

    expect(prisma.consultorio.update).toHaveBeenCalledWith({
      where: { id: savedConsultorio.id },
      data: formData,
    });
    expect(prisma.consultorio.create).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/consultorio');
    expect(result).toBeUndefined();
  });

  it('returns an error when persistence fails', async () => {
    vi.mocked(prisma.consultorio.create).mockRejectedValue(
      new Error('Database unavailable')
    );
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await saveConsultorio(formData);

    expect(result).toEqual({ error: 'Erro ao criar consultorio' });
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledOnce();
  });
});
