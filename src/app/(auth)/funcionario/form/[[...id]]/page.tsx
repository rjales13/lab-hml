import { iIdProps } from '@/models/id';
import { FuncionarioFormTemplate } from '@/templates/funcionario/form';

export default async function FuncionarioFormPage({ params }: iIdProps) {
  const { id = [] } = await params;
  const selectedId = id[0] ?? '';

  return <FuncionarioFormTemplate selectedId={selectedId} />;
}
