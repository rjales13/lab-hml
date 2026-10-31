import { useEffect, useEffectEvent, useState } from 'react';
import { Button } from './ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { Input } from './ui/input';
import { applyMask } from '@/lib/utils/mask';
import { iCustomFieldProps } from '@/models/custom-field';
import { ERROR_MESSAGES } from '@/lib/messages/errors';
import { capitalize } from '@/lib/utils/capitalize';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { cn } from '@/lib/utils';
import { iListTabContentProps } from '@/models/list-tab-content';
import { monetaryFormat } from '@/lib/utils/monetaryFormat';

interface iListSheed extends Omit<iListTabContentProps, 'itens'> {
  oldData: string;
  open: boolean;
  getValue: (data: iCustomFieldProps) => void;
  setOpen: (s: boolean) => void;
}

export const ListSheet = ({
  type,
  commandData,
  oldData,
  fieldForm,
  fieldLabel,
  placeholder,
  mask,
  monetary,
  open,
  getValue,
  setOpen,
}: iListSheed) => {
  const [field, setField] = useState('');
  const [inputError, setInputError] = useState(false);
  const [msgError, setMsgError] = useState('');
  const [openCB, setOpenCB] = useState(false);

  const fieldLabelCapitalize = capitalize(fieldLabel);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (monetary) {
      setField(monetaryFormat(raw));
      return;
    }
    const mask = e.target.dataset?.mask;
    const masked = mask ? applyMask(raw, mask) : raw;
    setField(masked);
    setInputError(masked.trim().length === 0);
    if (masked.trim().length === 0) setMsgError(ERROR_MESSAGES.required);
  };

  const handleClose = () => {
    setField('');
    setInputError(false);
    setOpen(false);
  };

  const checkFieldOrComboBox = () => {
    if (type === 'input') {
      if (mask === '(##) #####-####') return field.trim().length >= 14; // Telefone
      // Check if value is greater than zero for monetary fields
      if (monetary)
        return (
          field &&
          typeof field === 'string' &&
          parseFloat(field.replace(/[^0-9,-]/g, '')?.replace(',', '.')) > 0
        );
      return field.trim().length > 0;
    }
    if (type === 'select') {
      return !!field;
    }
    return false;
  };

  const handleSubmit = () => {
    if (!checkFieldOrComboBox()) {
      setInputError(true);
      setMsgError(ERROR_MESSAGES.invalid);
      return;
    }

    getValue({
      idOrValue: field,
      action: 'save',
      oldIdOrValue: oldData,
      fieldForm,
    });

    handleClose();
  };

  const syncField = useEffectEvent(() => {
    if (open) setField(oldData);
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    syncField();
  }, [open, oldData]);

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Adicionar {fieldLabelCapitalize}</SheetTitle>
          <SheetDescription>
            Informe o {fieldLabel} no campo abaixo
          </SheetDescription>
        </SheetHeader>
        {type === 'input' && (
          <div className="flex flex-col gap-3 px-4">
            <Input
              id={fieldLabel}
              placeholder={placeholder}
              className="h-12 px-5"
              data-mask={mask}
              value={monetary ? monetaryFormat(String(field)) : field}
              onChange={handleChange}
            />
            {inputError && <p className="text-sm text-red-500">{msgError}</p>}
          </div>
        )}
        {type === 'select' && commandData && (
          <div className="flex flex-col gap-3 px-4">
            <Popover open={openCB} onOpenChange={setOpenCB}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCB}
                  className="cursor-pointer justify-between"
                >
                  {field
                    ? commandData.find(({ id }) => id === field)?.value
                    : 'Clique aqui para buscar'}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                <Command>
                  <CommandInput placeholder="Filtrar..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>Não há registros!</CommandEmpty>
                    <CommandGroup>
                      {commandData.map(({ id, value }) => (
                        <CommandItem
                          key={id}
                          value={value}
                          onSelect={() => {
                            setField(id === field ? '' : id);
                            setOpenCB(false);
                          }}
                          className="cursor-pointer"
                        >
                          {value}
                          <Check
                            className={cn(
                              'ml-auto',
                              field === id ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {inputError && <p className="text-sm text-red-500">{msgError}</p>}
          </div>
        )}

        <SheetFooter>
          <Button
            type="button"
            className="cursor-pointer"
            disabled={!checkFieldOrComboBox()}
            onClick={handleSubmit}
          >
            Salvar
          </Button>
          <SheetClose asChild>
            <Button variant="outline" className="cursor-pointer">
              Fechar
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
