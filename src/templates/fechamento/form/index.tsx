import { AboutSection } from '@/components/about-section';
import { ReceiptText } from 'lucide-react';
import { Form } from './form';
import { iSelectedIdProps } from '@/models/selected';
import {
  getFechamentoByConsultorioDentista,
  getFechamentosByConsultorioOrDentista,
} from '../actions';

interface iFechamentoFormTemplateProps extends iSelectedIdProps {
  fechamentoId: string | undefined;
}

export const FechamentoFormTemplate = async ({
  selectedId,
  fechamentoId,
}: iFechamentoFormTemplateProps) => {
  const type =
    selectedId.substring(0, 1) === 'c'
      ? ('consultorio' as const)
      : ('dentista' as const);

  const actualId = selectedId.substring(1);

  const result = await getFechamentosByConsultorioOrDentista({
    id: actualId,
    fechamentoId,
    type,
  });

  const data = fechamentoId
    ? await getFechamentoByConsultorioDentista({
        fechamentoId,
        id: actualId,
        type,
      })
    : null;

  return (
    <>
      <AboutSection
        title="Fechamento"
        subtitle="Informações do fechamento selecionado"
        icon={ReceiptText}
      />
      <Form
        result={result}
        idConsultorioDentista={actualId}
        fechamentoId={fechamentoId}
        type={type}
        data={data}
      />
    </>
  );
};
