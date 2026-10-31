import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Item, ItemActions, ItemContent } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { monetaryFormat } from '@/lib/utils/monetaryFormat';
import { iItensProps } from '@/models/itens';
import {
  Check,
  CheckCheck,
  CheckIcon,
  ChevronsUpDown,
  PackageCheck,
  Pencil,
  Plus,
  Printer,
  RefreshCw,
  Trash,
  Undo,
  Undo2,
} from 'lucide-react';
import { ChangeEvent, useCallback, useState } from 'react';
import cuid from 'cuid';
import { Checkbox } from '@/components/ui/checkbox';
import { iPdfEntradasItens } from '@/models/pdf-entradas';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { EmptyData } from '@/components/empty-data';
import { format, parseISO } from 'date-fns';
import { useAuth } from '@/contexts/user-contexts';

interface iServicoItens {
  id: string;
  value: string;
  valor: number;
}

interface iItens {
  idServicoEntrada: string;
  servico: string;
  quantidade: number;
  repeticao: number;
  valor: number;
  desconto: number;
  funcionario: string;
  data_previsao: Date;
  data_saida?: Date | null;
  roteiro?: string | null;
  entregue?: boolean | null;
  fechamento?: string | null;
}

interface iServicosProps {
  itens: iItens[];
  servicoItens: iServicoItens[];
  funcionarioItens: iItensProps[];
  isLoading?: boolean;
  handleOnSaveServicos: (servicos: iItens[]) => void;
  handleOnPrint: (entradas: iPdfEntradasItens[]) => void;
  handleOnValoresItens: () => void;
}

interface iSelectedCheckboxProx extends Omit<
  iItens,
  | 'repeticao'
  | 'valor'
  | 'desconto'
  | 'data_saida'
  | 'roteiro'
  | 'entregue'
  | 'fechamento'
> {
  idFuncionario: string;
  checked: boolean;
}

export const Servicos = ({
  itens,
  servicoItens,
  funcionarioItens,
  isLoading,
  handleOnSaveServicos,
  handleOnPrint,
  handleOnValoresItens,
}: iServicosProps) => {
  const { isAdmin } = useAuth();

  const [field, setField] = useState<iItens>({
    idServicoEntrada: '',
    servico: '',
    quantidade: 0,
    repeticao: 0,
    valor: 0,
    desconto: 0,
    funcionario: '',
    data_previsao: new Date(),
  });

  const [newItens, setNewItens] = useState<iItens[]>(itens);
  const [valorFormated, setValorFormated] = useState('');
  const [open, setOpen] = useState(false);
  const [openCBServico, setOpenCBServico] = useState(false);
  const [openCBFuncionario, setOpenCBFuncionario] = useState(false);
  const [checkedItens, setCheckedItens] = useState<
    Omit<iSelectedCheckboxProx, 'checked'>[]
  >([]);
  const [desconto, setDesconto] = useState('');

  const handleClose = () => {
    setField({
      idServicoEntrada: '',
      servico: '',
      quantidade: 0,
      repeticao: 0,
      valor: 0,
      desconto: 0,
      funcionario: '',
      data_previsao: new Date(),
    });
    setDesconto('');
    setOpen(false);
  };

  const handleServico = (id: string) => {
    const servicoSelecionado = servicoItens.find(
      ({ id: servicoId }) => servicoId === id
    )!;

    setValorFormated(monetaryFormat(String(servicoSelecionado.valor)));
    setOpenCBServico(false);

    setField({
      ...field,
      valor: servicoSelecionado.valor ?? 0,
      servico: id === field.servico ? '' : id,
    });
  };

  const handleFields = () => {
    return (
      !field.servico ||
      field.quantidade <= 0 ||
      field.repeticao < 0 ||
      field.desconto < 0 ||
      !field.valor ||
      !field.funcionario ||
      !field.data_previsao
    );
  };

  const handleFinish = (id: string) => {
    const fieldToFinish = newItens.findIndex(
      (item) => item.idServicoEntrada === id
    );

    const updatedItens = newItens.map((item, index) => {
      if (index === fieldToFinish) {
        return {
          ...item,
          data_saida: item.data_saida ? undefined : new Date(),
          roteiro: item.data_saida ? undefined : item.roteiro,
          entregue: item.data_saida ? undefined : item.entregue,
          fechamento: item.data_saida ? undefined : item.fechamento,
        };
      }
      return item;
    });

    setNewItens(updatedItens);
    handleOnSaveServicos(updatedItens);
  };

  const handleDelete = (id: string) => {
    const updatedItens = newItens.filter(
      (item) => item.idServicoEntrada !== id
    );
    setNewItens(updatedItens);
    handleUncheckAll();
  };

  const handleEdit = (itemToEdit: iItens) => {
    const { servico } = itemToEdit;
    const formatedDesconto = monetaryFormat(String(itemToEdit.desconto));
    handleServico(servico);
    setDesconto(formatedDesconto);
    setField(itemToEdit);
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!field.idServicoEntrada) {
      const uuid = cuid();
      const fieldData = { ...field, idServicoEntrada: uuid };
      setNewItens([fieldData, ...newItens]);
      handleOnSaveServicos([fieldData, ...newItens]);
      handleUncheckAll();
      handleClose();
      return;
    }

    const fieldToUpdateIndex = newItens.findIndex(
      (item) => item.idServicoEntrada === field.idServicoEntrada
    );

    const updatedItens = newItens.map((item, index) => {
      if (index === fieldToUpdateIndex) {
        return {
          ...item,
          servico: field.servico,
          quantidade: field.quantidade,
          repeticao: field.repeticao,
          valor: field.valor,
          desconto: field.desconto,
          funcionario: field.funcionario,
          data_previsao: field.data_previsao,
        };
      }
      return item;
    });

    setNewItens(updatedItens);
    handleOnSaveServicos(updatedItens);
    handleUncheckAll();
    handleClose();
  };

  const handleCheckboxChange = ({
    idServicoEntrada,
    servico,
    quantidade,
    funcionario,
    idFuncionario,
    checked,
    data_previsao,
  }: iSelectedCheckboxProx) => {
    if (checked) {
      setCheckedItens((prev) => [
        ...prev,
        {
          idServicoEntrada,
          servico,
          quantidade,
          funcionario,
          idFuncionario,
          data_previsao,
        },
      ]);
    } else {
      setCheckedItens((prev) =>
        prev.filter((v) => v.idServicoEntrada !== idServicoEntrada)
      );
    }
  };

  const handlePrint = async () => {
    const result = Array.from(
      checkedItens.reduce((map, item) => {
        if (!map.has(item.funcionario)) {
          map.set(item.funcionario, {
            funcionario: item.funcionario,
            servico: [],
          });
        }

        map.get(item.funcionario).servico.push({
          nome: item.servico,
          quantidade: item.quantidade,
          data_previsao: item.data_previsao,
        });

        return map;
      }, new Map())
    ).map(([, value]) => value);

    handleOnPrint(result);
  };

  const handleCheckAll = useCallback(() => {
    const allAvailableItens = newItens
      .filter(({ data_saida }) => !data_saida)
      .map(
        ({
          idServicoEntrada,
          servico,
          quantidade,
          funcionario,
          data_previsao,
        }) => {
          const servicoNome =
            servicoItens.find(({ id }) => id === servico)?.value || '';
          const funcionarioNome =
            funcionarioItens.find(({ id }) => id === funcionario)?.value || '';
          return {
            idServicoEntrada,
            servico: servicoNome,
            quantidade,
            funcionario: funcionarioNome,
            idFuncionario: funcionario,
            data_previsao,
          };
        }
      );

    setCheckedItens(allAvailableItens);
  }, [funcionarioItens, newItens, servicoItens]);

  const handleUncheckAll = useCallback(() => {
    setCheckedItens([]);
  }, []);

  const handleDesconto = (e: ChangeEvent<HTMLInputElement>) => {
    const onlyDigits = Number(e.target.value.replace(/\D/g, ''));
    const formatedDesconto = monetaryFormat(e.target.value);
    setDesconto(formatedDesconto);
    setField({ ...field, desconto: onlyDigits });
  };

  if (isLoading) return <Skeleton className="h-40 w-full rounded-md" />;
  const hasNoEntregue = newItens.some((item) => !item.entregue);

  return (
    <div className="flex w-full flex-col gap-6 md:px-20">
      <div className="flex w-full justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-10 w-auto cursor-pointer border-2 text-blue-950 transition-shadow duration-300 hover:bg-gray-50"
          disabled={!checkedItens.length}
          onClick={handleUncheckAll}
          title="desselecionar todos"
        >
          <Undo2 />
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-10 w-auto cursor-pointer border-2 text-blue-950 transition-shadow duration-300 hover:bg-gray-50"
          disabled={!newItens.length || !hasNoEntregue}
          onClick={handleCheckAll}
          title="selecionar todos"
        >
          <CheckIcon />
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-10 w-auto cursor-pointer border-2 text-blue-950 transition-shadow duration-300 hover:bg-gray-50"
          disabled={!checkedItens.length}
          onClick={handlePrint}
          title="imprimir"
        >
          <Printer />
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-10 w-auto cursor-pointer border-2 text-blue-950 transition-shadow duration-300 hover:bg-gray-50"
          onClick={handleOnValoresItens}
          title="atualizar valores"
          disabled={!newItens.length || !isAdmin}
        >
          <RefreshCw />
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-10 w-auto cursor-pointer border-2 text-blue-950 transition-shadow duration-300 hover:bg-gray-50"
          onClick={() => setOpen(true)}
          title="inserir novo registro"
        >
          <Plus />
        </Button>
      </div>

      {!newItens.length ? (
        <EmptyData />
      ) : (
        newItens.map(
          ({
            idServicoEntrada,
            servico,
            valor,
            desconto,
            quantidade,
            funcionario,
            repeticao,
            data_saida,
            data_previsao,
            entregue,
          }) => {
            const servicoNome = servicoItens.find(
              ({ id }) => id === servico
            )?.value;

            const funcionarioNome = funcionarioItens.find(
              ({ id }) => id === funcionario
            )?.value;

            return (
              <Item
                key={idServicoEntrada}
                variant={data_saida || entregue ? 'muted' : 'outline'}
              >
                <ItemContent>
                  <div className="flex w-full flex-col items-center gap-6 md:flex-row">
                    {!entregue ? (
                      <Checkbox
                        id={idServicoEntrada}
                        className="cursor-pointer"
                        disabled={!!data_saida}
                        checked={checkedItens.some(
                          (item) => item.idServicoEntrada === idServicoEntrada
                        )}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange({
                            idServicoEntrada,
                            servico: servicoNome || '',
                            quantidade,
                            funcionario: funcionarioNome || '',
                            idFuncionario: funcionario,
                            checked: checked as boolean,
                            data_previsao,
                          })
                        }
                      />
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <PackageCheck />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Entregue</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    <div className="max-w-1/2">
                      <div className="text-sm font-medium text-gray-900">
                        {servicoNome ?? '—'}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {funcionarioNome ?? '-'}
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 md:flex-row">
                      <Badge className="px-2 py-1" variant="secondary">
                        Quantidade: {quantidade}
                      </Badge>
                      <Badge className="px-2 py-1" variant="secondary">
                        Repetição: {repeticao}%
                      </Badge>
                      {isAdmin && (
                        <Badge className="px-2 py-1" variant="secondary">
                          Valor: {monetaryFormat(String(valor))}
                        </Badge>
                      )}
                      <Badge className="px-2 py-1" variant="secondary">
                        Desconto: {monetaryFormat(String(desconto))}
                      </Badge>
                      <Badge className="px-2 py-1" variant="secondary">
                        Previsão:{' '}
                        {format(
                          parseISO(data_previsao.toISOString().split('T')[0]),
                          'dd/MM/yyyy'
                        )}
                      </Badge>
                    </div>
                  </div>
                </ItemContent>
                {!entregue && (
                  <ItemActions className="m-auto">
                    <Button
                      type="button"
                      className={cn(
                        'cursor-pointer transition-shadow duration-300 hover:bg-gray-200',
                        data_saida ? 'text-blue-600' : 'text-green-600'
                      )}
                      variant="outline"
                      size="sm"
                      title={data_saida ? 'Remover Saída' : 'Aplicar Saída'}
                      onClick={() => handleFinish(idServicoEntrada!)}
                    >
                      {data_saida ? <Undo /> : <CheckCheck />}
                    </Button>
                    {!data_saida && (
                      <>
                        <Button
                          type="button"
                          className="cursor-pointer text-blue-950 transition-shadow duration-300 hover:bg-gray-200"
                          variant="outline"
                          size="sm"
                          title="Editar"
                          onClick={() =>
                            handleEdit({
                              idServicoEntrada,
                              servico,
                              quantidade,
                              repeticao,
                              valor,
                              desconto,
                              funcionario,
                              data_previsao,
                            })
                          }
                        >
                          <Pencil />
                        </Button>
                        <Button
                          type="button"
                          className="cursor-pointer text-red-600 transition-shadow duration-300 hover:bg-gray-200"
                          variant="outline"
                          size="sm"
                          title="Excluir"
                          onClick={() => handleDelete(idServicoEntrada!)}
                        >
                          <Trash />
                        </Button>
                      </>
                    )}
                  </ItemActions>
                )}
              </Item>
            );
          }
        )
      )}
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Adicionar Serviços</SheetTitle>
            <SheetDescription>
              Informe o os dados no campo abaixo
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-3 px-4">
            <Label htmlFor="servico-combobox" className="min-h-5 text-gray-700">
              Serviço
            </Label>
            <Popover open={openCBServico} onOpenChange={setOpenCBServico}>
              <PopoverTrigger asChild>
                <Button
                  id="servico-combobox"
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCBServico}
                  className={cn(
                    field.servico ? 'text-accent-foreground! font-normal' : '',
                    'text-muted-foreground h-10 cursor-pointer justify-between text-sm font-normal'
                  )}
                >
                  {field.servico
                    ? servicoItens.find(({ id }) => id === field.servico)?.value
                    : 'Clique aqui para buscar'}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                <Command>
                  <CommandInput placeholder="Filtrar..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>Não há registros!</CommandEmpty>
                    <CommandGroup>
                      {servicoItens.map(({ id, value }) => (
                        <CommandItem
                          key={id}
                          value={value}
                          onSelect={() => handleServico(id)}
                          className="cursor-pointer"
                        >
                          {value}
                          <Check
                            className={cn(
                              'ml-auto',
                              field.servico === id ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-3 px-4">
            <Label htmlFor="quantidade" className="min-h-5 text-gray-700">
              Quantidade
            </Label>
            <Input
              id="quantidade"
              type="text"
              placeholder="ex: 2"
              className="h-10 px-5"
              value={field.quantidade}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  setField({
                    ...field,
                    quantidade: value === '' ? 0 : Number(value),
                  });
                }
              }}
            />
          </div>
          <div className="flex flex-col gap-3 px-4">
            <Label htmlFor="repeticao" className="min-h-5 text-gray-700">
              Repetição %
            </Label>
            <Input
              id="repeticao"
              type="text"
              placeholder="ex: 50"
              className="h-10 px-5"
              value={field.repeticao}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  setField({
                    ...field,
                    repeticao: value === '' ? 0 : Number(value),
                  });
                }
              }}
            />
          </div>
          <div className="flex flex-col gap-3 px-4">
            <Label htmlFor="valor" className="min-h-5 text-gray-700">
              Valor
            </Label>
            <Input
              id="valor"
              type={isAdmin ? 'text' : 'password'}
              placeholder="Selecione um serviço para carregar o valor"
              className="h-10 px-5"
              value={
                field.valor
                  ? monetaryFormat(String(field.valor))
                  : field.servico && valorFormated
                    ? valorFormated
                    : ''
              }
              disabled={true}
            />
          </div>
          <div className="flex flex-col gap-3 px-4">
            <Label htmlFor="desconto" className="min-h-5 text-gray-700">
              Desconto
            </Label>
            <Input
              id="desconto"
              type="text"
              placeholder="ex: 20.00"
              className="h-10 px-5"
              value={desconto}
              onChange={handleDesconto}
            />
          </div>
          <div className="flex flex-col gap-3 px-4">
            <Label htmlFor="servico-combobox" className="min-h-5 text-gray-700">
              Funcionário
            </Label>
            <Popover
              open={openCBFuncionario}
              onOpenChange={setOpenCBFuncionario}
            >
              <PopoverTrigger asChild>
                <Button
                  id="funcionario-combobox"
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCBFuncionario}
                  className={cn(
                    field.funcionario
                      ? 'text-accent-foreground! font-normal'
                      : '',
                    'text-muted-foreground h-10 cursor-pointer justify-between text-sm font-normal'
                  )}
                >
                  {field.funcionario
                    ? funcionarioItens.find(
                        ({ id }) => id === field.funcionario
                      )?.value
                    : 'Clique aqui para buscar'}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                <Command>
                  <CommandInput placeholder="Filtrar..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>Não há registros!</CommandEmpty>
                    <CommandGroup>
                      {funcionarioItens.map(({ id, value }) => (
                        <CommandItem
                          key={id}
                          value={id}
                          onSelect={(currentValue) => {
                            setField({ ...field, funcionario: currentValue });
                            setOpenCBFuncionario(false);
                          }}
                          className="cursor-pointer"
                        >
                          {value}
                          <Check
                            className={cn(
                              'ml-auto',
                              field.funcionario === id
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-3 px-4">
            <Label htmlFor="desconto" className="min-h-5 text-gray-700">
              Data Previsão
            </Label>
            <Input
              id="data_previsao"
              type="date"
              placeholder="ex: 20.00"
              className="h-10 px-5"
              value={
                field.data_previsao
                  ? new Date(field.data_previsao).toISOString().split('T')[0]
                  : ''
              }
              onChange={(e) =>
                setField({ ...field, data_previsao: new Date(e.target.value) })
              }
            />
          </div>
          <SheetFooter>
            <Button
              type="button"
              className="cursor-pointer"
              disabled={handleFields()}
              onClick={handleSubmit}
            >
              Salvar
            </Button>
            <SheetClose asChild>
              <Button variant="outline" className="cursor-pointer">
                Fechar
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};
