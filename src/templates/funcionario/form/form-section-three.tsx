import { ControlledInput } from '@/components/controlled-input';

export const SectionThree = () => (
  <>
    <ControlledInput
      name="data_nascimento"
      label="Data de Nascimento"
      placeholder="ex: 01/01/1990"
      className="h-12 px-5"
      mask="##/##/####"
    />
    <ControlledInput
      name="data_admissao"
      label="Data de Admissão"
      placeholder="ex: 01/01/2020"
      className="h-12 px-5"
      mask="##/##/####"
    />
    <ControlledInput
      name="data_recisao"
      label="Data de Rescisão"
      placeholder="ex: 01/01/2025"
      className="h-12 px-5"
      mask="##/##/####"
    />
  </>
);
