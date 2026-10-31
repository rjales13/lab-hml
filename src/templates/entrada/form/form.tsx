'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { entradaFormSchema, tEntradaFormData } from './form-schema';
import { Navigation } from '@/components/navigation';
import { screenNavigation } from './screen-navigation';
import { SectionOne } from './form-section-one';
import { SectionTwo } from './form-section-two';
import { getAll, remove } from '@/app/actions';
import {
  getDentistasByConsultorio,
  getServicos,
  getValoresType,
  saveEntrada,
  saveValoresType,
} from '../actions';
import { useMutation } from '@/hooks/mutation';
import { SUCCESS_MESSAGES } from '@/lib/messages/success';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TABS } from './tabs-trigger';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { Servicos } from './servicos';
import { PdfEntradas } from '@/components/pdf-entradas';
import { pdf } from '@react-pdf/renderer';
import { iPdfEntradasItens, iPdfEntradasProps } from '@/models/pdf-entradas';
import { BreadCrumb } from '@/components/breadcrumb';
import { toast } from 'sonner';
import { ScrollToTop } from '@/components/scroll-to-top';
import { ConfirmationDialog } from '@/components/confirmation-dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export const Form = (data: Partial<tEntradaFormData>) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [valoresType, setValoresType] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState('dados');
  const [selectedConsultorio, setSelectedConsultorio] = useState<string>(
    data.consultorio || ''
  );
  const [selectedDentista, setSelectedDentista] = useState<string>(
    data.dentista || ''
  );

  const methods = useForm<tEntradaFormData>({
    resolver: zodResolver(entradaFormSchema),
    defaultValues: {
      id: data.id || '',
      consultorio: data.consultorio || '',
      dentista: data.dentista || '',
      paciente: data.paciente || '',
      observacao: data.observacao || '',
      servicos: data.servicos || [],
    },
  });

  /*
  const handleError = (errors: any) => {
    console.log('Zod validation errors:', errors);
  };
  */

  const { handleMutation } = useMutation();

  const handleSubmit = async (data: tEntradaFormData) => {
    const msg = data.id
      ? SUCCESS_MESSAGES.editado
      : SUCCESS_MESSAGES.adicionado;
    if (valoresData !== valoresType) {
      await handleMutation({
        mutationFn: () =>
          saveValoresType(data.consultorio, data.dentista, valoresType),
        successMessage: msg,
      });
    }
    await handleMutation({
      mutationFn: () => saveEntrada(data),
      redirectPath: 'entrada',
      successMessage: msg,
    });
  };

  const handleDelete = async () => {
    const { id = '' } = data;
    await handleMutation({
      mutationFn: () => remove({ id, modelKey: 'entrada' }),
      redirectPath: 'entrada',
      successMessage: SUCCESS_MESSAGES.deletado,
    });
  };

  const handleSaveServicos = (servicos: tEntradaFormData['servicos']) => {
    methods.setValue('servicos', servicos);
  };

  const handlePrint = async (entradas: iPdfEntradasItens[]) => {
    if (!selectedConsultorio || !selectedDentista || !pacienteWatch) {
      toast.error(
        'Selecione o consultório, dentista e paciente para imprimir a(s) entrada(s).'
      );
      return;
    }

    const itensToPrint: iPdfEntradasProps[] = entradas.map((item) => {
      return {
        id: data.id!,
        consultorio: consultorioData.find(
          (consultorio) => consultorio.id === selectedConsultorio
        )!.value,
        dentista: dentistaData.find(
          (dentista) => dentista.id === selectedDentista
        )!.value,
        funcionario: item.funcionario,
        servico: item.servico,
        paciente: pacienteWatch,
      };
    });
    const blob = await pdf(<PdfEntradas blocksData={itensToPrint} />).toBlob();
    const pdfUrl = URL.createObjectURL(blob);

    window.open(pdfUrl, '_blank');

    setTimeout(() => URL.revokeObjectURL(pdfUrl), 10000);
  };

  const handleValores = () => {
    if (!selectedDentista) {
      toast.error(
        'Selecione um dentista para atualizar os valores dos serviços.'
      );
      return;
    }
    if (!isLoadingValoresData) setIsDialogOpen(true);
  };

  const handleValoresChange = useCallback((value: string) => {
    setValoresType(value);
    setIsDialogOpen(false);
  }, []);

  const handleValoresItens = () => {
    const updatedServicos = servicosWatch.map((item) => {
      const servico = servicoData.find((s) => s.id === item.servico);
      if (servico) {
        return {
          ...item,
          valor: servico.valor,
        };
      }
      return item;
    });
    methods.setValue('servicos', updatedServicos);
    setRefreshKey((prev) => prev + 1);
  };

  const { data: consultorioData = [], isLoading: isLoadingConsultorio } =
    useQuery({
      queryKey: ['consultorio'],
      queryFn: async () =>
        await getAll({
          modelKey: 'consultorio',
          fields: ['nome'] as const,
          listSheet: true,
        }),
    });

  const { data: servicoData = [], isLoading: isLoadingServico } = useQuery({
    queryKey: ['servico', { valoresType }],
    queryFn: async () => await getServicos(valoresType),
  });

  const { data: funcionarioData = [], isLoading: isLoadingFuncionario } =
    useQuery({
      queryKey: ['funcionario'],
      queryFn: async () =>
        await getAll({
          modelKey: 'funcionario',
          fields: ['nome'] as const,
          listSheet: true,
        }),
    });

  const { data: dentistaData = [], isLoading: isLoadingDentista } = useQuery({
    queryKey: ['dentista', { selectedConsultorio }],
    queryFn: async () =>
      await getDentistasByConsultorio(String(selectedConsultorio)),
    enabled: !!selectedConsultorio,
  });

  const { data: valoresData = '', isLoading: isLoadingValoresData } = useQuery({
    queryKey: ['valores', { selectedDentista }],
    queryFn: async () => {
      const result = await getValoresType(
        String(selectedConsultorio),
        String(selectedDentista)
      );
      if (!result) setIsDialogOpen(true);
      setValoresType(result || 'sem-nota');
      return result;
    },
    enabled: !!selectedDentista,
  });

  const servicosWatch = useWatch({
    control: methods.control,
    name: 'servicos',
  });

  const pacienteWatch = useWatch({
    control: methods.control,
    name: 'paciente',
  });

  return (
    <>
      <ConfirmationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Valores dos serviços"
        description="Escolha os valores a serem usados para os serviços desta entrada."
        cancelText="Fechar"
      >
        <RadioGroup
          defaultValue={valoresType}
          className="mt-4 grid w-full grid-cols-2 gap-4"
          onValueChange={handleValoresChange}
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem
              value="sem-nota"
              id="sem-nota"
              className="cursor-pointer"
            />
            <Label htmlFor="sem-nota">Sem nota</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem
              value="com-nota"
              id="com-nota"
              className="cursor-pointer"
            />
            <Label htmlFor="com-nota">Com nota</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem
              value="unicid"
              id="unicid"
              className="cursor-pointer"
            />
            <Label htmlFor="unicid">Unicid</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem
              value="pinheros"
              id="pinheros"
              className="cursor-pointer"
            />
            <Label htmlFor="pinheros">Pinheiros</Label>
          </div>
        </RadioGroup>
      </ConfirmationDialog>

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
            onRefresh={handleValores}
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
                    disabled={
                      tab.value === 'servicos'
                        ? !selectedConsultorio || !selectedDentista
                        : false
                    }
                  >
                    <Icon className="text-blue-400" />
                    <span className="hidden lg:block">{tab.description}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <TabsContent value="dados" className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <SectionOne
                  consultorioData={consultorioData}
                  dentistaData={dentistaData}
                  isLoadingConsultorio={isLoadingConsultorio}
                  isLoadingDentista={isLoadingDentista}
                  consultorioId={selectedConsultorio}
                  dentistaId={selectedDentista}
                  handleConsultorioChange={setSelectedConsultorio}
                  handleDentistaChange={setSelectedDentista}
                />
              </div>
              <div className="grid grid-cols-1">
                <SectionTwo />
              </div>
            </TabsContent>
            <TabsContent value="servicos" className="flex flex-col gap-6">
              <Servicos
                key={refreshKey}
                itens={servicosWatch}
                servicoItens={servicoData}
                funcionarioItens={funcionarioData}
                isLoading={isLoadingServico || isLoadingFuncionario}
                handleOnSaveServicos={handleSaveServicos}
                handleOnPrint={handlePrint}
                handleOnValoresItens={handleValoresItens}
              />
            </TabsContent>
          </Tabs>
          <ScrollToTop />
        </form>
      </FormProvider>
    </>
  );
};
