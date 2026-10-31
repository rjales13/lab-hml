import { ControlledInput } from '@/components/controlled-input';
import { UnControlledInput } from '@/components/uncontrolled-input';

interface iSectionFourProps {
  endereco: string;
  loading: boolean;
  onCepChange: () => void;
}

export const SectionFour = ({
  endereco,
  loading,
  onCepChange,
}: iSectionFourProps) => (
  <>
    <ControlledInput
      name="cep"
      label="Cep"
      placeholder="ex: 09078-580"
      className="h-12 px-5"
      mask="#####-###"
      onChange={onCepChange}
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
