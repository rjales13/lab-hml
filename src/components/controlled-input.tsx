import { useController, useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { applyMask } from '@/lib/utils/mask';
import { Tootip } from './tootip';

type tInputProps = React.InputHTMLAttributes<HTMLInputElement>;

interface iControlledInputProps extends tInputProps {
  name: string;
  label: string;
  mask?: string;
  tootip?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ControlledInput = ({
  name,
  label,
  placeholder,
  className,
  type = 'text',
  hidden,
  mask,
  tootip,
  disabled,
  onChange,
}: iControlledInputProps) => {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name, control });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const masked = mask ? applyMask(raw, mask) : raw;
    field.onChange(masked);
    onChange?.(e);
  };

  return (
    <div className={hidden ? 'hidden' : 'flex flex-col gap-2'}>
      <Label htmlFor={name} className="min-h-5 text-gray-700">
        {label}
        {tootip && <Tootip text={tootip} />}
      </Label>
      <Input
        id={name}
        placeholder={placeholder}
        aria-label={label}
        className={className}
        type={type}
        autoComplete="off"
        disabled={disabled}
        {...field}
        onChange={handleChange}
      />
      {fieldState.error && (
        <p className="text-sm text-red-500">{fieldState.error.message}</p>
      )}
    </div>
  );
};
