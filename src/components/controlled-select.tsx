import { useController, useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from './ui/select';
import { cn } from '@/lib/utils';
import { Tootip } from './tootip';
import { iItensProps } from '@/models/itens';
import { Skeleton } from './ui/skeleton';

interface iSelect {
  value: string;
  description: string;
}

interface iControlledSelectProps {
  name: string;
  label: string;
  className?: string;
  items: iSelect[];
  tootip?: string;
  loading?: boolean;
  onChange?: ({ id, value }: iItensProps) => void;
}

export const ControlledSelect = ({
  name,
  label,
  className,
  items,
  tootip,
  loading,
  onChange,
}: iControlledSelectProps) => {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name, control });

  const handleChange = (value: string) => {
    field.onChange(value);
    onChange?.({ id: field.name, value });
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name} className="min-h-5 text-gray-700">
        {label}
        {tootip && <Tootip text={tootip} />}
      </Label>
      {loading ? (
        <Skeleton className={className} />
      ) : (
        <Select name={name} onValueChange={handleChange} value={field.value}>
          <SelectTrigger
            aria-label={label}
            id={name}
            className={cn('hover:bg-accent', className)}
          >
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {items.length &&
                items.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.description}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
      {fieldState.error && (
        <p className="text-sm text-red-500">{fieldState.error.message}</p>
      )}
    </div>
  );
};
