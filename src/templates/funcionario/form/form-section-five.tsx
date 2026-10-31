import { ControlledInput } from '@/components/controlled-input';
import { UnControlledInput } from '@/components/uncontrolled-input';

interface iSectionFiveProps {
  estado: string;
  cidade: string;
  bairro: string;
  loading: boolean;
}

export const SectionFive = ({
  cidade,
  estado,
  bairro,
  loading,
}: iSectionFiveProps) => (
  <>
    <UnControlledInput
      name="estado"
      label="Estado"
      placeholder="preencha o cep para buscar"
      className="h-12 px-5"
      disabled={true}
      value={estado}
      loading={loading}
    />
    <UnControlledInput
      name="cidade"
      label="Cidade"
      placeholder="preencha o cep para buscar"
      className="h-12 px-5"
      disabled={true}
      value={cidade}
      loading={loading}
    />
    <UnControlledInput
      name="bairro"
      label="Bairro"
      placeholder="preencha o cep para buscar"
      className="h-12 px-5"
      disabled={true}
      value={bairro}
      loading={loading}
    />
    <ControlledInput
      name="complemento"
      label="Complemento"
      placeholder="ex: Próximo à padaria"
      className="h-12 px-5"
    />
  </>
);
