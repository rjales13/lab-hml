'use server';

import { format, parseISO } from 'date-fns';
import { prisma } from '@/lib/prisma';

const SAO_PAULO_TIMEZONE = 'America/Sao_Paulo';
const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

function getSaoPauloDateKey(date: Date) {
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: SAO_PAULO_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return format(parseISO(formatter.format(date)), 'yyyy-MM-dd');
}

function getPeriodLabel(year: number, month: number) {
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

export async function getDashboardMetrics({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  const now = new Date();
  const todayStr = getSaoPauloDateKey(now);
  const selectedPeriod = `${year}-${String(month).padStart(2, '0')}`;

  try {
    // 1. Entrada Metrics
    const allEntradas = await prisma.entrada.findMany();

    let entradasHoje = 0;
    let emProducao = 0;
    let atrasados = 0;
    let aguardandoRoteiro = 0;
    let faturamentoAbertoValor = 0;
    let faturamentoAbertoCount = 0;

    allEntradas.forEach((entrada) => {
      const entradaMonth = getSaoPauloDateKey(entrada.created_at).slice(0, 7);
      const isSelectedPeriod = entradaMonth === selectedPeriod;

      if (isSelectedPeriod) {
        entradasHoje++;
      }

      entrada.servicos.forEach((servico) => {
        // Em produção (sem data de saída)
        if (!servico.data_saida) {
          emProducao++;

          // Atrasados (previsão < hoje em São Paulo e sem saída)
          const dataPrevisaoStr = getSaoPauloDateKey(servico.data_previsao);
          if (dataPrevisaoStr < todayStr) {
            atrasados++;
          }
        }

        // Aguardando Roteiro (tem saída mas não tem roteiro id ou não está entregue)
        if (servico.data_saida && (!servico.roteiro || !servico.entregue)) {
          aguardandoRoteiro++;
        }

        // Faturamento em aberto (entregue mas sem fechamento), sem filtro de mês
        if (servico.data_saida && servico.entregue && !servico.fechamento) {
          const valorComDesconto =
            Math.round(
              servico.valor * servico.quantidade * (1 - servico.repeticao / 100)
            ) - servico.desconto;

          faturamentoAbertoValor += valorComDesconto;
          faturamentoAbertoCount++;
        }
      });
    });

    // 2. Roteiro Metrics
    const roteiros = await prisma.roteiro.findMany({
      where: {
        data: {
          startsWith: selectedPeriod,
        },
      },
    });

    const roteirosDoDia = roteiros.length;
    const roteirosEntregues = roteiros.filter((r) => r.entregue).length;
    const roteirosPendentes = roteirosDoDia - roteirosEntregues;

    // 3. Ultimo Fechamento
    const ultimoFechamento = await prisma.fechamento.findFirst({
      where: { fechado: true },
      orderBy: { data: 'desc' },
    });

    let ultimoValorComDesconto = 0;

    if (ultimoFechamento) {
      const discountConsultorio = ultimoFechamento.adicional_consultorio.reduce(
        (total, item) =>
          total +
          item.desconto.reduce((subTotal, value) => subTotal + value, 0),
        0
      );

      const discountDentista = ultimoFechamento.adicional_dentista.reduce(
        (total, item) =>
          total +
          item.desconto.reduce((subTotal, value) => subTotal + value, 0),
        0
      );

      ultimoValorComDesconto =
        ultimoFechamento.valor - (discountConsultorio + discountDentista) / 100;
    }

    return {
      entrada: {
        hoje: entradasHoje,
        emProducao,
        atrasados,
        aguardandoRoteiro,
      },
      roteiro: {
        total: roteirosDoDia,
        entregues: roteirosEntregues,
        pendentes: roteirosPendentes,
      },
      fechamento: {
        potencialValor: faturamentoAbertoValor,
        potencialCount: faturamentoAbertoCount,
        ultimoValor: ultimoValorComDesconto,
      },
      periodLabel: getPeriodLabel(year, month),
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return {
      error: 'Erro ao carregar métricas do dashboard',
    };
  }
}
