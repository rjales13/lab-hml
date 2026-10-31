import { iIdProps } from '@/models/id';
import { EntradaFormTemplate } from '@/templates/entrada/form';

export default async function EntradaFormPage({ params }: iIdProps) {
  const { id = [] } = await params;
  const selectedId = id[0] ?? '';

  return <EntradaFormTemplate selectedId={selectedId} />;
}
