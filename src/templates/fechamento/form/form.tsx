'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TABS } from './tabs-trigger';
import { BreadCrumb } from '@/components/breadcrumb';
import { fechamentoType, iFechamentoEntradaProps } from '@/models/fechamento';
import { useMemo, useState } from 'react';
import { FechamentoEntradaDashboard } from './entrada/dashboard';
import { Navigation } from '@/components/navigation';
import { screenNavigation } from './screen-navigation';
import { iBreadCrumbItems } from '@/models/bread-crumb';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { fechamentoFormSchema, tFechamentoFormData } from './form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ListTabContent } from '@/components/list-tab-content';
import { SectionOne } from './form-section-one';
import { ScrollToTop } from '@/components/scroll-to-top';
import { useMutation } from '@/hooks/mutation';
import { SUCCESS_MESSAGES } from '@/lib/messages/success';
import { saveFechamento } from '../actions';
import { PdfFechamento } from '@/components/pdf-fechamento';
import { pdf } from '@react-pdf/renderer';

const basicItems: iBreadCrumbItems[] = [
  { name: 'Principal', isLink: true, link: '/' },
  { name: 'Painel', isLink: true, link: '../' },
  { name: 'Dados', isLink: false },
];

interface iFormProps {
  result: iFechamentoEntradaProps;
  idConsultorioDentista: string;
  fechamentoId: string | undefined;
  type: fechamentoType;
  data?: Partial<tFechamentoFormData> | null;
}

export const Form = ({
  result,
  idConsultorioDentista,
  fechamentoId,
  type,
  data,
}: iFormProps) => {
  const [activeTab, setActiveTab] = useState('dados');
  const { nome, itens, sumEntradas, fechamentoData } = result;
  const methods = useForm<tFechamentoFormData>({
    resolver: zodResolver(fechamentoFormSchema),
    defaultValues: {
      id: idConsultorioDentista,
      desconto: data?.desconto || [],
      observacao: data?.observacao || '',
    },
  });

  const newScreenNavigation = useMemo(() => {
    return fechamentoId
      ? screenNavigation
      : screenNavigation.filter(
          (nav) => nav.nav !== 'salvar' && nav.nav !== 'print'
        );
  }, [fechamentoId]);

  const observation = useWatch({
    control: methods.control,
    name: 'observacao',
  });

  const descontoWatch = useWatch({
    control: methods.control,
    name: 'desconto',
  });

  const discountItens = (descontoWatch ?? []).map((v) =>
    typeof v === 'number' ? v : Number(v.replace(/\D/g, ''))
  );

  const discount = discountItens.reduce<number>((acc, cur) => acc + cur, 0);

  const referenceDate = fechamentoData
    ?.toLocaleString('pt-BR', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    })
    .replace(' de ', '/')
    .replace(/^\w/, (c) => c.toUpperCase());

  const { handleMutation } = useMutation();

  const handleSubmit = async (data: tFechamentoFormData) => {
    const parsedData = {
      ...data,
      desconto: data.desconto.map((value) => {
        if (typeof value === 'number') return value;
        return Number(value.replace(/\D/g, ''));
      }),
    };

    const msg = data.id
      ? SUCCESS_MESSAGES.editado
      : SUCCESS_MESSAGES.adicionado;
    await handleMutation({
      mutationFn: () =>
        saveFechamento({ data: parsedData, type, fechamentoId: fechamentoId! }),
      successMessage: msg,
    });
  };

  const handlePrint = async () => {
    const blob = await pdf(
      <PdfFechamento
        type={type}
        nome={nome}
        itens={itens}
        sumEntradas={sumEntradas}
        desconto={discount}
        descontos={discountItens}
        observacao={observation}
        referenceDate={referenceDate || ''}
      />
    ).toBlob();

    const pdfUrl = URL.createObjectURL(blob);
    window.open(pdfUrl, '_blank');
    setTimeout(() => URL.revokeObjectURL(pdfUrl), 10000);
  };

  return (
    <FormProvider {...methods}>
      <BreadCrumb items={basicItems} />
      <form
        onSubmit={methods.handleSubmit(handleSubmit)}
        className="mt-20 w-full space-y-6 rounded-md border border-gray-200 bg-white p-8 shadow-xl backdrop-blur-md"
      >
        <Navigation
          navigation={newScreenNavigation}
          disabled={methods.formState.isSubmitting}
          isMainTab={activeTab === 'dados'}
          onPrint={handlePrint}
        />
        <Tabs defaultValue="dados" onValueChange={setActiveTab}>
          <TabsList className="mx-auto mb-8 flex h-12 gap-3 bg-transparent lg:gap-4">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  disabled={tab.value !== 'dados' && !fechamentoId}
                  className="text-md cursor-pointer rounded-md border border-gray-200 bg-white p-2 hover:shadow-xl hover:backdrop-blur-md data-[state=active]:bg-gray-100 data-[state=active]:shadow-xl data-[state=active]:backdrop-blur-md lg:p-4"
                >
                  <Icon className="text-blue-400" />
                  <span className="hidden lg:block">{tab.description}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
          <TabsContent value="dados" className="flex flex-col gap-6">
            <FechamentoEntradaDashboard
              type={type}
              nome={nome}
              itens={itens}
              sumEntradas={sumEntradas}
              desconto={discount}
              observacao={observation}
            />
          </TabsContent>
          <TabsContent value="descontos">
            <ListTabContent
              type="input"
              itens={discountItens}
              placeholder="ex: 10.00"
              fieldForm="desconto"
              fieldLabel="desconto"
              monetary={true}
            />
          </TabsContent>
          <TabsContent value="observacao">
            <div className="grid grid-cols-1">
              <SectionOne />
            </div>
          </TabsContent>
        </Tabs>
        <ScrollToTop />
      </form>
    </FormProvider>
  );
};
