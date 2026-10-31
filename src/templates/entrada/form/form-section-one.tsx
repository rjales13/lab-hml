import { ControlledComboBox } from '@/components/controlled-combo-box';
import { ControlledInput } from '@/components/controlled-input';
import { iItensProps } from '@/models/itens';
import { iOnChangeCommandDataProps } from '@/models/on-change-command-data';

interface iSectionOneProps {
  consultorioData: iItensProps[];
  dentistaData: iItensProps[];
  isLoadingConsultorio: boolean;
  isLoadingDentista: boolean;
  consultorioId: string;
  dentistaId: string;
  handleConsultorioChange: (id: string) => void;
  handleDentistaChange: (id: string) => void;
}

export const SectionOne = ({
  consultorioData,
  dentistaData,
  isLoadingConsultorio,
  isLoadingDentista,
  consultorioId,
  dentistaId,
  handleConsultorioChange,
  handleDentistaChange,
}: iSectionOneProps) => {
  const handleConsultorioOnChange = ({ id }: iOnChangeCommandDataProps) => {
    handleConsultorioChange(id);
    handleDentistaChange('');
  };

  const handleDentistaOnChange = ({ id }: iOnChangeCommandDataProps) => {
    handleDentistaChange(id);
  };

  return (
    <>
      <ControlledComboBox
        name="consultorio"
        idValue={consultorioId}
        label="Consultório"
        placeholder="Procure o consultório"
        className="text-muted-foreground h-12 cursor-pointer justify-between text-sm font-normal"
        itens={consultorioData}
        loading={isLoadingConsultorio}
        onChange={handleConsultorioOnChange}
      />
      <ControlledComboBox
        name="dentista"
        idValue={dentistaId}
        label="Dentista"
        placeholder="Procure o dentista"
        className="text-muted-foreground h-12 cursor-pointer justify-between text-sm font-normal"
        itens={dentistaData}
        loading={isLoadingDentista}
        disabled={!consultorioId}
        onChange={handleDentistaOnChange}
      />
      <ControlledInput
        name="paciente"
        label="Paciente"
        placeholder="ex: João da Silva"
        className="h-12 px-5"
      />
    </>
  );
};
