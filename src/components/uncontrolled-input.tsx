import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from './ui/skeleton';

interface iUnControlledInputProps {
  name: string;
  label: string;
  placeholder: string;
  className: string;
  value: string;
  disabled?: boolean;
  loading?: boolean;
}

export const UnControlledInput = ({
  name,
  label,
  placeholder,
  className,
  value,
  disabled,
  loading,
}: iUnControlledInputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name} className="min-h-5 text-gray-700">
        {label}
      </Label>
      {loading && <Skeleton className={className} />}
      {!loading && (
        <Input
          id={name}
          placeholder={placeholder}
          aria-label={label}
          className={className}
          autoComplete="off"
          disabled={disabled}
          value={value}
        />
      )}
    </div>
  );
};
