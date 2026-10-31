import { DataTable } from '@/components/data-table';
import { AboutSection } from '@/components/about-section';
import { ListTodo } from 'lucide-react';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getEntradas } from './actions';
import { FiltersToolbar } from '@/components/filters-toolbar';

interface iEntradaListTemplateProps {
  filter?: 'pending' | 'all';
  createdAtFilter: {
    enabled: boolean;
    month: number;
    year: number;
  };
}

export const EntradaListTemplate = ({
  filter = 'pending',
  createdAtFilter,
}: iEntradaListTemplateProps) => {
  return (
    <>
      <AboutSection
        title="Listagem de Entradas"
        subtitle="Veja todas as entradas cadastradas"
        icon={ListTodo}
      />
      <div className="m-auto lg:w-4xl">
        <FiltersToolbar filter={filter} createdAtFilter={createdAtFilter} />
        <Suspense fallback={<Skeleton className="h-40 w-full rounded-md" />}>
          <EntradaDataTable filter={filter} createdAtFilter={createdAtFilter} />
        </Suspense>
      </div>
    </>
  );
};

async function EntradaDataTable({
  filter,
  createdAtFilter,
}: {
  filter: 'pending' | 'all';
  createdAtFilter: {
    enabled: boolean;
    month: number;
    year: number;
  };
}) {
  const result = await getEntradas(filter, createdAtFilter);

  return (
    <>
      <DataTable
        data={result}
        sortableFields={['consultorio', 'dentista', 'paciente', 'created_at']}
        linkableFields={['consultorio', 'dentista', 'paciente']}
        linkBasePath="entrada"
        filterableField="paciente"
        filterPlaceholder="Filtrar pacientes..."
      />
    </>
  );
}
