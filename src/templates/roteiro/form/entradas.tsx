import { Button } from '@/components/ui/button';
import { Item, ItemContent } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarIcon, CheckCheck, Printer, Undo, Wrench } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { iRoteiroEntradas } from '@/models/roteiro-entradas';
import { EmptyData } from '@/components/empty-data';

interface iServicoItens {
  id: string;
  nome: string;
  roteiro: string | undefined | null;
  fechamento: string | undefined | null;
}

interface iItens {
  id: string;
  consultorio: string;
  dentista: string;
  paciente: string;
  servicos: iServicoItens[];
}

interface iSelectedCheckboxProx {
  idEntrada: string;
  idServico: string;
  checked: boolean;
}

interface iEntradaProps {
  itens: iItens[];
  itensSaved: iRoteiroEntradas[];
  isLoading?: boolean;
  isLoadingPrint?: boolean;
  entregue: boolean;
  handleOnSaveEntradas: (entradas: iRoteiroEntradas[]) => void;
  handleOnPrint: () => void;
  handleOnEntregue: () => void;
}

export const Entradas = ({
  itens,
  itensSaved,
  isLoading,
  isLoadingPrint,
  entregue,
  handleOnSaveEntradas,
  handleOnPrint,
  handleOnEntregue,
}: iEntradaProps) => {
  const [groupedCheckedItems, setGroupedCheckedItems] =
    useState<iRoteiroEntradas[]>(itensSaved);

  const isServiceChecked = (entradaId: string, servicoId: string) => {
    return groupedCheckedItems.some(
      (group) =>
        group.idEntrada === entradaId &&
        group.idServicoEntrada.includes(servicoId)
    );
  };

  const handleCheckboxChange = useCallback(
    ({ idEntrada, idServico, checked }: iSelectedCheckboxProx) => {
      setGroupedCheckedItems((prev) => {
        // Find if this idEntrada already exists
        const existingGroupIndex = prev.findIndex(
          (item) => item.idEntrada === idEntrada
        );

        if (checked) {
          // Adding a service
          if (existingGroupIndex >= 0) {
            // Update existing group
            const updated = [...prev];
            const existingServices =
              updated[existingGroupIndex].idServicoEntrada;

            // Only add if not already present
            if (!existingServices.includes(idServico)) {
              updated[existingGroupIndex] = {
                ...updated[existingGroupIndex],
                idServicoEntrada: [...existingServices, idServico],
              };
            }
            return updated;
          } else {
            // Create new group
            return [
              ...prev,
              {
                idEntrada,
                idServicoEntrada: [idServico],
              },
            ];
          }
        } else {
          // Removing a service
          if (existingGroupIndex >= 0) {
            const updated = [...prev];
            const filteredServices = updated[
              existingGroupIndex
            ].idServicoEntrada.filter((id) => id !== idServico);

            if (filteredServices.length === 0) {
              // Remove the entire group if no services left
              return prev.filter((_, index) => index !== existingGroupIndex);
            } else {
              // Update with filtered services
              updated[existingGroupIndex] = {
                ...updated[existingGroupIndex],
                idServicoEntrada: filteredServices,
              };
              return updated;
            }
          }
          return prev;
        }
      });
    },
    []
  );

  useEffect(() => {
    handleOnSaveEntradas(groupedCheckedItems);
  }, [groupedCheckedItems, handleOnSaveEntradas]);

  if (isLoading) return <Skeleton className="h-40 w-full rounded-md" />;

  return (
    <div className="flex w-full flex-col gap-6 md:px-20">
      <div className="flex w-full justify-end gap-2">
        <Button
          type="button"
          className={cn(
            'h-10 w-11 cursor-pointer transition-shadow duration-300 hover:bg-gray-200',
            entregue ? 'text-blue-600' : 'text-green-600'
          )}
          variant="outline"
          size="sm"
          disabled={!groupedCheckedItems.length}
          onClick={handleOnEntregue}
          title={
            entregue
              ? 'Clique para remover entrega'
              : 'Clique para confirmar entrega'
          }
        >
          {entregue ? <Undo /> : <CheckCheck />}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-10 w-auto cursor-pointer border-2 text-blue-950 transition-shadow duration-300 hover:bg-gray-50"
          disabled={!groupedCheckedItems.length || isLoadingPrint}
          onClick={handleOnPrint}
          title="imprimir"
        >
          <Printer />
        </Button>
      </div>

      {!itens.length ? (
        <EmptyData />
      ) : (
        itens.map(({ id, consultorio, dentista, paciente, servicos }) => {
          return (
            <Item key={id} variant="outline">
              <ItemContent>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {/* Left Column - Main Info */}
                  <div className="space-y-3">
                    {/* Header with icons */}
                    <div className="flex items-center gap-2 border-b pb-2">
                      <CalendarIcon className="text-primary h-5 w-5" />
                      <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                        Entrada:{' '}
                        <Link
                          href={`../../entrada/form/${id}`}
                          className="text-blue-600 hover:underline"
                          target="_blank"
                        >
                          <strong>{id}</strong>
                        </Link>
                      </span>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground text-xs">
                          Consultório
                        </span>
                        <p className="font-medium">{consultorio ?? '—'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">
                          Dentista
                        </span>
                        <p className="font-medium">{dentista ?? '—'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">
                          Paciente
                        </span>
                        <p className="font-medium">{paciente ?? '—'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Serviços */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b pb-2">
                      <Wrench className="text-primary h-5 w-5" />
                      <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                        Serviços Disponíveis
                      </span>
                      {servicos?.length > 0 && (
                        <span className="bg-primary/10 text-primary ml-auto rounded-full px-2 py-0.5 text-xs font-semibold">
                          {servicos.length}{' '}
                          {servicos.length === 1 ? 'item' : 'itens'}
                        </span>
                      )}
                    </div>
                    {servicos && servicos.length > 0 ? (
                      <div className="max-h-48 space-y-2 overflow-y-auto pr-2">
                        {servicos.map((servico) => (
                          <div
                            key={servico.id}
                            className="bg-card hover:bg-accent/50 flex items-center justify-start gap-2 rounded-lg border p-2 text-sm"
                          >
                            <Checkbox
                              id={servico.id}
                              disabled={!!servico.fechamento}
                              className="cursor-pointer"
                              checked={isServiceChecked(id, servico.id)}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange({
                                  idEntrada: id,
                                  idServico: servico.id,
                                  checked: checked as boolean,
                                })
                              }
                            />
                            <div className="flex items-center gap-2">
                              <span>{servico.nome}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center">
                        <p className="text-muted-foreground mt-1 text-sm">
                          Nenhum serviço cadastrado
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </ItemContent>
            </Item>
          );
        })
      )}
    </div>
  );
};
