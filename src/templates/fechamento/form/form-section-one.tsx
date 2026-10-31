import { ControlledText } from '@/components/controlled-text';

export const SectionOne = () => (
  <>
    <ControlledText
      name="observacao"
      label="Observação"
      placeholder="ex: Desconto de 10% para pagamento à vista"
      className="h-30"
    />
  </>
);
