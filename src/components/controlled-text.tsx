import { useController, useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Tootip } from './tootip';
import { Textarea } from './ui/textarea';

type tTextProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

interface iControlledTextProps extends tTextProps {
  name: string;
  label: string;
  tootip?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const ControlledText = ({
  name,
  label,
  placeholder,
  className,
  hidden,
  tootip,
  onChange,
}: iControlledTextProps) => {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name, control });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    field.onChange(e);
    onChange?.(e);
  };

  return (
    <div className={hidden ? 'hidden' : 'flex flex-col gap-2'}>
      <Label htmlFor={name} className="min-h-5 text-gray-700">
        {label}
        {tootip && <Tootip text={tootip} />}
      </Label>
      <Textarea
        id={name}
        placeholder={placeholder}
        aria-label={label}
        className={className}
        autoComplete="off"
        {...field}
        onChange={handleChange}
      />
      {fieldState.error && (
        <p className="text-sm text-red-500">{fieldState.error.message}</p>
      )}
    </div>
  );
};
