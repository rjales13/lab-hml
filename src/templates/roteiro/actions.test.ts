import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import {
  getEntradas,
  getEntradasServicos,
  getRoteiros,
  saveRoteiro,
  updateEntradas,
} from './actions';
import type { tRoteiroFormData } from './form/form-schema';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    roteiro: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    entrada: {
      findMany: vi.fn(),
      updateMany: vi.fn(),
    },
    consultorio: { findUnique: vi.fn() },
    dentista: { findUnique: vi.fn() },
    servico: { findUnique: vi.fn() },
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

type Route = Awaited<ReturnType<typeof prisma.roteiro.findMany>>[number];
type Entry = Awaited<ReturnType<typeof prisma.entrada.findMany>>[number];

const now = new Date('2026-07-14T12:00:00Z');

const route: Route = {
  id: 'roteiro-1',
  data: '2026-07-14',
  entregue: true,
  observacao: null,
  created_at: now,
  updated_at: now,
};

const entry: Entry = {
  id: 'entrada-1',
  consultorio: 'consultorio-1',
  dentista: 'dentista-1',
  paciente: 'Maria Silva',
  observacao: null,
  servicos: [
    {
      idServicoEntrada: 'service-entry-1',
      servico: 'servico-1',
      valor: 1000,
      desconto: 0,
      quantidade: 1,
      repeticao: 0,
      funcionario: 'funcionario-1',
      data_entrada: now,
      data_previsao: now,
      data_saida: now,
      roteiro: null,
      entregue: null,
      fechamento: null,
    },
    {
      idServicoEntrada: 'service-entry-2',
      servico: 'servico-2',
      valor: 1000,
      desconto: 0,
      quantidade: 1,
      repeticao: 0,
      funcionario: 'funcionario-1',
      data_entrada: now,
      data_previsao: now,
      data_saida: now,
      roteiro: 'roteiro-1',
      entregue: true,
      fechamento: null,
    },
  ],
  created_at: now,
  updated_at: now,
};

describe('getRoteiros', () => {
  beforeEach(() => {
    vi.mocked(prisma.roteiro.findMany).mockResolvedValue([route]);
  });

  it('maps route records and applies the delivery filter', async () => {
    const result = await getRoteiros('sim');

    expect(result).toEqual([
      {
        id: 'roteiro-1',
        data: '2026-07-14',
        created_at: now,
        entregue: 'sim',
      },
    ]);
    expect(prisma.roteiro.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { entregue: true },
        orderBy: { data: 'desc' },
      })
    );
  });

  it('includes route date and creation date ranges when the date filter is enabled', async () => {
    await getRoteiros('nao', { enabled: true, month: 7, year: 2026 });

    expect(prisma.roteiro.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            {
              data: {
                gte: '2026-07-01',
                lt: '2026-08-01',
              },
            },
            {
              created_at: {
                gte: new Date('2026-07-01T00:00:00.000Z'),
                lt: new Date('2026-08-01T00:00:00.000Z'),
              },
            },
          ],
        },
      })
    );
  });

  it('reports query failures with the route-specific error', async () => {
    vi.mocked(prisma.roteiro.findMany).mockRejectedValue(
      new Error('Database unavailable')
    );
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(getRoteiros()).rejects.toThrow('Erro ao listar roteiro.');
    expect(consoleError).toHaveBeenCalledOnce();
  });
});

describe('saveRoteiro', () => {
  const formData: tRoteiroFormData = {
    data: '2026-07-14',
    entregue: true,
    observacao: 'Rota central',
  };

  beforeEach(() => {
    vi.mocked(prisma.roteiro.create).mockResolvedValue(route);
    vi.mocked(prisma.roteiro.update).mockResolvedValue(route);
    vi.mocked(prisma.entrada.updateMany).mockResolvedValue({ count: 1 });
  });

  it('creates a route and revalidates the list', async () => {
    const result = await saveRoteiro(formData, undefined);

    expect(prisma.roteiro.create).toHaveBeenCalledWith({ data: formData });
    expect(prisma.roteiro.update).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith('/roteiro');
    expect(result).toBeUndefined();
  });

  it('updates a route and assigns its selected services', async () => {
    const selectedEntries = [
      { idEntrada: 'entrada-1', idServicoEntrada: ['service-entry-1'] },
    ];

    const result = await saveRoteiro(
      { ...formData, id: 'roteiro-1' },
      selectedEntries
    );

    expect(prisma.roteiro.update).toHaveBeenCalledWith({
      where: { id: 'roteiro-1' },
      data: formData,
    });
    expect(prisma.entrada.updateMany).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: { servicos: { some: { roteiro: 'roteiro-1' } } },
      })
    );
    expect(prisma.entrada.updateMany).toHaveBeenNthCalledWith(2, {
      where: { id: 'entrada-1' },
      data: {
        servicos: {
          updateMany: {
            where: { idServicoEntrada: { in: ['service-entry-1'] } },
            data: { entregue: true, roteiro: 'roteiro-1' },
          },
        },
      },
    });
    expect(revalidatePath).toHaveBeenCalledWith('/roteiro');
    expect(result).toBeUndefined();
  });

  it('returns a validation error without writing invalid route data', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await saveRoteiro({ data: '' }, undefined);

    expect(result).toEqual({ error: 'Erro ao criar roteiro' });
    expect(prisma.roteiro.create).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledOnce();
  });
});

describe('getEntradas', () => {
  it('filters entries to unassigned or selected-route services and resolves labels', async () => {
    vi.mocked(prisma.entrada.findMany).mockResolvedValue([entry]);
    vi.mocked(prisma.consultorio.findUnique).mockResolvedValue({
      id: 'consultorio-1',
      cobranca: 'consultorio',
      nome: 'Central',
      cep: '09078-580',
      numero: '12',
      email: 'central@example.com',
      complemento: null,
      cep_entrega: null,
      numero_entrega: null,
      complemento_entrega: null,
      observacao: null,
      telefones: [],
      dentistas: [],
      secretarias: [],
      created_at: now,
      updated_at: now,
    });
    vi.mocked(prisma.dentista.findUnique).mockResolvedValue({
      id: 'dentista-1',
      nome: 'Dra. Ana',
      cro: '12345',
      email: 'ana@example.com',
      telefones: [],
      especialidades: [],
      created_at: now,
      updated_at: now,
    });
    vi.mocked(prisma.servico.findUnique)
      .mockResolvedValueOnce({
        id: 'servico-1',
        nome: 'Coroa',
        valor_sem_nota: [],
        valor_com_nota: [],
        valor_unicid: [],
        valor_pinheros: [],
        created_at: now,
        updated_at: now,
      })
      .mockResolvedValueOnce({
        id: 'servico-2',
        nome: 'Prótese',
        valor_sem_nota: [],
        valor_com_nota: [],
        valor_unicid: [],
        valor_pinheros: [],
        created_at: now,
        updated_at: now,
      });

    const result = await getEntradas('roteiro-1');

    expect(result).toEqual([
      {
        id: 'entrada-1',
        consultorio: 'Central',
        dentista: 'Dra. Ana',
        paciente: 'Maria Silva',
        servicos: [
          {
            id: 'service-entry-1',
            nome: 'Coroa',
            roteiro: null,
            fechamento: null,
          },
          {
            id: 'service-entry-2',
            nome: 'Prótese',
            roteiro: 'roteiro-1',
            fechamento: null,
          },
        ],
      },
    ]);
  });

  it('returns an error result if entries cannot be loaded', async () => {
    vi.mocked(prisma.entrada.findMany).mockRejectedValue(
      new Error('Database unavailable')
    );
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(getEntradas('roteiro-1')).resolves.toEqual({
      error: 'Erro ao listar entrada:',
    });
    expect(consoleError).toHaveBeenCalledOnce();
  });
});

describe('getEntradasServicos', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns selected service data with the delivery address', async () => {
    vi.mocked(prisma.entrada.findMany).mockResolvedValue([entry]);
    vi.mocked(prisma.consultorio.findUnique).mockResolvedValue({
      id: 'consultorio-1',
      cobranca: 'consultorio',
      email: 'central@example.com',
      nome: 'Central',
      cep: '09078-580',
      numero: '12',
      complemento: null,
      cep_entrega: '09078-580',
      numero_entrega: null,
      complemento_entrega: null,
      observacao: null,
      telefones: [],
      dentistas: [],
      secretarias: [],
      created_at: now,
      updated_at: now,
    });
    vi.mocked(prisma.dentista.findUnique).mockResolvedValue({
      id: 'dentista-1',
      nome: 'Dra. Ana',
      cro: '12345',
      email: 'ana@example.com',
      telefones: [],
      especialidades: [],
      created_at: now,
      updated_at: now,
    });
    vi.mocked(prisma.servico.findUnique).mockResolvedValue({
      id: 'servico-1',
      nome: 'Coroa',
      valor_sem_nota: [],
      valor_com_nota: [],
      valor_unicid: [],
      valor_pinheros: [],
      created_at: now,
      updated_at: now,
    });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({
          logradouro: 'Rua Central',
          bairro: 'Centro',
        }),
      })
    );

    const result = await getEntradasServicos([
      { idEntrada: 'entrada-1', idServicoEntrada: ['service-entry-1'] },
    ]);

    expect(result).toEqual([
      {
        id: 'entrada-1',
        consultorio: 'Central',
        cep: '09078-580',
        endereco: 'Rua Central',
        complemento: '',
        numero: '12',
        bairro: 'Centro',
        dentista: 'Dra. Ana',
        paciente: 'Maria Silva',
        servicos: [{ id: 'servico-1', nome: 'Coroa' }],
      },
    ]);
    expect(fetch).toHaveBeenCalledWith('https://viacep.com.br/ws/09078580/json/');
  });

  it('does not query the database when no entries are supplied', async () => {
    await expect(getEntradasServicos(undefined)).resolves.toBeUndefined();
    expect(prisma.entrada.findMany).not.toHaveBeenCalled();
  });
});

describe('updateEntradas', () => {
  it('clears route and delivery associations when updating a route', async () => {
    await updateEntradas({ idRoteiro: 'roteiro-1', type: 'update' });

    expect(prisma.entrada.updateMany).toHaveBeenCalledWith({
      where: { servicos: { some: { roteiro: 'roteiro-1' } } },
      data: {
        servicos: {
          updateMany: {
            where: { roteiro: 'roteiro-1' },
            data: { roteiro: null, entregue: null },
          },
        },
      },
    });
  });

  it('also clears closeout associations when deleting a route', async () => {
    await updateEntradas({ idRoteiro: 'roteiro-1', type: 'delete' });

    expect(prisma.entrada.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          servicos: {
            updateMany: {
              where: { roteiro: 'roteiro-1' },
              data: { roteiro: null, entregue: null, fechamento: null },
            },
          },
        },
      })
    );
  });

  it('returns an error when route associations cannot be updated', async () => {
    vi.mocked(prisma.entrada.updateMany).mockRejectedValue(
      new Error('Database unavailable')
    );
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(
      updateEntradas({ idRoteiro: 'roteiro-1', type: 'delete' })
    ).resolves.toEqual({ error: 'Erro ao atualizar roteiro' });
    expect(consoleError).toHaveBeenCalledOnce();
  });
});
