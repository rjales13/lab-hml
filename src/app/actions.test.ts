import { beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getAll, getById, remove } from './actions';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    servico: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

type Servico = Awaited<ReturnType<typeof prisma.servico.findMany>>[number];

const servico: Servico = {
  id: '507f1f77bcf86cd799439011',
  nome: 'Prótese Dentária',
  valor_sem_nota: [5000],
  valor_com_nota: [7500],
  valor_unicid: [],
  valor_pinheros: [],
  created_at: new Date('2026-01-01T00:00:00Z'),
  updated_at: new Date('2026-01-02T00:00:00Z'),
};

describe('app actions', () => {
  beforeEach(() => {
    vi.mocked(prisma.servico.findMany).mockResolvedValue([servico]);
    vi.mocked(prisma.servico.findUnique).mockResolvedValue(servico);
    vi.mocked(prisma.servico.delete).mockResolvedValue(servico);
  });

  describe('getAll', () => {
    it('returns rows and queries the requested fields in updated order', async () => {
      const result = await getAll({
        modelKey: 'servico',
        fields: ['nome'],
      });

      expect(prisma.servico.findMany).toHaveBeenCalledWith({
        select: { id: true, nome: true },
        orderBy: { updated_at: 'desc' },
      });
      expect(result).toEqual([servico]);
    });

    it('maps a single selected field into list-sheet values', async () => {
      const result = await getAll({
        modelKey: 'servico',
        fields: ['nome'],
        listSheet: true,
      });

      expect(result).toEqual([
        { id: servico.id, value: servico.nome },
      ]);
    });

    it('logs and throws the translated error when the query fails', async () => {
      vi.mocked(prisma.servico.findMany).mockRejectedValue(
        new Error('Database unavailable')
      );
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(
        getAll({ modelKey: 'servico', fields: ['nome'] })
      ).rejects.toThrow('Erro ao listar servico.');

      expect(consoleError).toHaveBeenCalledOnce();
    });
  });

  describe('getById', () => {
    it('returns a record for a valid identifier', async () => {
      const result = await getById({
        modelKey: 'servico',
        fields: { id: servico.id },
      });

      expect(prisma.servico.findUnique).toHaveBeenCalledWith({
        where: { id: servico.id },
      });
      expect(result).toEqual(servico);
    });

    it('returns an empty object without querying for an invalid identifier', async () => {
      const result = await getById({
        modelKey: 'servico',
        fields: { id: 'invalid-id' },
      });

      expect(result).toEqual({});
      expect(prisma.servico.findUnique).not.toHaveBeenCalled();
    });

    it('returns an empty object when no matching record exists', async () => {
      vi.mocked(prisma.servico.findUnique).mockResolvedValue(null);

      const result = await getById({
        modelKey: 'servico',
        fields: { id: servico.id },
      });

      expect(result).toEqual({});
    });

    it('logs and throws the translated error when the query fails', async () => {
      vi.mocked(prisma.servico.findUnique).mockRejectedValue(
        new Error('Database unavailable')
      );
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(
        getById({ modelKey: 'servico', fields: { id: servico.id } })
      ).rejects.toThrow('Erro ao listar servico.');

      expect(consoleError).toHaveBeenCalledOnce();
    });
  });

  describe('remove', () => {
    it('deletes the record and revalidates its list path', async () => {
      const result = await remove({
        modelKey: 'servico',
        id: servico.id,
      });

      expect(prisma.servico.delete).toHaveBeenCalledWith({
        where: { id: servico.id },
      });
      expect(revalidatePath).toHaveBeenCalledWith('/servico');
      expect(result).toBeUndefined();
    });

    it('returns an error and does not revalidate when deletion fails', async () => {
      vi.mocked(prisma.servico.delete).mockRejectedValue(
        new Error('Database unavailable')
      );
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await remove({
        modelKey: 'servico',
        id: servico.id,
      });

      expect(result).toEqual({ error: 'Erro ao deletar servico:' });
      expect(revalidatePath).not.toHaveBeenCalled();
      expect(consoleError).toHaveBeenCalledOnce();
    });
  });
});
