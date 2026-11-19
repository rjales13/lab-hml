import { DataTable } from '@/components/data-table';
import { AboutSection } from '@/components/about-section';
import { Contact } from 'lucide-react';
import { getAll } from '@/app/actions';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const FuncionarioListTemplate = () => {
  return (
    <>
      <AboutSection
        title="Listagem de Funcionários"
        subtitle="Veja todos os funcionários cadastrados"
        icon={Contact}
      />
      <div className="m-auto lg:w-4xl">
        <Suspense fallback={<Skeleton className="h-40 w-full rounded-md" />}>
          <FuncionarioDataTable />
        </Suspense>
      </div>
    </>
  );
};

export async function FuncionarioDataTable() {
  const result = await getAll({
    modelKey: 'funcionario',
    fields: ['nome'] as const,
  });

  return (
    <DataTable
      data={result}
      sortableFields={['nome']}
      linkableFields={['nome']}
      linkBasePath="funcionario"
      filterableField="nome"
      filterPlaceholder="Filtrar nomes..."
    />
  );
}
