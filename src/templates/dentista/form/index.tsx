import { AboutSection } from '@/components/about-section';
import { Stethoscope } from 'lucide-react';
import { Form } from './form';
import { iSelectedIdProps } from '@/models/selected';
import { getById } from '@/app/actions';

export const DentistaFormTemplate = async ({
  selectedId,
}: iSelectedIdProps) => {
  const result = await getById({
    modelKey: 'dentista',
    fields: { id: selectedId },
  });

  return (
    <>
      <AboutSection
        title="Dentistas"
        subtitle="Cadastre as informações do dentista"
        icon={Stethoscope}
      />
      <Form {...result} />
    </>
  );
};
