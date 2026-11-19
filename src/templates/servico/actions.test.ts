import { beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { saveServico } from './actions';
import type { tServicoFormData } from './form/form-schema';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    servico: {
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('saveServico', () => {
  const formData: tServicoFormData = {
    nome: 'Prótese Dentária',
    valor_sem_nota: ['50,00'],
    valor_com_nota: ['75,25'],
    valor_unicid: [],
    valor_pinheros: ['100,00'],
  };

  const savedServico = {
    id: 'servico-1',
    nome: 'Prótese Dentária',
    valor_sem_nota: [5000],
    valor_com_nota: [7525],
    valor_unicid: [],
    valor_pinheros: [10000],
    created_at: new Date('2026-01-01T00:00:00Z'),
    updated_at: new Date('2026-01-01T00:00:00Z'),
  } satisfies Awaited<ReturnType<typeof prisma.servico.create>>;

  beforeEach(() => {
    vi.mocked(prisma.servico.create).mockResolvedValue(savedServico);
    vi.mocked(prisma.servico.update).mockResolvedValue(savedServico);
  });

  it('creates a service with prices converted to cents and revalidates the list', async () => {
    const result = await saveServico(formData);

    expect(prisma.servico.create).toHaveBeenCalledWith({
      data: {
        nome: 'Prótese Dentária',
        valor_sem_nota: [5000],
        valor_com_nota: [7525],
        valor_unicid: [],
        valor_pinheros: [10000],
      },
    });
    expect(prisma.servico.update).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/servico');
    expect(result).toBeUndefined();
  });

  it('updates an existing service without including its id in data', async () => {
    const result = await saveServico({ ...formData, id: 'servico-1' });

    expect(prisma.servico.update).toHaveBeenCalledWith({
      where: { id: 'servico-1' },
      data: {
        nome: 'Prótese Dentária',
        valor_sem_nota: [5000],
        valor_com_nota: [7525],
        valor_unicid: [],
        valor_pinheros: [10000],
      },
    });
    expect(prisma.servico.create).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/servico');
    expect(result).toBeUndefined();
  });

  it('returns an error when persistence fails', async () => {
    vi.mocked(prisma.servico.create).mockRejectedValue(
      new Error('Database unavailable')
    );
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await saveServico(formData);

    expect(result).toEqual({ error: 'Erro ao criar servico' });
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledOnce();
  });

  it('rejects invalid service data before persistence', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await saveServico({ ...formData, nome: '' });

    expect(result).toEqual({ error: 'Erro ao criar servico' });
    expect(prisma.servico.create).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledOnce();
  });
});
