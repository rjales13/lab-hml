import { AboutSection } from '@/components/about-section';
import { LayoutDashboard, ClipboardList, Truck } from 'lucide-react';
import { getDashboardMetrics } from './actions';
import { DashboardCard } from './dashboard-card';
import { Suspense } from 'react';
import { iUserRole, userRoles } from '@/models/user-role';
import { DashboardSkeleton } from './dashboard-skeleton';
import { iDashboardProps } from '@/models/dashboard';
import { MonthYearCombobox } from './month-year-combobox';
import Link from 'next/link';
import { currencyFormatter } from '@/lib/utils/currencyFormatter';

interface iHomeTemplateProps {
  userRole: iUserRole;
  selectedPeriod: {
    period: string;
    year: number;
    month: number;
  };
}

export const HomeTemplate = async ({
  userRole,
  selectedPeriod,
}: iHomeTemplateProps) => {
  const isAdmin = userRole.role === userRoles.ADMIN;

  return (
    <div className="space-y-8">
      <Suspense fallback={<DashboardSkeleton isAdmin={isAdmin} />}>
        <DashboardContent isAdmin={isAdmin} selectedPeriod={selectedPeriod} />
      </Suspense>
    </div>
  );
};

async function DashboardContent({
  isAdmin,
  selectedPeriod,
}: iDashboardProps & {
  selectedPeriod: {
    period: string;
    year: number;
    month: number;
  };
}) {
  const metrics = await getDashboardMetrics({
    month: selectedPeriod.month,
    year: selectedPeriod.year,
  });

  if ('error' in metrics) {
    return <div className="text-red-500">{metrics.error}</div>;
  }

  const lastUpdated = new Date(metrics.lastUpdated).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const roteiroProgress =
    metrics.roteiro.total > 0
      ? (metrics.roteiro.entregues / metrics.roteiro.total) * 100
      : 0;

  return (
    <>
      <AboutSection
        title="Dashboard"
        subtitle={`${metrics.periodLabel} • Última atualização: ${lastUpdated}`}
        icon={LayoutDashboard}
      />

      <Link href="/entrada" className="block no-underline">
        <section className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-5 text-slate-900 shadow-lg shadow-slate-900/5 backdrop-blur-md transition-transform duration-300 hover:-translate-y-0.5 md:p-6">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-slate-200 via-blue-400 to-slate-200" />
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="space-y-1">
                <p className="text-[10px] font-bold tracking-[0.28em] text-slate-500 uppercase">
                  Operação atual
                </p>
                <h2 className="text-2xl font-black tracking-tight md:text-3xl">
                  Serviços em Produção
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-slate-600">
                  Este bloco fica separado dos cards filtrados porque mostra o
                  que está aberto agora, em tempo real.
                </p>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:min-w-96 lg:grid-cols-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-black tracking-[0.24em] text-slate-500 uppercase">
                  Em produção
                </p>
                <p className="mt-1 text-3xl font-black text-slate-900 tabular-nums">
                  {metrics.entrada.emProducao}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <p className="text-[10px] font-black tracking-[0.24em] text-slate-500 uppercase">
                  Atrasados
                </p>
                <p className="mt-1 text-3xl font-black text-slate-900 tabular-nums">
                  {metrics.entrada.atrasados}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-black tracking-[0.24em] text-slate-500 uppercase">
                  Roteiro
                </p>
                <p className="mt-1 text-3xl font-black text-slate-900 tabular-nums">
                  {metrics.entrada.aguardandoRoteiro}
                </p>
              </div>

              {isAdmin && (
                <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm lg:col-span-2">
                  <p className="text-[10px] font-black tracking-[0.24em] text-slate-500 uppercase">
                    Faturamento em aberto
                  </p>
                  <p className="mt-1 text-2xl font-black text-slate-900 tabular-nums md:text-3xl">
                    {currencyFormatter.format(
                      metrics.fechamento.potencialValor / 100
                    )}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {metrics.fechamento.potencialCount} serviços prontos para
                    faturar
                  </p>
                  <p className="mt-2 border-t border-slate-200 pt-2 text-xs text-slate-600">
                    Último Fechamento:{' '}
                    <span className="font-bold text-slate-900 tabular-nums">
                      {currencyFormatter.format(metrics.fechamento.ultimoValor)}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </Link>

      <MonthYearCombobox
        selectedMonth={selectedPeriod.month}
        selectedYear={selectedPeriod.year}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* ENTRADA DO MES CARD */}
        <DashboardCard
          title="Entradas do Mês"
          icon={ClipboardList}
          value={metrics.entrada.hoje}
          subtitle="Total de entradas no período selecionado"
          variant="default"
          href="/entrada"
        >
          <div className="space-y-3">
            <div className="group flex cursor-default items-center justify-between transition-all">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                <span className="text-sm font-semibold text-slate-500">
                  Período
                </span>
              </div>
              <span className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-1 font-bold text-blue-700 shadow-sm transition-colors group-hover:bg-blue-100">
                {metrics.periodLabel}
              </span>
            </div>
          </div>
        </DashboardCard>

        {/* ROTEIRO CARD */}
        <DashboardCard
          title="Entregas do Mês"
          icon={Truck}
          value={metrics.roteiro.total}
          subtitle={`${metrics.roteiro.pendentes} saídas aguardando finalização`}
          variant={metrics.roteiro.pendentes > 0 ? 'warning' : 'success'}
          href="/roteiro"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black tracking-widest text-slate-500 uppercase">
                Progresso
              </span>
              <span className="rounded-md border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-xs font-black text-emerald-600 shadow-sm">
                {Math.round(roteiroProgress)}%
              </span>
            </div>
            <div className="relative h-4 w-full overflow-hidden rounded-full bg-slate-200/50 p-0.5 shadow-inner">
              <div
                className="h-full rounded-full bg-linear-to-r from-emerald-600 via-emerald-500 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)] transition-all duration-1000 ease-in-out"
                style={{ width: `${roteiroProgress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              <span className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
                {metrics.roteiro.entregues} Concluídas
              </span>
              <span className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                {metrics.roteiro.pendentes} Restantes
              </span>
            </div>
          </div>
        </DashboardCard>
      </div>
    </>
  );
}
