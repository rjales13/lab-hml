import { beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import {
  getConsultorioDentista,
  getFechamentoByConsultorioDentista,
  getFechamentos,
  getFechamentosByConsultorioOrDentista,
  handleFechamento,
  saveFechamento,
} from './actions';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    entrada: {
      findMany: vi.fn(),
      updateMany: vi.fn(),
    },
    consultorio: {
      findUnique: vi.fn(),
    },
    dentista: {
      findUnique: vi.fn(),
    },
    servico: {
      findUnique: vi.fn(),
    },
    roteiro: {
      findUnique: vi.fn(),
    },
    fechamento: {
      create: vi.fn(),
      delete: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('fechamento actions', () => {
  const savedFechamento = {
    id: 'fechamento-id',
    fechado: true,
    data: new Date('2026-03-01T00:00:00.000Z'),
    valor: 10000,
    observacao: null,
    adicional_consultorio: [],
    adicional_dentista: [],
    created_at: new Date('2026-03-01T00:00:00.000Z'),
    updated_at: new Date('2026-03-01T00:00:00.000Z'),
  } satisfies Awaited<ReturnType<typeof prisma.fechamento.create>>;

  const savedConsultorio = {
    id: 'consultorio-id',
    nome: 'Central',
    cobranca: 'consultorio',
    cep: '09078-580',
    numero: '10',
    email: 'central@example.com',
    complemento: null,
    cep_entrega: null,
    numero_entrega: null,
    complemento_entrega: null,
    observacao: null,
    telefones: [],
    dentistas: [],
    secretarias: [],
    created_at: new Date('2026-03-01T00:00:00.000Z'),
    updated_at: new Date('2026-03-01T00:00:00.000Z'),
  } satisfies Awaited<ReturnType<typeof prisma.consultorio.findUnique>>;

  beforeEach(() => {
    vi.mocked(prisma.fechamento.create).mockResolvedValue(savedFechamento);
    vi.mocked(prisma.fechamento.delete).mockResolvedValue(savedFechamento);
    vi.mocked(prisma.fechamento.update).mockResolvedValue(savedFechamento);
    vi.mocked(prisma.fechamento.findMany).mockResolvedValue([]);
    vi.mocked(prisma.fechamento.findUnique).mockResolvedValue(savedFechamento);
    vi.mocked(prisma.entrada.findMany).mockResolvedValue([]);
    vi.mocked(prisma.entrada.updateMany).mockResolvedValue({ count: 1 });
    vi.mocked(prisma.consultorio.findUnique).mockResolvedValue(savedConsultorio);
    vi.mocked(prisma.dentista.findUnique).mockResolvedValue(null);
  });

  describe('getFechamentos', () => {
    it('returns no closeouts when a previous year has no records', async () => {
      const year = new Date().getFullYear() - 1;

      await expect(getFechamentos(year)).resolves.toEqual([]);
      expect(prisma.fechamento.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          fechado: true,
          valor: true,
          data: true,
        },
        where: {
          data: {
            gte: new Date(`${year}-01-01T00:00:00.000Z`),
            lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
          },
          fechado: true,
        },
        orderBy: { data: 'desc' },
      });
    });

    it('throws a localized error when closeouts cannot be loaded', async () => {
      vi.mocked(prisma.fechamento.findMany).mockRejectedValue(
        new Error('Database unavailable')
      );
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(getFechamentos(new Date().getFullYear() - 1)).rejects.toThrow(
        'Erro ao listar fechamento.'
      );
      expect(consoleError).toHaveBeenCalledOnce();
    });
  });

  describe('getConsultorioDentista', () => {
    it('returns an empty list and filters closed items by closeout id', async () => {
      await expect(
        getConsultorioDentista({ id: 'fechamento-id', isClosed: true })
      ).resolves.toEqual([]);

      expect(prisma.entrada.findMany).toHaveBeenCalledWith({
        select: { consultorio: true, dentista: true },
        where: { servicos: { some: { fechamento: { equals: 'fechamento-id' } } } },
      });
      expect(prisma.consultorio.findUnique).not.toHaveBeenCalled();
    });

    it('throws a localized error when entries cannot be loaded', async () => {
      vi.mocked(prisma.entrada.findMany).mockRejectedValue(
        new Error('Database unavailable')
      );
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(
        getConsultorioDentista({ id: 'fechamento-id', isClosed: false })
      ).rejects.toThrow('Erro ao listar entrada.');
      expect(consoleError).toHaveBeenCalledOnce();
    });
  });

  describe('getFechamentoByConsultorioDentista', () => {
    it('returns the saved additional consultorio data', async () => {
      vi.mocked(prisma.fechamento.findUnique).mockResolvedValue({
        ...savedFechamento,
        adicional_consultorio: [
          {
            idConsultorio: 'consultorio-id',
            desconto: [500],
            observacao: 'Acordo',
          },
        ],
      });

      await expect(
        getFechamentoByConsultorioDentista({
          fechamentoId: 'fechamento-id',
          id: 'consultorio-id',
          type: 'consultorio',
        })
      ).resolves.toEqual({
        id: 'consultorio-id',
        desconto: [500],
        observacao: 'Acordo',
      });
    });

    it('returns null when the closeout record is missing', async () => {
      vi.mocked(prisma.fechamento.findUnique).mockResolvedValue(null);

      await expect(
        getFechamentoByConsultorioDentista({
          fechamentoId: 'fechamento-id',
          id: 'consultorio-id',
          type: 'consultorio',
        })
      ).resolves.toBeNull();
    });
  });

  describe('getFechamentosByConsultorioOrDentista', () => {
    it('returns an empty consultorio summary when there are no eligible entries', async () => {
      vi.mocked(prisma.entrada.findMany).mockResolvedValue([]);

      await expect(
        getFechamentosByConsultorioOrDentista({
          id: 'consultorio-id',
          fechamentoId: undefined,
          type: 'consultorio',
        })
      ).resolves.toEqual({
        type: 'consultorio',
        nome: 'Central',
        itens: [],
        sumEntradas: 0,
        fechamentoData: undefined,
      });
      expect(prisma.entrada.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            servicos: {
              some: {
                OR: [{ fechamento: null }, { fechamento: { isSet: false } }],
                AND: [{ entregue: true }],
              },
            },
            consultorio: { equals: 'consultorio-id' },
          },
          orderBy: { created_at: 'asc' },
        })
      );
    });
  });

  describe('handleFechamento', () => {
    it('returns an error when creating a closeout without its date', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(handleFechamento()).resolves.toEqual({
        error: 'Erro no processo fechamento',
      });
      expect(prisma.fechamento.create).not.toHaveBeenCalled();
      expect(prisma.entrada.updateMany).not.toHaveBeenCalled();
      expect(revalidatePath).not.toHaveBeenCalled();
      expect(consoleError).toHaveBeenCalledOnce();
    });

    it('reopens a closeout and unassigns its services', async () => {
      await expect(handleFechamento({ id: 'fechamento-id' })).resolves.toBeUndefined();

      expect(prisma.fechamento.delete).toHaveBeenCalledWith({
        where: { id: 'fechamento-id' },
      });
      expect(prisma.entrada.updateMany).toHaveBeenCalledWith({
        data: {
          servicos: {
            updateMany: {
              where: { fechamento: 'fechamento-id' },
              data: { fechamento: null },
            },
          },
        },
      });
      expect(revalidatePath).toHaveBeenCalledWith('/fechamento');
    });
  });

  describe('saveFechamento', () => {
    it('updates discounts for an existing consultorio record', async () => {
      vi.mocked(prisma.fechamento.findUnique).mockResolvedValue({
        ...savedFechamento,
        adicional_consultorio: [
          {
            idConsultorio: 'consultorio-id',
            desconto: [],
            observacao: null,
          },
        ],
      });

      await expect(
        saveFechamento({
          data: {
            id: 'consultorio-id',
            desconto: [500],
            observacao: 'Acordo',
          },
          type: 'consultorio',
          fechamentoId: 'fechamento-id',
        })
      ).resolves.toBeUndefined();

      expect(prisma.fechamento.update).toHaveBeenCalledWith({
        where: { id: 'fechamento-id' },
        data: {
          adicional_consultorio: {
            updateMany: {
              where: { idConsultorio: 'consultorio-id' },
              data: { observacao: 'Acordo', desconto: [500] },
            },
          },
        },
      });
    });

    it('adds a new dentist discount record when no matching item exists', async () => {
      vi.mocked(prisma.fechamento.findUnique).mockResolvedValue(savedFechamento);

      await expect(
        saveFechamento({
          data: {
            id: 'dentista-id',
            desconto: [250],
            observacao: 'Ajuste',
          },
          type: 'dentista',
          fechamentoId: 'fechamento-id',
        })
      ).resolves.toBeUndefined();

      expect(prisma.fechamento.update).toHaveBeenCalledWith({
        where: { id: 'fechamento-id' },
        data: {
          adicional_dentista: {
            push: {
              idDentista: 'dentista-id',
              observacao: 'Ajuste',
              desconto: [250],
            },
          },
        },
      });
    });

    it('returns an error for invalid form data', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(
        saveFechamento({
          data: {
            id: 'consultorio-id',
            desconto: [true] as never,
          },
          type: 'consultorio',
          fechamentoId: 'fechamento-id',
        })
      ).resolves.toEqual({ error: 'Erro ao criar fechamento' });

      expect(prisma.fechamento.findUnique).not.toHaveBeenCalled();
      expect(consoleError).toHaveBeenCalledOnce();
    });
  });
});
