import { AboutSection } from '@/components/about-section';
import { BriefcaseBusiness } from 'lucide-react';
import { Form } from './form';
import { iSelectedIdProps } from '@/models/selected';
import { getById } from '@/app/actions';

export const FuncaoFormTemplate = async ({ selectedId }: iSelectedIdProps) => {
  const result = await getById({
    modelKey: 'funcao',
    fields: { id: selectedId },
  });

  return (
    <>
      <AboutSection
        title="Função"
        subtitle="Cadastre as informações da função"
        icon={BriefcaseBusiness}
      />
      <Form {...result} />
    </>
  );
};
