'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { funcionarioFormSchema, tFuncionarioFormData } from './form-schema';
import { Navigation } from '@/components/navigation';
import { screenNavigation } from './screen-navigation';
import { SectionOne } from './form-section-one';
import { SectionTwo } from './form-section-two';
import { getAll, remove } from '@/app/actions';
import { saveFuncionario } from '../actions';
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

export const Form = (data: Partial<tFuncionarioFormData>) => {
  const [activeTab, setActiveTab] = useState('dados');
  const [enderecoCompleto, setEnderecoCompleto] = useState({
    logradouro: '',
    localidade: '',
    estado: '',
    bairro: '',
  });

  const methods = useForm<tFuncionarioFormData>({
    resolver: zodResolver(funcionarioFormSchema),
    defaultValues: {
      id: data.id || '',
      nome: data.nome || '',
      cep: data.cep || '',
      numero: data.numero || '',
      email: data.email || '',
      complemento: data.complemento || '',
      rg: data.rg || '',
      cpf: data.cpf || '',
      data_nascimento: data.data_nascimento || '',
      data_admissao: data.data_admissao || '',
      data_recisao: data.data_recisao || '',
      observacao: data.observacao || '',
      telefones: data.telefones || [],
      funcoes: data.funcoes || [],
    },
  });

  const { handleMutation } = useMutation();
  const { fetchCep, loadingCep } = useGetCep();

  const handleSubmit = async (data: tFuncionarioFormData) => {
    const msg = data.id
      ? SUCCESS_MESSAGES.editado
      : SUCCESS_MESSAGES.adicionado;
    await handleMutation({
      mutationFn: () => saveFuncionario(data),
      redirectPath: 'funcionario',
      successMessage: msg,
    });
  };

  const handleDelete = async () => {
    const { id = '' } = data;
    await handleMutation({
      mutationFn: () => remove({ id, modelKey: 'funcionario' }),
      redirectPath: 'funcionario',
      successMessage: SUCCESS_MESSAGES.deletado,
    });
  };

  const telefonesWatch = useWatch({
    control: methods.control,
    name: 'telefones',
  });

  const funcoesWatch = useWatch({
    control: methods.control,
    name: 'funcoes',
  });

  const { data: funcoesData = [], isPending: isPendingFuncoes } = useQuery({
    queryKey: ['funcoes'],
    queryFn: async () =>
      await getAll({
        modelKey: 'funcao',
        fields: ['nome'] as const,
        listSheet: true,
      }),
    enabled: activeTab === 'funcoes',
  });

  const handleCepChange = useCallback(async () => {
    const cep = methods.getValues('cep') || '';
    const cepNumerico = cep.replace(/\D/g, '');

    if (cepNumerico.length < 8) {
      setEnderecoCompleto({
        logradouro: '',
        localidade: '',
        estado: '',
        bairro: '',
      });
      return;
    }

    const result = await fetchCep(cepNumerico);
    if (result)
      setEnderecoCompleto({
        logradouro: result.logradouro,
        localidade: result.localidade,
        estado: result.uf,
        bairro: result.bairro,
      });
  }, [fetchCep, methods]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const cep = methods.getValues('cep');

      if (cep) handleCepChange();
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
              <SectionTwo />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <SectionThree />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <SectionFour
                endereco={enderecoCompleto.logradouro}
                loading={loadingCep}
                onCepChange={handleCepChange}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <SectionFive
                cidade={enderecoCompleto.localidade}
                estado={enderecoCompleto.estado}
                bairro={enderecoCompleto.bairro}
                loading={loadingCep}
              />
            </div>
            <div className="grid grid-cols-1">
              <SectionSix />
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
          <TabsContent value="funcoes">
            <ListTabContent
              type="select"
              commandData={funcoesData}
              isPending={isPendingFuncoes}
              itens={funcoesWatch}
              fieldForm="funcoes"
              fieldLabel="função"
            />
          </TabsContent>
        </Tabs>
      </form>
    </FormProvider>
  );
};
