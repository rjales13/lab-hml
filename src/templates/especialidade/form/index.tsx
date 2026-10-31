import { AboutSection } from '@/components/about-section';
import { Syringe } from 'lucide-react';
import { Form } from './form';
import { iSelectedIdProps } from '@/models/selected';
import { getById } from '@/app/actions';

export const EspecialidadeFormTemplate = async ({
  selectedId,
}: iSelectedIdProps) => {
  const result = await getById({
    modelKey: 'especialidade',
    fields: { id: selectedId },
  });

  return (
    <>
      <AboutSection
        title="Especialidade"
        subtitle="Cadastre as informações da especialidade"
        icon={Syringe}
      />
      <Form {...result} />
    </>
  );
};
