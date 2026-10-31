'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { consultorioFormSchema, tConsultorioFormData } from './form-schema';
import { Navigation } from '@/components/navigation';
import { screenNavigation } from './screen-navigation';
import { SectionOne } from './form-section-one';
import { SectionTwo } from './form-section-two';
import { getAll, remove } from '@/app/actions';
import { saveConsultorio } from '../actions';
import { useMutation } from '@/hooks/mutation';
import { useGetCep } from '@/hooks/get-cep';
import { SUCCESS_MESSAGES } from '@/lib/messages/success';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TABS } from './tabs-trigger';
import { ListTabContent } from '@/components/list-tab-content';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { SectionThree } from './form-section-three';
import { SectionFour } from './form-section-four';
import { SectionFive } from './form-section-five';
import { SectionSix } from './form-section-six';
import { BreadCrumb } from '@/components/breadcrumb';
import { ScrollToTop } from '@/components/scroll-to-top';

export const Form = (data: Partial<tConsultorioFormData>) => {
  const [activeTab, setActiveTab] = useState('dados');
  const [enderecoCompleto, setEnderecoCompleto] = useState({
    logradouro: '',
    localidade: '',
    estado: '',
    bairro: '',
  });
  const [enderecoEntregaCompleto, setEnderecoEntregaCompleto] = useState({
    logradouro: '',
    localidade: '',
    estado: '',
    bairro: '',
  });

  const methods = useForm<tConsultorioFormData>({
    resolver: zodResolver(consultorioFormSchema),
    defaultValues: {
      id: data.id || '',
      nome: data.nome || '',
      cobranca: data.cobranca || '',
      cep: data.cep || '',
      numero: data.numero || '',
      email: data.email || '',
      complemento: data.complemento || '',
      cep_entrega: data.cep_entrega || '',
      numero_entrega: data.numero_entrega || '',
      complemento_entrega: data.complemento_entrega || '',
      observacao: data.observacao || '',
      telefones: data.telefones || [],
      dentistas: data.dentistas || [],
      secretarias: data.secretarias || [],
    },
  });

  const { handleMutation } = useMutation();
  const { fetchCep, loadingCep } = useGetCep();

  const handleSubmit = async (data: tConsultorioFormData) => {
    const msg = data.id
      ? SUCCESS_MESSAGES.editado
      : SUCCESS_MESSAGES.adicionado;
    await handleMutation({
      mutationFn: () => saveConsultorio(data),
      redirectPath: 'consultorio',
      successMessage: msg,
    });
  };

  const handleDelete = async () => {
    const { id = '' } = data;
    await handleMutation({
      mutationFn: () => remove({ id, modelKey: 'consultorio' }),
      redirectPath: 'consultorio',
      successMessage: SUCCESS_MESSAGES.deletado,
    });
  };

  const telefonesWatch = useWatch({
    control: methods.control,
    name: 'telefones',
  });

  const dentistasWatch = useWatch({
    control: methods.control,
    name: 'dentistas',
  });

  const secretariasWatch = useWatch({
    control: methods.control,
    name: 'secretarias',
  });

  const { data: dentistasData = [], isPending: isPendingDentistas } = useQuery({
    queryKey: ['dentistas'],
    queryFn: async () =>
      await getAll({
        modelKey: 'dentista',
        fields: ['nome'] as const,
        listSheet: true,
      }),
    enabled: activeTab === 'dentistas',
  });

  const { data: secretariasData = [], isPending: isPendingSecretarias } =
    useQuery({
      queryKey: ['secretarias'],
      queryFn: async () =>
        await getAll({
          modelKey: 'secretaria',
          fields: ['nome'] as const,
          listSheet: true,
        }),
      enabled: activeTab === 'secretarias',
    });

  const handleCepChange = useCallback(
    async (field: 'cep' | 'cep_entrega') => {
      const cep = methods.getValues(field) || '';
      const cepNumerico = cep.replace(/\D/g, '');

      const setAddress =
        field === 'cep' ? setEnderecoCompleto : setEnderecoEntregaCompleto;

      if (cepNumerico.length < 8) {
        setAddress({ logradouro: '', localidade: '', estado: '', bairro: '' });
        return;
      }

      const result = await fetchCep(cepNumerico);
      if (result)
        setAddress({
          logradouro: result.logradouro,
          localidade: result.localidade,
          estado: result.uf,
          bairro: result.bairro,
        });
    },
    [fetchCep, methods]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const cep = methods.getValues('cep');
      const cepEntrega = methods.getValues('cep_entrega');

      if (cep) handleCepChange('cep');
      if (cepEntrega) handleCepChange('cep_entrega');
    }, 0);

    return () => clearTimeout(timer);
  }, [methods, handleCepChange]);

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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SectionOne />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <SectionTwo
                endereco={enderecoCompleto.logradouro}
                loading={loadingCep}
                onCepChange={handleCepChange}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <SectionThree
                cidade={enderecoCompleto.localidade}
                estado={enderecoCompleto.estado}
                bairro={enderecoCompleto.bairro}
                loading={loadingCep}
              />
            </div>
            <div className="grid grid-cols-1">
              <SectionFour />
            </div>
          </TabsContent>
          <TabsContent value="telefones">
            <ListTabContent
              type="input"
              itens={telefonesWatch}
              placeholder="ex: (11) 98765-9876"
              mask="(##) #####-####"
              fieldForm="telefones"
              fieldLabel="telefone"
            />
          </TabsContent>
          <TabsContent value="dentistas">
            <ListTabContent
              type="select"
              commandData={dentistasData}
              isPending={isPendingDentistas}
              itens={dentistasWatch}
              fieldForm="dentistas"
              fieldLabel="dentista"
            />
          </TabsContent>
          <TabsContent value="secretarias">
            <ListTabContent
              type="select"
              commandData={secretariasData}
              isPending={isPendingSecretarias}
              itens={secretariasWatch}
              fieldForm="secretarias"
              fieldLabel="secretaria"
            />
          </TabsContent>
          <TabsContent value="entrega" className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <SectionFive
                endereco={enderecoEntregaCompleto.logradouro}
                loading={loadingCep}
                onCepChange={handleCepChange}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <SectionSix
                estado={enderecoEntregaCompleto.estado}
                cidade={enderecoEntregaCompleto.localidade}
                bairro={enderecoEntregaCompleto.bairro}
                loading={loadingCep}
              />
            </div>
          </TabsContent>
        </Tabs>
        <ScrollToTop />
      </form>
    </FormProvider>
  );
};
