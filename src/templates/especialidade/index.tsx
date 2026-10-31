import { DataTable } from '@/components/data-table';
import { AboutSection } from '@/components/about-section';
import { Syringe } from 'lucide-react';
import { getAll } from '@/app/actions';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const EspecialidadeListTemplate = async () => {
  return (
    <>
      <AboutSection
        title="Listagem de Especialidades"
        subtitle="Veja todas as especialidades cadastradas"
        icon={Syringe}
      />
      <div className="m-auto lg:w-4xl">
        <Suspense fallback={<Skeleton className="h-40 w-full rounded-md" />}>
          <EspecialidadeDataTable />
        </Suspense>
      </div>
    </>
  );
};

async function EspecialidadeDataTable() {
  const result = await getAll({
    modelKey: 'especialidade',
    fields: ['nome'] as const,
  });

  return (
    <DataTable
      data={result}
      sortableFields={['nome']}
      linkableFields={['nome']}
      linkBasePath="especialidade"
      filterableField="nome"
      filterPlaceholder="Filtrar nomes..."
    />
  );
}
