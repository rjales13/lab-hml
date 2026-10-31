'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { funcaoFormSchema, tFuncaoFormData } from './form-schema';
import { Navigation } from '@/components/navigation';
import { screenNavigation } from './screen-navigation';
import { SectionOne } from './form-section-one';
import { remove } from '@/app/actions';
import { saveFuncao } from '../actions';
import { useMutation } from '@/hooks/mutation';
import { SUCCESS_MESSAGES } from '@/lib/messages/success';
import { BreadCrumb } from '@/components/breadcrumb';

export const Form = (data: Partial<tFuncaoFormData>) => {
  const methods = useForm<tFuncaoFormData>({
    resolver: zodResolver(funcaoFormSchema),
    defaultValues: {
      id: data.id || '',
      nome: data.nome || '',
    },
  });

  const { handleMutation } = useMutation();

  const onSubmit = async (data: tFuncaoFormData) => {
    const msg = data.id
      ? SUCCESS_MESSAGES.editado
      : SUCCESS_MESSAGES.adicionado;
    await handleMutation({
      mutationFn: () => saveFuncao(data),
      redirectPath: 'funcao',
      successMessage: msg,
    });
  };

  const handleDelete = async () => {
    const { id = '' } = data;
    await handleMutation({
      mutationFn: () => remove({ id, modelKey: 'funcao' }),
      redirectPath: 'funcao',
      successMessage: SUCCESS_MESSAGES.deletado,
    });
  };

  return (
    <FormProvider {...methods}>
      <BreadCrumb />
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="mt-20 w-full space-y-6 rounded-md border border-gray-200 bg-white p-8 shadow-xl backdrop-blur-md"
      >
        <Navigation
          id={data.id}
          navigation={screenNavigation}
          disabled={methods.formState.isSubmitting}
          onDelete={handleDelete}
        />
        <div className="grid grid-cols-1">
          <SectionOne />
        </div>
      </form>
    </FormProvider>
  );
};
