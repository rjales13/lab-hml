import { iIdProps } from '@/models/id';
import { EspecialidadeFormTemplate } from '@/templates/especialidade/form';

export default async function EspecialidadeFormPage({ params }: iIdProps) {
  const { id = [] } = await params;
  const selectedId = id[0] ?? '';

  return <EspecialidadeFormTemplate selectedId={selectedId} />;
}
