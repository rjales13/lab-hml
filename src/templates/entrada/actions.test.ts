import { beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import {
  getDentistasByConsultorio,
  getEntradas,
  getServicos,
  getValoresType,
  saveEntrada,
  saveValoresType,
} from './actions';
import type { tEntradaFormData } from './form/form-schema';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    entrada: {
      create: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
    },
    servico: {
      findMany: vi.fn(),
    },
    consultorio: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    dentista: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    valores: {
      findFirst: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('entrada actions', () => {
  const formData: tEntradaFormData = {
    consultorio: 'consultorio-id',
    dentista: 'dentista-id',
    paciente: 'João da Silva',
    observacao: 'Retornar na próxima semana',
    servicos: [
      {
        idServicoEntrada: 'item-1',
        servico: 'servico-id',
        valor: 2500,
        desconto: 0,
        quantidade: 1,
        repeticao: 0,
        funcionario: 'funcionario-id',
        data_previsao: new Date('2026-03-15T00:00:00.000Z'),
        data_saida: null,
      },
    ],
  };

  const savedEntrada = {
    id: 'entrada-id',
    ...formData,
    observacao: formData.observacao ?? null,
    servicos: [
      {
        ...formData.servicos[0],
        data_entrada: new Date('2026-03-01T00:00:00.000Z'),
        data_saida: null,
        roteiro: null,
        entregue: null,
        fechamento: null,
      },
    ],
    created_at: new Date('2026-03-01T00:00:00.000Z'),
    updated_at: new Date('2026-03-01T00:00:00.000Z'),
  } satisfies Awaited<ReturnType<typeof prisma.entrada.create>>;

  const consultorio = {
    id: 'consultorio-id',
    cobranca: 'consultorio',
    nome: 'Consultório Central',
    cep: '09078-580',
    numero: '203',
    email: 'contato@consultorio.com',
    complemento: null,
    cep_entrega: null,
    numero_entrega: null,
    complemento_entrega: null,
    observacao: null,
    telefones: [],
    dentistas: ['dentista-id'],
    secretarias: [],
    created_at: new Date('2026-03-01T00:00:00.000Z'),
    updated_at: new Date('2026-03-01T00:00:00.000Z'),
  } satisfies Awaited<ReturnType<typeof prisma.consultorio.findUnique>>;

  const dentista = {
    id: 'dentista-id',
    nome: 'Dra. Ana',
    cro: '12345',
    email: 'ana@example.com',
    telefones: [],
    especialidades: [],
    created_at: new Date('2026-03-01T00:00:00.000Z'),
    updated_at: new Date('2026-03-01T00:00:00.000Z'),
  } satisfies Awaited<ReturnType<typeof prisma.dentista.findUnique>>;

  const savedValores = {
    id: 'valores-id',
    consultorio: 'consultorio-id',
    dentista: 'dentista-id',
    tipo: 'sem-nota',
    created_at: new Date('2026-03-01T00:00:00.000Z'),
    updated_at: new Date('2026-03-01T00:00:00.000Z'),
  } satisfies NonNullable<Awaited<ReturnType<typeof prisma.valores.findFirst>>>;

  beforeEach(() => {
    vi.mocked(prisma.entrada.create).mockResolvedValue(savedEntrada);
    vi.mocked(prisma.entrada.update).mockResolvedValue(savedEntrada);
    vi.mocked(prisma.valores.create).mockResolvedValue(savedValores);
    vi.mocked(prisma.valores.update).mockResolvedValue(savedValores);
  });

  describe('saveEntrada', () => {
    it('creates an entry and revalidates its list path', async () => {
      const result = await saveEntrada(formData);

      expect(prisma.entrada.create).toHaveBeenCalledWith({ data: formData });
      expect(prisma.entrada.update).not.toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith('/entrada');
      expect(result).toBeUndefined();
    });

    it('updates an existing entry without including its id in the data', async () => {
      const result = await saveEntrada({ ...formData, id: 'entrada-id' });

      expect(prisma.entrada.update).toHaveBeenCalledWith({
        where: { id: 'entrada-id' },
        data: formData,
      });
      expect(prisma.entrada.create).not.toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith('/entrada');
      expect(result).toBeUndefined();
    });

    it('returns an error when persistence fails', async () => {
      vi.mocked(prisma.entrada.create).mockRejectedValue(
        new Error('Database unavailable')
      );
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await saveEntrada(formData);

      expect(result).toEqual({ error: 'Erro ao criar entrada' });
      expect(revalidatePath).not.toHaveBeenCalled();
      expect(consoleError).toHaveBeenCalledOnce();
    });
  });

  describe('getEntradas', () => {
    it('returns pending entries with the related names and filters by month', async () => {
      const createdAt = new Date('2026-03-05T00:00:00.000Z');
      vi.mocked(prisma.entrada.findMany).mockResolvedValue([
        {
          ...savedEntrada,
          created_at: createdAt,
        },
      ]);
      vi.mocked(prisma.consultorio.findUnique).mockResolvedValue(consultorio);
      vi.mocked(prisma.dentista.findUnique).mockResolvedValue(dentista);

      const result = await getEntradas('pending', {
        enabled: true,
        month: 3,
        year: 2026,
      });

      expect(prisma.entrada.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          consultorio: true,
          dentista: true,
          paciente: true,
          created_at: true,
        },
        where: {
          servicos: {
            some: {
              OR: [{ data_saida: null }, { data_saida: { isSet: false } }],
            },
          },
          created_at: {
            gte: new Date(Date.UTC(2026, 2, 1)),
            lt: new Date(Date.UTC(2026, 3, 1)),
          },
        },
        orderBy: { created_at: 'desc' },
      });
      expect(result).toEqual([
        {
          id: 'entrada-id',
          consultorio: 'Consultório Central',
          dentista: 'Dra. Ana',
          paciente: 'João da Silva',
          created_at: createdAt,
        },
      ]);
    });

    it('includes all entries and uses fallback names when related records are missing', async () => {
      vi.mocked(prisma.entrada.findMany).mockResolvedValue([
        {
          ...savedEntrada,
          consultorio: 'missing-consultorio',
          dentista: 'missing-dentista',
          paciente: 'Maria',
        },
      ]);
      vi.mocked(prisma.consultorio.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.dentista.findUnique).mockResolvedValue(null);

      const result = await getEntradas('all');

      expect(prisma.entrada.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          consultorio: true,
          dentista: true,
          paciente: true,
          created_at: true,
        },
        where: {},
        orderBy: { created_at: 'desc' },
      });
      expect(result).toEqual([
        {
          id: 'entrada-id',
          consultorio: 'Não encontrado',
          dentista: 'Não encontrado',
          paciente: 'Maria',
          created_at: savedEntrada.created_at,
        },
      ]);
    });

    it('throws a localized error when listing entries fails', async () => {
      vi.mocked(prisma.entrada.findMany).mockRejectedValue(
        new Error('Database unavailable')
      );
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(getEntradas()).rejects.toThrow('Erro ao listar entrada.');

      expect(consoleError).toHaveBeenCalledOnce();
    });
  });

  describe('getServicos', () => {
    beforeEach(() => {
      vi.mocked(prisma.servico.findMany).mockResolvedValue([
        {
          id: 'servico-id',
          nome: 'Coroa',
          valor_sem_nota: [1000],
          valor_com_nota: [1200],
          valor_unicid: [900],
          valor_pinheros: [800],
          created_at: new Date('2026-03-01T00:00:00.000Z'),
          updated_at: new Date('2026-03-01T00:00:00.000Z'),
        },
      ]);
    });

    it.each([
      ['sem-nota', 1000],
      ['com-nota', 1200],
      ['unicid', 900],
      ['pinheros', 800],
      ['outro', 800],
    ])('maps %s prices to service options', async (type, valor) => {
      await expect(getServicos(type)).resolves.toEqual([
        { id: 'servico-id', value: 'Coroa', valor },
      ]);
      expect(prisma.servico.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          nome: true,
          valor_sem_nota: true,
          valor_com_nota: true,
          valor_unicid: true,
          valor_pinheros: true,
        },
        orderBy: { nome: 'asc' },
      });
    });

    it('throws a localized error when services cannot be loaded', async () => {
      vi.mocked(prisma.servico.findMany).mockRejectedValue(
        new Error('Database unavailable')
      );
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(getServicos('sem-nota')).rejects.toThrow(
        'Erro ao listar servico.'
      );

      expect(consoleError).toHaveBeenCalledOnce();
    });
  });

  describe('getDentistasByConsultorio', () => {
    it('returns the consultants linked to the requested office', async () => {
      vi.mocked(prisma.consultorio.findMany).mockResolvedValue([
        { ...consultorio, dentistas: ['dentista-1', 'dentista-2'] },
      ]);
      vi.mocked(prisma.dentista.findMany).mockResolvedValue([
        { ...dentista, id: 'dentista-1', nome: 'Dra. Ana' },
        { ...dentista, id: 'dentista-2', nome: 'Dr. Bruno' },
      ]);

      await expect(getDentistasByConsultorio('consultorio-id')).resolves.toEqual([
        { id: 'dentista-1', value: 'Dra. Ana' },
        { id: 'dentista-2', value: 'Dr. Bruno' },
      ]);
      expect(prisma.consultorio.findMany).toHaveBeenCalledWith({
        select: { dentistas: true },
        where: { id: 'consultorio-id' },
      });
      expect(prisma.dentista.findMany).toHaveBeenCalledWith({
        select: { id: true, nome: true },
        where: { id: { in: ['dentista-1', 'dentista-2'] } },
        orderBy: { nome: 'asc' },
      });
    });

    it('returns an empty list when the office has no linked dentists', async () => {
      vi.mocked(prisma.consultorio.findMany).mockResolvedValue([]);
      vi.mocked(prisma.dentista.findMany).mockResolvedValue([]);

      await expect(getDentistasByConsultorio('missing-id')).resolves.toEqual([]);
      expect(prisma.dentista.findMany).toHaveBeenCalledWith({
        select: { id: true, nome: true },
        where: { id: { in: undefined } },
        orderBy: { nome: 'asc' },
      });
    });

    it('throws a localized error when the lookup fails', async () => {
      vi.mocked(prisma.consultorio.findMany).mockRejectedValue(
        new Error('Database unavailable')
      );
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(getDentistasByConsultorio('consultorio-id')).rejects.toThrow(
        'Erro ao listar dentista.'
      );
      expect(consoleError).toHaveBeenCalledOnce();
    });
  });

  describe('getValoresType', () => {
    it('returns the saved price type or an empty string when none exists', async () => {
      vi.mocked(prisma.valores.findFirst).mockResolvedValue({
        ...savedValores,
        tipo: 'com-nota',
      });
      await expect(
        getValoresType('consultorio-id', 'dentista-id')
      ).resolves.toBe('com-nota');

      vi.mocked(prisma.valores.findFirst).mockResolvedValue(null);
      await expect(
        getValoresType('consultorio-id', 'dentista-id')
      ).resolves.toBe('');
    });

    it('throws a localized error when the lookup fails', async () => {
      vi.mocked(prisma.valores.findFirst).mockRejectedValue(
        new Error('Database unavailable')
      );
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(
        getValoresType('consultorio-id', 'dentista-id')
      ).rejects.toThrow('Erro ao listar valores.');
      expect(consoleError).toHaveBeenCalledOnce();
    });
  });

  describe('saveValoresType', () => {
    it('updates an existing price type', async () => {
      vi.mocked(prisma.valores.findFirst).mockResolvedValue(savedValores);

      await expect(
        saveValoresType('consultorio-id', 'dentista-id', 'com-nota')
      ).resolves.toBeUndefined();

      expect(prisma.valores.update).toHaveBeenCalledWith({
        where: { id: 'valores-id' },
        data: { tipo: 'com-nota' },
      });
      expect(prisma.valores.create).not.toHaveBeenCalled();
    });

    it('creates a price type when no record exists', async () => {
      vi.mocked(prisma.valores.findFirst).mockResolvedValue(null);

      await expect(
        saveValoresType('consultorio-id', 'dentista-id', 'sem-nota')
      ).resolves.toBeUndefined();

      expect(prisma.valores.create).toHaveBeenCalledWith({
        data: {
          consultorio: 'consultorio-id',
          dentista: 'dentista-id',
          tipo: 'sem-nota',
        },
      });
      expect(prisma.valores.update).not.toHaveBeenCalled();
    });

    it('returns an error when saving the price type fails', async () => {
      vi.mocked(prisma.valores.findFirst).mockRejectedValue(
        new Error('Database unavailable')
      );
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(
        saveValoresType('consultorio-id', 'dentista-id', 'sem-nota')
      ).resolves.toEqual({ error: 'Erro ao criar valores' });

      expect(consoleError).toHaveBeenCalledOnce();
    });
  });
});
