import { useController, useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { useEffect, useEffectEvent, useState } from 'react';
import { iOnChangeCommandDataProps } from '@/models/on-change-command-data';
import { Skeleton } from './ui/skeleton';
import { iItensProps } from '@/models/itens';

interface iControlledComboBoxProps {
  name: string;
  label: string;
  placeholder: string;
  className?: string;
  idValue?: string;
  itens: iItensProps[];
  loading?: boolean;
  disabled?: boolean;
  onChange?: ({ field, id }: iOnChangeCommandDataProps) => void;
}

export const ControlledComboBox = ({
  name,
  label,
  placeholder,
  className,
  idValue,
  itens,
  loading,
  disabled,
  onChange,
}: iControlledComboBoxProps) => {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name, control });

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(idValue || '');

  const handleChange = (currentValue: string) => {
    const newValue = currentValue === value ? '' : currentValue;
    setValue(newValue);
    setOpen(false);
    field.onChange(newValue);
    onChange?.({
      field: field.name,
      id: newValue,
    });
  };

  const syncField = useEffectEvent(() => {
    setValue(idValue || '');
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    syncField();
  }, [idValue]);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name} className="min-h-5 text-gray-700">
        {label}
      </Label>
      {loading ? (
        <Skeleton className={className} />
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={name}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                value ? 'text-accent-foreground! font-normal' : '',
                className
              )}
              disabled={disabled}
            >
              {value
                ? itens.find(({ id }) => id === value)?.value
                : 'Selecione'}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
            <Command>
              <CommandInput placeholder={placeholder} className="h-9" />
              <CommandList>
                <CommandEmpty>Não há registos</CommandEmpty>
                <CommandGroup>
                  {itens.map(({ id, value }) => (
                    <CommandItem
                      key={id}
                      value={value}
                      className="cursor-pointer"
                      onSelect={() => handleChange(id)}
                    >
                      {value}
                      <Check
                        className={cn(
                          'ml-auto',
                          id === idValue ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
      {fieldState.error && (
        <p className="text-sm text-red-500">{fieldState.error.message}</p>
      )}
    </div>
  );
};
