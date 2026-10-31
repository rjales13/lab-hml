import { AboutSection } from '@/components/about-section';
import { ReceiptText } from 'lucide-react';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Panel } from './panel';

export const FechamentoPanelTemplate = () => {
  return (
    <>
      <AboutSection
        title="Painel de Fechamento"
        subtitle="Veja todos os fechamentos cadastrados"
        icon={ReceiptText}
      />
      <div className="m-auto lg:w-4xl">
        <Suspense fallback={<Skeleton className="h-40 w-full rounded-md" />}>
          <Panel />
        </Suspense>
      </div>
    </>
  );
};
