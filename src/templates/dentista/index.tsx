import { DataTable } from '@/components/data-table';
import { AboutSection } from '@/components/about-section';
import { Stethoscope } from 'lucide-react';
import { getAll } from '@/app/actions';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const DentistaListTemplate = () => {
  return (
    <>
      <AboutSection
        title="Listagem de Dentistas"
        subtitle="Veja todos os dentistas cadastrados"
        icon={Stethoscope}
      />
      <div className="m-auto lg:w-4xl">
        <Suspense fallback={<Skeleton className="h-40 w-full rounded-md" />}>
          <DentistaDataTable />
        </Suspense>
      </div>
    </>
  );
};

async function DentistaDataTable() {
  const result = await getAll({
    modelKey: 'dentista',
    fields: ['nome'] as const,
  });

  return (
    <DataTable
      data={result}
      sortableFields={['nome']}
      linkableFields={['nome']}
      linkBasePath="dentista"
      filterableField="nome"
      filterPlaceholder="Filtrar nomes..."
    />
  );
}
