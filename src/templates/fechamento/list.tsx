import { DataTable } from '@/components/data-table';
import { AboutSection } from '@/components/about-section';
import { ReceiptText } from 'lucide-react';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getConsultorioDentista } from './actions';

interface iFechamentProps {
  id: string;
}

export const FechamentoListTemplate = ({ id }: iFechamentProps) => {
  return (
    <>
      <AboutSection
        title="Listagem de Fechamento"
        subtitle="Veja todos os fechamentos cadastrados"
        icon={ReceiptText}
      />
      <div className="m-auto lg:w-4xl">
        <Suspense fallback={<Skeleton className="h-40 w-full rounded-md" />}>
          <FechamentoDataTable id={id} />
        </Suspense>
      </div>
    </>
  );
};

async function FechamentoDataTable({ id }: iFechamentProps) {
  const isClosed = id.length === 24;
  const result = await getConsultorioDentista({ id, isClosed });

  return (
    <DataTable
      data={result}
      sortableFields={['nome']}
      linkableFields={['nome', 'cobrança']}
      linkBasePath="../../fechamento"
      filterableField="nome"
      filterPlaceholder="Filtrar datas..."
      insert={false}
      {...(isClosed && { param: id })}
    />
  );
}
