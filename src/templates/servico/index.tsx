import { DataTable } from '@/components/data-table';
import { AboutSection } from '@/components/about-section';
import { Wrench } from 'lucide-react';
import { getAll } from '@/app/actions';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const ServicoListTemplate = () => {
  return (
    <>
      <AboutSection
        title="Listagem de Serviços"
        subtitle="Veja todos os serviços cadastrados"
        icon={Wrench}
      />
      <div className="m-auto lg:w-4xl">
        <Suspense fallback={<Skeleton className="h-40 w-full rounded-md" />}>
          <ServicoDataTable />
        </Suspense>
      </div>
    </>
  );
};

export async function ServicoDataTable() {
  const result = await getAll({
    modelKey: 'servico',
    fields: ['nome'] as const,
  });

  return (
    <DataTable
      data={result}
      sortableFields={['nome']}
      linkableFields={['nome']}
      linkBasePath="servico"
      filterableField="nome"
      filterPlaceholder="Filtrar nomes..."
    />
  );
}
