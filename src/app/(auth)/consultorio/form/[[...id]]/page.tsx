import { iIdProps } from '@/models/id';
import { ConsultorioFormTemplate } from '@/templates/consultorio/form';

export default async function ConsultorioFormPage({ params }: iIdProps) {
  const { id = [] } = await params;
  const selectedId = id[0] ?? '';

  return <ConsultorioFormTemplate selectedId={selectedId} />;
}
