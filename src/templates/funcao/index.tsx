import { DataTable } from '@/components/data-table';
import { AboutSection } from '@/components/about-section';
import { BriefcaseBusiness } from 'lucide-react';
import { getAll } from '@/app/actions';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const FuncaoListTemplate = async () => {
  return (
    <>
      <AboutSection
        title="Listagem de Funções"
        subtitle="Veja todas as funções cadastradas"
        icon={BriefcaseBusiness}
      />
      <div className="m-auto lg:w-4xl">
        <Suspense fallback={<Skeleton className="h-40 w-full rounded-md" />}>
          <FuncaoDataTable />
        </Suspense>
      </div>
    </>
  );
};

export async function FuncaoDataTable() {
  const result = await getAll({
    modelKey: 'funcao',
    fields: ['nome'] as const,
  });

  return (
    <DataTable
      data={result}
      sortableFields={['nome']}
      linkableFields={['nome']}
      linkBasePath="funcao"
      filterableField="nome"
      filterPlaceholder="Filtrar nomes..."
    />
  );
}
