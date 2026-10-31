import { AboutSection } from '@/components/about-section';
import { Motorbike } from 'lucide-react';
import { Form } from './form';
import { iSelectedIdProps } from '@/models/selected';
import { getById } from '@/app/actions';

export const RoteiroFormTemplate = async ({ selectedId }: iSelectedIdProps) => {
  const result = await getById({
    modelKey: 'roteiro',
    fields: { id: selectedId },
  });

  return (
    <>
      <AboutSection
        title="Roteiros"
        subtitle="Cadastre as informações do roteiro"
        icon={Motorbike}
      />
      <Form {...result} />
    </>
  );
};
