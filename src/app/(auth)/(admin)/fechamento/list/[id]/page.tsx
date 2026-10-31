import { iIdSingleProps } from '@/models/id';
import { FechamentoListTemplate } from '@/templates/fechamento/list';

export default async function FechamentoListPage({ params }: iIdSingleProps) {
  const { id } = await params;
  return <FechamentoListTemplate id={id} />;
}
