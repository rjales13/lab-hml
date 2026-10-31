import { iIdProps } from '@/models/id';
import { ServicoFormTemplate } from '@/templates/servico/form';

export default async function ServicoFormPage({ params }: iIdProps) {
  const { id = [] } = await params;
  const selectedId = id[0] ?? '';

  return <ServicoFormTemplate selectedId={selectedId} />;
}
