import { iFechamentoEntradaItem } from '@/models/fechamento';
import { ServicoRow } from './servico';
import Link from 'next/link';
import { currencyFormatter } from '@/lib/utils/currencyFormatter';

interface iFechamentoEntradaCardProps {
  itens: iFechamentoEntradaItem;
}

export const Card = ({ itens }: iFechamentoEntradaCardProps) => {
  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {/* Entrada Header */}
      <div className="mx-3 my-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400">Entrada:</span>
          <Link href={`../../../entrada/form/${itens.id}`} target="_blank">
            <span className="font-mono text-xs text-gray-500 underline">
              {itens.id.slice(-6)}
            </span>
          </Link>
          {itens.paciente && (
            <>
              <span className="text-gray-300">|</span>
              <span className="text-xs text-gray-400">Paciente:</span>
              <span className="text-xs text-gray-600">{itens.paciente}</span>
            </>
          )}
        </div>
        <span className="text-sm font-medium text-gray-700">
          {currencyFormatter.format(itens.sumEntrada)}
        </span>
      </div>
      <div className="space-y-2">
        {itens.servicos.map((servico) => (
          <ServicoRow key={servico.id} servico={servico} />
        ))}
      </div>
    </div>
  );
};
