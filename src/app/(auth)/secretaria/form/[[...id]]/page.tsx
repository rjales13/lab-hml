import { iIdProps } from '@/models/id';
import { SecretariaFormTemplate } from '@/templates/secretaria/form';

export default async function SecretariaFormPage({ params }: iIdProps) {
  const { id = [] } = await params;
  const selectedId = id[0] ?? '';

  return <SecretariaFormTemplate selectedId={selectedId} />;
}
