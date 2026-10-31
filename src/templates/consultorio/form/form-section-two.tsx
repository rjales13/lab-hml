import { ControlledInput } from '@/components/controlled-input';
import { ControlledSelect } from '@/components/controlled-select';
import { UnControlledInput } from '@/components/uncontrolled-input';

const itensCobranca = [
  {
    value: 'consultorio',
    description: 'Consultório',
  },
  {
    value: 'dentista',
    description: 'Dentista',
  },
];

interface iSectionTwoProps {
  endereco: string;
  loading: boolean;
  onCepChange: (field: 'cep' | 'cep_entrega') => void;
}

export const SectionTwo = ({
  endereco,
  loading,
  onCepChange,
}: iSectionTwoProps) => (
  <>
    <ControlledSelect
      name="cobranca"
      label="Cobrança"
      className="h-12! w-full cursor-pointer px-5"
      items={itensCobranca}
    />

    <ControlledInput
      name="cep"
      label="Cep"
      placeholder="ex: 09078-580"
      className="h-12 px-5"
      mask="#####-###"
      onChange={() => onCepChange('cep')}
    />
    <UnControlledInput
      name="endereco"
      label="Endereço"
      placeholder="preencha o cep para buscar o endereço"
      className="h-12 px-5"
      value={endereco}
      disabled={true}
      loading={loading}
    />
    <ControlledInput
      name="numero"
      label="Número"
      placeholder="ex: 203"
      className="h-12 px-5"
    />
  </>
);
