import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '@/lib/prisma';
import { getDashboardMetrics } from './actions';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    entrada: { findMany: vi.fn() },
    roteiro: { findMany: vi.fn() },
    fechamento: { findFirst: vi.fn() },
  },
}));

type Entry = Awaited<ReturnType<typeof prisma.entrada.findMany>>[number];
type EntryService = Entry['servicos'][number];
type Route = Awaited<ReturnType<typeof prisma.roteiro.findMany>>[number];
type Closeout = NonNullable<
  Awaited<ReturnType<typeof prisma.fechamento.findFirst>>
>;

function makeService(overrides: Partial<EntryService> = {}): EntryService {
  return {
    idServicoEntrada: 'service-entry-id',
    servico: 'service-id',
    valor: 1000,
    desconto: 0,
    quantidade: 1,
    repeticao: 0,
    funcionario: 'employee-id',
    data_entrada: new Date('2026-07-01T12:00:00Z'),
    data_previsao: new Date('2026-07-20T12:00:00Z'),
    data_saida: null,
    roteiro: null,
    entregue: null,
    fechamento: null,
    ...overrides,
  };
}

function makeEntry(
  createdAt: Date,
  servicos: EntryService[] = []
): Entry {
  return {
    id: 'entry-id',
    consultorio: 'office-id',
    dentista: 'dentist-id',
    paciente: 'Maria Silva',
    observacao: null,
    servicos,
    created_at: createdAt,
    updated_at: createdAt,
  };
}

const routes: Route[] = [
  {
    id: 'route-1',
    data: '2026-07-01',
    entregue: true,
    observacao: null,
    created_at: new Date('2026-07-01T12:00:00Z'),
    updated_at: new Date('2026-07-01T12:00:00Z'),
  },
  {
    id: 'route-2',
    data: '2026-07-02',
    entregue: false,
    observacao: null,
    created_at: new Date('2026-07-02T12:00:00Z'),
    updated_at: new Date('2026-07-02T12:00:00Z'),
  },
];

const closeout: Closeout = {
  id: 'closeout-id',
  fechado: true,
  data: new Date('2026-07-10T12:00:00Z'),
  adicional_consultorio: [
    { idConsultorio: 'office-id', desconto: [100, 50], observacao: null },
  ],
  adicional_dentista: [
    { idDentista: 'dentist-id', desconto: [200], observacao: null },
  ],
  valor: 10000,
  observacao: null,
  created_at: new Date('2026-07-10T12:00:00Z'),
  updated_at: new Date('2026-07-10T12:00:00Z'),
};

describe('getDashboardMetrics', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-14T12:00:00-03:00'));
    vi.mocked(prisma.entrada.findMany).mockResolvedValue([
      makeEntry(new Date('2026-07-02T12:00:00-03:00'), [
        makeService({
          data_previsao: new Date('2026-07-13T12:00:00-03:00'),
        }),
        makeService(),
        makeService({
          data_saida: new Date('2026-07-10T12:00:00-03:00'),
          roteiro: null,
          entregue: true,
          valor: 1000,
          quantidade: 2,
          repeticao: 10,
          desconto: 50,
        }),
        makeService({
          data_saida: new Date('2026-07-11T12:00:00-03:00'),
          roteiro: 'route-id',
          entregue: false,
        }),
      ]),
      makeEntry(new Date('2026-06-30T12:00:00-03:00')),
    ]);
    vi.mocked(prisma.roteiro.findMany).mockResolvedValue(routes);
    vi.mocked(prisma.fechamento.findFirst).mockResolvedValue(closeout);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calculates period, production, delivery, and closeout metrics', async () => {
    const result = await getDashboardMetrics({ month: 7, year: 2026 });

    expect(result).toMatchObject({
      entrada: {
        hoje: 1,
        emProducao: 2,
        atrasados: 1,
        aguardandoRoteiro: 2,
      },
      roteiro: { total: 2, entregues: 1, pendentes: 1 },
      fechamento: {
        potencialValor: 1750,
        potencialCount: 1,
        ultimoValor: 9996.5,
      },
      periodLabel: 'Julho 2026',
      lastUpdated: '2026-07-14T15:00:00.000Z',
    });
    expect(prisma.roteiro.findMany).toHaveBeenCalledWith({
      where: { data: { startsWith: '2026-07' } },
    });
    expect(prisma.fechamento.findFirst).toHaveBeenCalledWith({
      where: { fechado: true },
      orderBy: { data: 'desc' },
    });
  });

  it('returns zero closeout value when no completed closeout exists', async () => {
    vi.mocked(prisma.fechamento.findFirst).mockResolvedValue(null);

    const result = await getDashboardMetrics({ month: 7, year: 2026 });

    expect(result).toMatchObject({
      fechamento: {
        potencialValor: 1750,
        potencialCount: 1,
        ultimoValor: 0,
      },
    });
  });

  it('returns the dashboard error response when a data query fails', async () => {
    vi.mocked(prisma.entrada.findMany).mockRejectedValue(
      new Error('Database unavailable')
    );
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(getDashboardMetrics({ month: 7, year: 2026 })).resolves.toEqual({
      error: 'Erro ao carregar métricas do dashboard',
    });
    expect(consoleError).toHaveBeenCalledOnce();
    expect(prisma.roteiro.findMany).not.toHaveBeenCalled();
  });
});
