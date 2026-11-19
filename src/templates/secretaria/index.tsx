import { DataTable } from '@/components/data-table';
import { AboutSection } from '@/components/about-section';
import { Headset } from 'lucide-react';
import { getAll } from '@/app/actions';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const SecretariaListTemplate = () => {
  return (
    <>
      <AboutSection
        title="Listagem de Secretárias"
        subtitle="Veja todas as secretárias cadastradas"
        icon={Headset}
      />
      <div className="m-auto lg:w-4xl">
        <Suspense fallback={<Skeleton className="h-40 w-full rounded-md" />}>
          <SecretariaDataTable />
        </Suspense>
      </div>
    </>
  );
};

export async function SecretariaDataTable() {
  const result = await getAll({
    modelKey: 'secretaria',
    fields: ['nome'] as const,
  });

  return (
    <DataTable
      data={result}
      sortableFields={['nome']}
      linkableFields={['nome']}
      linkBasePath="secretaria"
      filterableField="nome"
      filterPlaceholder="Filtrar nomes..."
    />
  );
}
