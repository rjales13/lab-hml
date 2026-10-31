import { DataTable } from '@/components/data-table';
import { AboutSection } from '@/components/about-section';
import { Skeleton } from '@/components/ui/skeleton';
import { Motorbike } from 'lucide-react';
import { Suspense } from 'react';
import { RoteiroFiltersToolbar, type tRoteiroFilter } from './filters-toolbar';
import { getRoteiros } from './actions';

interface iRoteiroListTemplateProps {
  filter?: tRoteiroFilter;
  createdAtFilter: {
    enabled: boolean;
    month: number;
    year: number;
  };
}

export const RoteiroListTemplate = ({
  filter = 'nao',
  createdAtFilter,
}: iRoteiroListTemplateProps) => {
  return (
    <>
      <AboutSection
        title="Listagem de Roteiros"
        subtitle="Veja todos os roteiros cadastrados"
        icon={Motorbike}
      />
      <div className="m-auto lg:w-4xl">
        <RoteiroFiltersToolbar
          filter={filter}
          createdAtFilter={createdAtFilter}
        />
        <Suspense fallback={<Skeleton className="h-40 w-full rounded-md" />}>
          <RoteiroDataTable filter={filter} createdAtFilter={createdAtFilter} />
        </Suspense>
      </div>
    </>
  );
};

async function RoteiroDataTable({
  filter,
  createdAtFilter,
}: {
  filter: tRoteiroFilter;
  createdAtFilter: {
    enabled: boolean;
    month: number;
    year: number;
  };
}) {
  const result = await getRoteiros(filter, createdAtFilter);

  return (
    <DataTable
      data={result}
      sortableFields={['data', 'entregue', 'created_at']}
      linkableFields={['data', 'entregue']}
      linkBasePath="roteiro"
      filterableField="data"
      filterPlaceholder="Filtrar datas..."
    />
  );
}
