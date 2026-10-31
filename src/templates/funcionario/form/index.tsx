import { AboutSection } from '@/components/about-section';
import { BriefcaseBusiness } from 'lucide-react';
import { Form } from './form';
import { iSelectedIdProps } from '@/models/selected';
import { getById } from '@/app/actions';

export const FuncionarioFormTemplate = async ({
  selectedId,
}: iSelectedIdProps) => {
  const result = await getById({
    modelKey: 'funcionario',
    fields: { id: selectedId },
  });

  return (
    <>
      <AboutSection
        title="Funcionário"
        subtitle="Cadastre as informações do funcionário"
        icon={BriefcaseBusiness}
      />
      <Form {...result} />
    </>
  );
};
