import { ControlledInput } from '@/components/controlled-input';

export const SectionTwo = () => (
  <>
    <ControlledInput
      name="rg"
      label="RG"
      placeholder="ex: 123456789"
      className="h-12 px-5"
    />
    <ControlledInput
      name="cpf"
      label="CPF"
      placeholder="ex: 123.456.789-00"
      className="h-12 px-5"
      mask="###.###.###-##"
    />
  </>
);
