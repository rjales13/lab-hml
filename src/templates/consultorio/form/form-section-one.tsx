import { ControlledInput } from '@/components/controlled-input';

export const SectionOne = () => (
  <>
    <ControlledInput
      name="nome"
      label="Nome"
      placeholder="ex: Consultorio São Paulo"
      className="h-12 px-5"
    />
    <ControlledInput
      name="email"
      label="E-mail"
      placeholder="ex: csp@gmail.com"
      className="h-12 px-5"
    />
  </>
);
