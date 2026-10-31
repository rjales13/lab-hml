import { ControlledInput } from '@/components/controlled-input';

export const SectionOne = () => (
  <>
    <ControlledInput
      name="nome"
      label="Nome"
      placeholder="ex: Rafaela Silva"
      className="h-12 px-5"
    />
    <ControlledInput
      name="email"
      label="E-mail"
      placeholder="ex: rafaela@gmail.com"
      className="h-12 px-5"
    />
  </>
);
