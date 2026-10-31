import { iIdProps } from '@/models/id';
import { RoteiroFormTemplate } from '@/templates/roteiro/form';

export default async function RoteiroFormPage({ params }: iIdProps) {
  const { id = [] } = await params;
  const selectedId = id[0] ?? '';

  return <RoteiroFormTemplate selectedId={selectedId} />;
}
