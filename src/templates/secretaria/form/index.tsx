import { AboutSection } from '@/components/about-section';
import { Headset } from 'lucide-react';
import { Form } from './form';
import { iSelectedIdProps } from '@/models/selected';
import { getById } from '@/app/actions';

export const SecretariaFormTemplate = async ({
  selectedId,
}: iSelectedIdProps) => {
  const result = await getById({
    modelKey: 'secretaria',
    fields: { id: selectedId },
  });

  return (
    <>
      <AboutSection
        title="Secretárias"
        subtitle="Cadastre as informações da secretária"
        icon={Headset}
      />
      <Form {...result} />
    </>
  );
};
