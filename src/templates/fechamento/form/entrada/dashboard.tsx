import { iFechamentoEntradaProps } from '@/models/fechamento';
import { FechamentoEntradaDataSection } from './data';
import { Separator } from '@/components/ui/separator';
import { Hospital, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';
import { currencyFormatter } from '@/lib/utils/currencyFormatter';

export const FechamentoEntradaDashboard = ({
  type,
  nome,
  itens,
  sumEntradas,
  desconto,
  observacao,
}: iFechamentoEntradaProps) => {
  let grouped: Record<string, typeof itens> = {};

  if (type === 'dentista') {
    // Group by consultorio
    grouped = itens.reduce((acc: Record<string, typeof itens>, item) => {
      const key = item.consultorio || 'Consultório não encontrado';
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});
  } else {
    // Group by dentista
    grouped = itens.reduce((acc: Record<string, typeof itens>, item) => {
      const key = item.dentista || 'Dentista não encontrado';
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});
  }

  return (
    <div className="px-6">
      {/* Header */}
      <div className="py-10">
        <div className="flex items-center gap-2">
          {type === 'dentista' ? <Stethoscope /> : <Hospital />}
          <h1 className="text-2xl font-bold text-gray-800">{nome}</h1>
        </div>
        <Separator />
      </div>
      <div>
        {Object.entries(grouped).map(([nome, itens]) => (
          <FechamentoEntradaDataSection key={nome} nome={nome} itens={itens} />
        ))}
      </div>
      <div className="flex items-baseline justify-between border-t border-gray-100 pt-3">
        <span className="text-xs font-bold tracking-wide text-gray-600 uppercase">
          Total geral
        </span>
        <span
          className={cn(
            !!desconto
              ? 'text-red-600 line-through'
              : 'text-xl font-semibold text-gray-800'
          )}
        >
          {currencyFormatter.format(sumEntradas)}
        </span>
      </div>
      {!!desconto && (
        <div className="flex items-baseline justify-between border-t border-gray-100 pt-3">
          <span className="text-xs font-bold tracking-wide text-gray-600 uppercase">
            Total com desconto(s)
          </span>
          <span className="text-xl font-semibold text-gray-800">
            {currencyFormatter.format(sumEntradas - desconto / 100)}
          </span>
        </div>
      )}
      {!!observacao && (
        <div className="flex flex-col gap-2 border-t border-gray-100 pt-10">
          <span className="text-md font-bold tracking-wide text-gray-600 uppercase">
            Observação
          </span>
          <span className="text-sm text-gray-800">{observacao}</span>
        </div>
      )}
    </div>
  );
};
