import { iFechamentoEntradaServico } from '@/models/fechamento';
import { currencyFormatter } from '@/lib/utils/currencyFormatter';

interface iFechamentoServicoRowProps {
  servico: iFechamentoEntradaServico;
}

export const ServicoRow = ({ servico }: iFechamentoServicoRowProps) => {
  const repeticao = servico.repeticao > 0 ? `${servico.repeticao}%` : '------';
  const desconto =
    servico.desconto > 0
      ? `-${currencyFormatter.format(servico.desconto / 100)}`
      : '------';

  return (
    <div className="mb-3 rounded-lg bg-gray-50 px-4 py-2">
      <div className="grid grid-cols-7 gap-3 text-xs wrap-break-word">
        <div>
          <span className="block text-gray-400">Data</span>
          <span className="text-gray-600">{servico.data}</span>
        </div>
        <div>
          <span className="block text-gray-400">Serviço</span>
          <span className="text-gray-600">{servico.nome}</span>
        </div>
        <div>
          <span className="block text-gray-400">Quantidade</span>
          <span className="text-gray-600">{servico.quantidade}</span>
        </div>
        <div>
          <span className="block text-gray-400">Valor</span>
          <span className="text-gray-600">
            {currencyFormatter.format(servico.valor / 100)}
          </span>
        </div>
        <div>
          <span className="block text-gray-400">Repetição</span>
          <span className="text-gray-600">{repeticao}</span>
        </div>
        <div>
          <span className="block text-gray-400">Desconto</span>
          <span className="text-gray-500">{desconto}</span>
        </div>
        <div>
          <span className="block text-gray-400">Subtotal</span>
          <span className="font-medium text-gray-700">
            {currencyFormatter.format(servico.total)}
          </span>
        </div>
      </div>
    </div>
  );
};
