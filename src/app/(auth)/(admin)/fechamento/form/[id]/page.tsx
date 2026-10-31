import { iFuncionarioFormPageProps } from '@/models/fechamento';
import { FechamentoFormTemplate } from '@/templates/fechamento/form';

export default async function FuncionarioFormPage({
  params,
  searchParams,
}: iFuncionarioFormPageProps) {
  const { id } = await params;
  const queryParams = await searchParams;
  const queryId = queryParams?.param as string;

  return <FechamentoFormTemplate selectedId={id} fechamentoId={queryId} />;
}
