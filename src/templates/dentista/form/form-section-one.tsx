import { ControlledInput } from '@/components/controlled-input';

export const SectionOne = () => (
  <>
    <ControlledInput
      name="nome"
      label="Nome"
      placeholder="ex: Marcelo Jales"
      className="h-12 px-5"
    />
  </>
);
