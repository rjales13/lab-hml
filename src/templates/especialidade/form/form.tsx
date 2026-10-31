'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { especialidadeFormSchema, tEspecialidadeFormData } from './form-schema';
import { Navigation } from '@/components/navigation';
import { screenNavigation } from './screen-navigation';
import { SectionOne } from './form-section-one';
import { remove } from '@/app/actions';
import { saveEspecialidade } from '../actions';
import { useMutation } from '@/hooks/mutation';
import { SUCCESS_MESSAGES } from '@/lib/messages/success';
import { BreadCrumb } from '@/components/breadcrumb';

export const Form = (data: Partial<tEspecialidadeFormData>) => {
  const methods = useForm<tEspecialidadeFormData>({
    resolver: zodResolver(especialidadeFormSchema),
    defaultValues: {
      id: data.id || '',
      nome: data.nome || '',
    },
  });

  const { handleMutation } = useMutation();

  const onSubmit = async (data: tEspecialidadeFormData) => {
    const msg = data.id
      ? SUCCESS_MESSAGES.editado
      : SUCCESS_MESSAGES.adicionado;
    await handleMutation({
      mutationFn: () => saveEspecialidade(data),
      redirectPath: 'especialidade',
      successMessage: msg,
    });
  };

  const handleDelete = async () => {
    const { id = '' } = data;
    await handleMutation({
      mutationFn: () => remove({ id, modelKey: 'especialidade' }),
      redirectPath: 'especialidade',
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
