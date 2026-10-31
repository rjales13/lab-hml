'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { roteiroFormSchema, tRoteiroFormData } from './form-schema';
import { Navigation } from '@/components/navigation';
import { screenNavigation } from './screen-navigation';
import { SectionOne } from './form-section-one';
import { SectionTwo } from './form-section-two';
import { remove } from '@/app/actions';
import {
  getEntradas,
  getEntradasServicos,
  saveRoteiro,
  updateEntradas,
} from '../actions';
import { useMutation } from '@/hooks/mutation';
import { SUCCESS_MESSAGES } from '@/lib/messages/success';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TABS } from './tabs-trigger';
import { useCallback, useState } from 'react';
import { Entradas } from './entradas';
import { useQuery } from '@tanstack/react-query';
import { PdfRoteiro } from '@/components/pdf-roteiro';
import { pdf } from '@react-pdf/renderer';
import { iPdfRoteiroItems, iPdfRoteiroProps } from '@/models/pdf-roteiro';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { ERROR_MESSAGES } from '@/lib/messages/errors';
import { BreadCrumb } from '@/components/breadcrumb';
import { iRoteiroEntradas } from '@/models/roteiro-entradas';

export const Form = (data: Partial<tRoteiroFormData>) => {
  const [activeTab, setActiveTab] = useState('dados');
  const [newEntradas, setNewEntradas] = useState<iRoteiroEntradas[]>([]);
  const [entregue, setEntregue] = useState<boolean>(data.entregue || false);

  const methods = useForm<tRoteiroFormData>({
    resolver: zodResolver(roteiroFormSchema),
    defaultValues: {
      id: data.id || '',
      data: data.data || '',
      entregue: data.entregue || false,
      observacao: data.observacao || '',
    },
  });

  const { handleMutation } = useMutation();

  const handleSubmit = async (data: tRoteiroFormData) => {
    const msg = data.id
      ? SUCCESS_MESSAGES.editado
      : SUCCESS_MESSAGES.adicionado;
    await handleMutation({
      mutationFn: () => saveRoteiro({ ...data, entregue }, newEntradas),
      redirectPath: 'roteiro',
      successMessage: msg,
    });
  };

  const handleDelete = async () => {
    const { id = '' } = data;
    await updateEntradas({ idRoteiro: id, type: 'delete' });
    await handleMutation({
      mutationFn: () => remove({ id, modelKey: 'roteiro' }),
      redirectPath: 'roteiro',
      successMessage: SUCCESS_MESSAGES.deletado,
    });
  };

  const { data: entradaData = [], isLoading: isLoadingEntrada } = useQuery({
    queryKey: ['entrada'],
    queryFn: async () => {
      const result = await getEntradas(data.id || '');
      if (result && !('error' in result)) {
        const initialCheckedItems = () =>
          result
            .map((entrada) => {
              const servicosIds = entrada.servicos
                .filter((servico) => servico.roteiro === data?.id)
                .map((servico) => servico.id);

              if (!servicosIds.length) return null;

              return {
                idEntrada: entrada.id,
                idServicoEntrada: servicosIds,
              };
            })
            .filter(Boolean) as iRoteiroEntradas[];
        setNewEntradas(initialCheckedItems);
        return result;
      }

      return [];
    },
  });

  const handleSaveEntradas = useCallback((entradas: iRoteiroEntradas[]) => {
    setNewEntradas(entradas);
  }, []);

  const handleEntregue = useCallback(() => {
    setEntregue((prev) => !prev);
  }, []);

  const { refetch: refetchEntradasServicos, isLoading: isLoadingPrint } =
    useQuery({
      queryKey: ['entradasServicos', newEntradas],
      queryFn: async () => await getEntradasServicos(newEntradas),
      enabled: false,
    });

  const dataWatch = useWatch({
    control: methods.control,
    name: 'data',
  });

  const observacaoWatch = useWatch({
    control: methods.control,
    name: 'observacao',
  });

  const handlePrint = useCallback(async () => {
    if (!newEntradas?.length) return;

    const { data } = await refetchEntradasServicos();
    if (!data || 'error' in data) {
      toast.error(ERROR_MESSAGES.errorPrintingPT);
      return;
    }

    const itensToPrint: iPdfRoteiroItems[] = data;
    const dataToPrint: iPdfRoteiroProps = {
      data: format(parseISO(dataWatch), 'dd/MM/yyyy'),
      items: itensToPrint,
      observacao: observacaoWatch,
    };
    const blob = await pdf(<PdfRoteiro blocksData={dataToPrint} />).toBlob();
    const pdfUrl = URL.createObjectURL(blob);

    window.open(pdfUrl, '_blank');

    setTimeout(() => URL.revokeObjectURL(pdfUrl), 10000);
  }, [newEntradas, refetchEntradasServicos, dataWatch, observacaoWatch]);

  return (
    <FormProvider {...methods}>
      <BreadCrumb />
      <form
        onSubmit={methods.handleSubmit(handleSubmit)}
        className="mt-20 w-full space-y-6 rounded-md border border-gray-200 bg-white p-8 shadow-xl backdrop-blur-md"
      >
        <Navigation
          id={data.id}
          navigation={screenNavigation}
          disabled={methods.formState.isSubmitting}
          isMainTab={activeTab === 'dados'}
          onDelete={handleDelete}
        />
        <Tabs defaultValue="dados" onValueChange={setActiveTab}>
          <TabsList className="mx-auto mb-8 flex h-12 gap-3 bg-transparent lg:gap-4">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="text-md cursor-pointer rounded-md border border-gray-200 bg-white p-2 hover:shadow-xl hover:backdrop-blur-md data-[state=active]:bg-gray-100 data-[state=active]:shadow-xl data-[state=active]:backdrop-blur-md lg:p-4"
                >
                  <Icon className="text-blue-400" />
                  <span className="hidden lg:block">{tab.description}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
          <TabsContent value="dados" className="flex flex-col gap-6">
            <div className="mx-auto w-full md:max-w-xs">
              <SectionOne />
            </div>
            <div className="grid grid-cols-1">
              <SectionTwo />
            </div>
          </TabsContent>
          <TabsContent value="entradas" className="flex flex-col gap-6">
            <Entradas
              key={newEntradas.length}
              itens={entradaData}
              itensSaved={newEntradas}
              isLoading={isLoadingEntrada}
              isLoadingPrint={isLoadingPrint}
              entregue={entregue}
              handleOnEntregue={handleEntregue}
              handleOnSaveEntradas={handleSaveEntradas}
              handleOnPrint={handlePrint}
            />
          </TabsContent>
        </Tabs>
      </form>
    </FormProvider>
  );
};
