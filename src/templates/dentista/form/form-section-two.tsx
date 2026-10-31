import { ControlledInput } from '@/components/controlled-input';

export const SectionTwo = () => (
  <>
    <ControlledInput
      name="cro"
      label="CRO"
      placeholder="ex: 20987266"
      className="h-12 px-5"
    />
    <ControlledInput
      name="email"
      label="E-mail"
      placeholder="ex: marcelo@gmail.com"
      className="h-12 px-5"
    />
  </>
);
