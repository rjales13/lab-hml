import { AboutSection } from '@/components/about-section';
import { Hospital } from 'lucide-react';
import { Form } from './form';
import { iSelectedIdProps } from '@/models/selected';
import { getById } from '@/app/actions';

export const ConsultorioFormTemplate = async ({
  selectedId,
}: iSelectedIdProps) => {
  const result = await getById({
    modelKey: 'consultorio',
    fields: { id: selectedId },
  });

  return (
    <>
      <AboutSection
        title="Consultórios"
        subtitle="Cadastre as informações do consultório"
        icon={Hospital}
      />
      <Form {...result} />
    </>
  );
};
