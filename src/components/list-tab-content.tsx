import { useCustomField } from '@/hooks/custom-field';
import { List } from './list';
import { ListSheet } from './list-sheet';
import { useState } from 'react';
import { iListTabContentProps } from '@/models/list-tab-content';
import { Skeleton } from './ui/skeleton';
import { monetaryFormat } from '@/lib/utils/monetaryFormat';

export const ListTabContent = ({
  type,
  commandData,
  isPending,
  itens,
  placeholder,
  mask,
  monetary,
  fieldForm,
  fieldLabel,
}: iListTabContentProps) => {
  const [fieldToEdit, setFieldToEdit] = useState('');
  const [openSheet, setOpenSheet] = useState(false);

  const { handleCustomField } = useCustomField({
    setFieldToEdit,
    setOpenSheet,
  });

  const newItens = itens.map((item) => {
    if (type === 'input') {
      const newValueItem = monetary ? monetaryFormat(String(item)) : item;
      return { id: item, value: newValueItem };
    }
    if (type === 'select' && commandData) {
      const found = commandData.find((data) => data.id === item);
      return { id: item, value: found ? found.value : '' };
    }
  }) as { id: string; value: string }[];

  if (isPending) return <Skeleton className="h-40 w-full rounded-md" />;

  return (
    <List itens={newItens} onAction={handleCustomField} fieldForm={fieldForm}>
      <ListSheet
        type={type}
        commandData={commandData}
        oldData={fieldToEdit}
        fieldForm={fieldForm}
        fieldLabel={fieldLabel}
        placeholder={placeholder}
        mask={mask}
        monetary={monetary}
        getValue={handleCustomField}
        open={openSheet}
        setOpen={setOpenSheet}
      />
    </List>
  );
};
