import { iIdProps } from '@/models/id';
import { DentistaFormTemplate } from '@/templates/dentista/form';

export default async function DentistaFormPage({ params }: iIdProps) {
  const { id = [] } = await params;
  const selectedId = id[0] ?? '';

  return <DentistaFormTemplate selectedId={selectedId} />;
}
