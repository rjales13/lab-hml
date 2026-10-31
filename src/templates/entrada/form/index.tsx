import { AboutSection } from '@/components/about-section';
import { ListTodo } from 'lucide-react';
import { Form } from './form';
import { iSelectedIdProps } from '@/models/selected';
import { getById } from '@/app/actions';

export const EntradaFormTemplate = async ({ selectedId }: iSelectedIdProps) => {
  const result = await getById({
    modelKey: 'entrada',
    fields: { id: selectedId },
  });

  return (
    <>
      <AboutSection
        title="Entradas"
        subtitle="Cadastre as informações da entrada"
        icon={ListTodo}
      />
      <Form {...result} />
    </>
  );
};
