import { ControlledInput } from '@/components/controlled-input';

export const SectionOne = () => (
  <>
    <ControlledInput
      name="data"
      label="Data"
      placeholder="ex: 01/01/2026"
      className="h-12 px-5"
      type="date"
    />
  </>
);
