'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { servicoFormSchema, tServicoFormData } from './form-schema';
import { Navigation } from '@/components/navigation';
import { screenNavigation } from './screen-navigation';
import { SectionOne } from './form-section-one';
import { remove } from '@/app/actions';
import { saveServico } from '../actions';
import { useMutation } from '@/hooks/mutation';
import { SUCCESS_MESSAGES } from '@/lib/messages/success';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TABS } from './tabs-trigger';
import { ListTabContent } from '@/components/list-tab-content';
import { useState } from 'react';
import { BreadCrumb } from '@/components/breadcrumb';
import { useAuth } from '@/contexts/user-contexts';

export const Form = (data: Partial<tServicoFormData>) => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dados');
  const methods = useForm<tServicoFormData>({
    resolver: zodResolver(servicoFormSchema),
    defaultValues: {
      id: data.id || '',
      nome: data.nome || '',
      valor_sem_nota: data.valor_sem_nota || [],
      valor_com_nota: data.valor_com_nota || [],
      valor_unicid: data.valor_unicid || [],
      valor_pinheros: data.valor_pinheros || [],
    },
  });

  const { handleMutation } = useMutation();

  const handleSubmit = async (data: tServicoFormData) => {
    const msg = data.id
      ? SUCCESS_MESSAGES.editado
      : SUCCESS_MESSAGES.adicionado;
    await handleMutation({
      mutationFn: () => saveServico(data),
      redirectPath: 'servico',
      successMessage: msg,
    });
  };

  const handleDelete = async () => {
    const { id = '' } = data;
    await handleMutation({
      mutationFn: () => remove({ id, modelKey: 'servico' }),
      redirectPath: 'servico',
      successMessage: SUCCESS_MESSAGES.deletado,
    });
  };

  const valoresSemNotaWatch = useWatch({
    control: methods.control,
    name: 'valor_sem_nota',
  }) as string[];

  const valoresComNotaWatch = useWatch({
    control: methods.control,
    name: 'valor_com_nota',
  }) as string[];

  const valoresUnicidWatch = useWatch({
    control: methods.control,
    name: 'valor_unicid',
  }) as string[];

  const valoresPinherosWatch = useWatch({
    control: methods.control,
    name: 'valor_pinheros',
  }) as string[];

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
                  disabled={
                    tab.value === 'valor_sem_nota' ||
                    tab.value === 'valor_com_nota' ||
                    tab.value === 'valor_unicid' ||
                    tab.value === 'valor_pinheros'
                      ? !isAdmin
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
            <div className="grid grid-cols-1">
              <SectionOne />
            </div>
          </TabsContent>
          <TabsContent value="valor_sem_nota">
            <ListTabContent
              type="input"
              itens={valoresSemNotaWatch}
              placeholder="ex: 50.00"
              fieldForm="valor_sem_nota"
              fieldLabel="valor sem nota"
              monetary={true}
            />
          </TabsContent>
          <TabsContent value="valor_com_nota">
            <ListTabContent
              type="input"
              itens={valoresComNotaWatch}
              placeholder="ex: 50.00"
              fieldForm="valor_com_nota"
              fieldLabel="valor com nota"
              monetary={true}
            />
          </TabsContent>
          <TabsContent value="valor_unicid">
            <ListTabContent
              type="input"
              itens={valoresUnicidWatch}
              placeholder="ex: 50.00"
              fieldForm="valor_unicid"
              fieldLabel="valor unicid"
              monetary={true}
            />
          </TabsContent>
          <TabsContent value="valor_pinheros">
            <ListTabContent
              type="input"
              itens={valoresPinherosWatch}
              placeholder="ex: 50.00"
              fieldForm="valor_pinheros"
              fieldLabel="valor pinheros"
              monetary={true}
            />
          </TabsContent>
        </Tabs>
      </form>
    </FormProvider>
  );
};
