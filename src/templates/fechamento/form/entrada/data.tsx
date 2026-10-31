import { iFechamentoEntradaItem } from '@/models/fechamento';
import { Card } from './card';
import { currencyFormatter } from '@/lib/utils/currencyFormatter';

interface iFechamentoEntradaDataSectionProps {
  nome: string;
  itens: iFechamentoEntradaItem[];
}

export const FechamentoEntradaDataSection = ({
  nome,
  itens,
}: iFechamentoEntradaDataSectionProps) => {
  const sumEntradas = itens.reduce((sum, item) => sum + item.sumEntrada, 0);
  return (
    <div className="mb-8">
      {/* Dentista Header */}
      <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-2">
        <h3 className="text-base font-medium text-gray-700">{nome}</h3>
        <span className="text-sm font-semibold text-gray-900">
          {currencyFormatter.format(sumEntradas)}
        </span>
      </div>

      {/* Entradas List */}
      <div className="space-y-4">
        {itens.map((item) => (
          <Card key={item.id} itens={item} />
        ))}
      </div>
    </div>
  );
};
