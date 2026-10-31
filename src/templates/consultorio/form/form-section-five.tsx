import { ControlledInput } from '@/components/controlled-input';
import { UnControlledInput } from '@/components/uncontrolled-input';

interface iSectionFiveProps {
  endereco: string;
  loading: boolean;
  onCepChange: (field: 'cep' | 'cep_entrega') => void;
}

export const SectionFive = ({
  endereco,
  loading,
  onCepChange,
}: iSectionFiveProps) => (
  <>
    <ControlledInput
      name="cep_entrega"
      label="Cep"
      placeholder="ex: 09078-580"
      className="h-12 px-5"
      mask="#####-###"
      onChange={() => onCepChange('cep_entrega')}
    />
    <UnControlledInput
      name="endereco_entrega"
      label="Endereço"
      placeholder="preencha o cep para buscar o endereço"
      className="h-12 px-5"
      disabled={true}
      value={endereco}
      loading={loading}
    />
    <ControlledInput
      name="numero_entrega"
      label="Número"
      placeholder="ex: 203"
      className="h-12 px-5"
    />
  </>
);
