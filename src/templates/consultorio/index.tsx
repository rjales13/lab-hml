import { DataTable } from '@/components/data-table';
import { AboutSection } from '@/components/about-section';
import { Hospital } from 'lucide-react';
import { getAll } from '@/app/actions';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const ConsultorioListTemplate = () => {
  return (
    <>
      <AboutSection
        title="Listagem de Consultórios"
        subtitle="Veja todos os consultórios cadastrados"
        icon={Hospital}
      />
      <div className="m-auto lg:w-4xl">
        <Suspense fallback={<Skeleton className="h-40 w-full rounded-md" />}>
          <ConsultorioDataTable />
        </Suspense>
      </div>
    </>
  );
};

export async function ConsultorioDataTable() {
  const result = await getAll({
    modelKey: 'consultorio',
    fields: ['nome'] as const,
  });

  return (
    <DataTable
      data={result}
      sortableFields={['nome']}
      linkableFields={['nome']}
      linkBasePath="consultorio"
      filterableField="nome"
      filterPlaceholder="Filtrar nomes..."
    />
  );
}
