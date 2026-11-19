import { beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { saveDentista } from './actions';
import type { tDentistaFormData } from './form/form-schema';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    dentista: {
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('saveDentista', () => {
  const formData: tDentistaFormData = {
    nome: 'Marcelo Jales',
    cro: '20987266',
    email: 'marcelo@example.com',
    telefones: ['(11) 98765-9876'],
    especialidades: ['especialidade-id'],
  };

  const savedDentista = {
    id: 'dentista-id',
    ...formData,
    created_at: new Date('2026-01-01T00:00:00Z'),
    updated_at: new Date('2026-01-01T00:00:00Z'),
  } satisfies Awaited<ReturnType<typeof prisma.dentista.create>>;

  beforeEach(() => {
    vi.mocked(prisma.dentista.create).mockResolvedValue(savedDentista);
    vi.mocked(prisma.dentista.update).mockResolvedValue(savedDentista);
  });

  it('creates a dentist and revalidates its list path', async () => {
    const result = await saveDentista(formData);

    expect(prisma.dentista.create).toHaveBeenCalledWith({ data: formData });
    expect(prisma.dentista.update).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/dentista');
    expect(result).toBeUndefined();
  });

  it('updates an existing dentist without passing the id as data', async () => {
    const result = await saveDentista({
      ...formData,
      id: savedDentista.id,
    });

    expect(prisma.dentista.update).toHaveBeenCalledWith({
      where: { id: savedDentista.id },
      data: formData,
    });
    expect(prisma.dentista.create).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/dentista');
    expect(result).toBeUndefined();
  });

  it('returns an error when persistence fails', async () => {
    vi.mocked(prisma.dentista.create).mockRejectedValue(
      new Error('Database unavailable')
    );
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await saveDentista(formData);

    expect(result).toEqual({ error: 'Erro ao criar dentista' });
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledOnce();
  });
});
