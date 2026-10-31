import { iIdProps } from '@/models/id';
import { FuncaoFormTemplate } from '@/templates/funcao/form';

export default async function FuncaoFormPage({ params }: iIdProps) {
  const { id = [] } = await params;
  const selectedId = id[0] ?? '';

  return <FuncaoFormTemplate selectedId={selectedId} />;
}
