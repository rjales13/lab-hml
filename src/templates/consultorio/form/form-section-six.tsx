import { ControlledInput } from '@/components/controlled-input';
import { UnControlledInput } from '@/components/uncontrolled-input';

interface iSectionSixProps {
  estado: string;
  cidade: string;
  bairro: string;
  loading: boolean;
}

export const SectionSix = ({
  estado,
  cidade,
  bairro,
  loading,
}: iSectionSixProps) => (
  <>
    <UnControlledInput
      name="estado_entrega"
      label="Estado"
      placeholder="preencha o cep para buscar"
      className="h-12 px-5"
      disabled={true}
      value={estado}
      loading={loading}
    />
    <UnControlledInput
      name="cidade_entrega"
      label="Cidade"
      placeholder="preencha o cep para buscar"
      className="h-12 px-5"
      disabled={true}
      value={cidade}
      loading={loading}
    />
    <UnControlledInput
      name="bairro_entrega"
      label="Bairro"
      placeholder="preencha o cep para buscar"
      className="h-12 px-5"
      disabled={true}
      value={bairro}
      loading={loading}
    />
    <ControlledInput
      name="complemento_entrega"
      label="Complemento"
      placeholder="ex: Próximo à padaria"
      className="h-12 px-5"
    />
  </>
);
