'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { secretariaFormSchema, tSecretariaFormData } from './form-schema';
import { Navigation } from '@/components/navigation';
import { screenNavigation } from './screen-navigation';
import { SectionOne } from './form-section-one';
import { remove } from '@/app/actions';
import { saveSecretaria } from '../actions';
import { useMutation } from '@/hooks/mutation';
import { SUCCESS_MESSAGES } from '@/lib/messages/success';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TABS } from './tabs-trigger';
import { ListTabContent } from '@/components/list-tab-content';
import { useState } from 'react';
import { BreadCrumb } from '@/components/breadcrumb';

export const Form = (data: Partial<tSecretariaFormData>) => {
  const [activeTab, setActiveTab] = useState('dados');
  const methods = useForm<tSecretariaFormData>({
    resolver: zodResolver(secretariaFormSchema),
    defaultValues: {
      id: data.id || '',
      nome: data.nome || '',
      email: data.email || '',
      telefones: data.telefones || [],
    },
  });

  const { handleMutation } = useMutation();

  const handleSubmit = async (data: tSecretariaFormData) => {
    const msg = data.id
      ? SUCCESS_MESSAGES.editado
      : SUCCESS_MESSAGES.adicionado;
    await handleMutation({
      mutationFn: () => saveSecretaria(data),
      redirectPath: 'secretaria',
      successMessage: msg,
    });
  };

  const handleDelete = async () => {
    const { id = '' } = data;
    await handleMutation({
      mutationFn: () => remove({ id, modelKey: 'secretaria' }),
      redirectPath: 'secretaria',
      successMessage: SUCCESS_MESSAGES.deletado,
    });
  };

  const telefonesWatch = useWatch({
    control: methods.control,
    name: 'telefones',
  });

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
        </Tabs>
      </form>
    </FormProvider>
  );
};
