import { AboutSection } from '@/components/about-section';
import { Wrench } from 'lucide-react';
import { Form } from './form';
import { iSelectedIdProps } from '@/models/selected';
import { getById } from '@/app/actions';

export const ServicoFormTemplate = async ({ selectedId }: iSelectedIdProps) => {
  const result = await getById({
    modelKey: 'servico',
    fields: { id: selectedId },
  });

  return (
    <>
      <AboutSection
        title="Serviços"
        subtitle="Cadastre as informações do serviço"
        icon={Wrench}
      />
      <Form {...result} />
    </>
  );
};
