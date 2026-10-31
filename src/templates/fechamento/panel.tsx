'use client';

import { FechamentoCard } from '@/components/fechamento-card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  downloadFechamento,
  getFechamentos,
  handleFechamento,
} from './actions';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { EmptyData } from '@/components/empty-data';
import { useMutation } from '@/hooks/mutation';
import { SUCCESS_MESSAGES } from '@/lib/messages/success';
import { downloadFechamentoPdfs } from '@/lib/download-fechamento-pdfs';
import { toast } from 'sonner';
import { ERROR_MESSAGES } from '@/lib/messages/errors';
import { iFechamentoCloseProps } from '@/models/fechamento';
import { LoaderCircle } from 'lucide-react';

const currentYear = new Date().getFullYear();
const getLastFiveYears: number[] = Array.from(
  { length: 5 },
  (_, i) => currentYear - i
);

export const Panel = () => {
  const router = useRouter();
  const [getCurrentYear, setGetCurrentYear] = useState(currentYear);
  const [updateFechamento, setUpdateFechamento] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [processingType, setProcessingType] = useState<
    'close' | 'unclose' | null
  >(null);

  const SECOND_DATA = 1;

  const { data = [], isLoading } = useQuery({
    queryKey: ['fechamento', getCurrentYear, updateFechamento],
    queryFn: async () => await getFechamentos(getCurrentYear),
  });

  const beforeLast =
    getCurrentYear === currentYear && data.length > 1
      ? data[SECOND_DATA].id
      : null;

  const handleChange = async (value: string) => {
    setGetCurrentYear(parseInt(value));
  };

  const handleViewCard = (id: string) => {
    router.push(`/fechamento/list/${id}`);
  };

  const { handleMutation } = useMutation();

  const handleCloseCard = async ({ id, date }: iFechamentoCloseProps) => {
    setProcessingId(id || null);
    setProcessingType('close');
    try {
      await handleMutation({
        mutationFn: () => handleFechamento({ date }),
        successMessage: SUCCESS_MESSAGES.fechamento,
      });
      setUpdateFechamento((prev) => !prev);
    } finally {
      setProcessingId(null);
      setProcessingType(null);
    }
  };

  const handleUnCloseCard = async ({ id }: iFechamentoCloseProps) => {
    setProcessingId(id || null);
    setProcessingType('unclose');
    try {
      await handleMutation({
        mutationFn: () => handleFechamento({ id }),
        successMessage: SUCCESS_MESSAGES.unfechamento,
      });
      setUpdateFechamento((prev) => !prev);
    } finally {
      setProcessingId(null);
      setProcessingType(null);
    }
  };

  const handleDownload = async (id: string) => {
    setDownloadingId(id);
    try {
      const entradas = await downloadFechamento(id);
      await downloadFechamentoPdfs(entradas);
    } catch (error) {
      toast.error(ERROR_MESSAGES.errorDownloadingPT);
      console.error(ERROR_MESSAGES.errorDownloadingEN, error);
    } finally {
      setDownloadingId(null);
    }
  };

  const statusMessage = downloadingId
    ? 'Baixando PDF...'
    : processingType === 'close'
      ? 'Iniciando Fechamento...'
      : processingType === 'unclose'
        ? 'Revertendo Fechamento...'
        : null;

  return (
    <>
      <div className="my-6 flex justify-end">
        <Select
          defaultValue={currentYear.toString()}
          onValueChange={handleChange}
        >
          <SelectTrigger className="w-full cursor-pointer md:w-45">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {getLastFiveYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {statusMessage && (
        <div className="mb-4 flex items-center justify-end">
          <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm">
            <LoaderCircle className="h-4 w-4 animate-spin text-slate-500" />
            {statusMessage}
          </div>
        </div>
      )}
      {!isLoading && !data.length && <EmptyData />}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {isLoading ? (
          <Skeleton className="h-40 w-full rounded-md" />
        ) : (
          data.map(({ id, data, fechado, valor }) => (
            <FechamentoCard
              key={id}
              id={id}
              date={data}
              status={fechado ? 'fechado' : 'aberto'}
              value={valor}
              beforeLast={beforeLast}
              onHandleViewCard={handleViewCard}
              onHandleCloseCard={handleCloseCard}
              onHandleUnCloseCard={handleUnCloseCard}
              onHandleDownload={handleDownload}
              isDownloading={downloadingId === id}
              isClosing={processingId === id && processingType === 'close'}
              isUnclosing={processingId === id && processingType === 'unclose'}
            />
          ))
        )}
      </div>
    </>
  );
};
