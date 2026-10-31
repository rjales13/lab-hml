import React from 'react';
import { Pencil, Plus, Trash } from 'lucide-react';
import { Button } from './ui/button';
import { Item, ItemActions, ItemContent, ItemDescription } from './ui/item';
import { iCustomFieldProps } from '@/models/custom-field';
import { iItensProps } from '@/models/itens';
import { EmptyData } from './empty-data';

interface iListProps {
  itens: iItensProps[];
  fieldForm: string;
  children: React.ReactNode;
  onAction: (data: iCustomFieldProps) => void;
}

export const List = ({ itens, children, fieldForm, onAction }: iListProps) => {
  return (
    <div className="flex w-full flex-col gap-6 md:px-20">
      <div className="flex w-full justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-10 w-auto cursor-pointer border-2 text-blue-950 transition-shadow duration-300 hover:bg-gray-50"
          onClick={() => onAction({ action: 'new' })}
          title="inserir novo registro"
        >
          <Plus />
        </Button>
      </div>
      {!itens.length ? (
        <EmptyData />
      ) : (
        itens.map(({ id, value }) => (
          <Item key={id} variant="outline">
            <ItemContent>
              <ItemDescription>{value}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button
                type="button"
                className="cursor-pointer text-blue-950 transition-shadow duration-300 hover:bg-gray-200"
                variant="outline"
                size="sm"
                title="Editar"
                onClick={() =>
                  onAction({ idOrValue: id, fieldForm, action: 'edit' })
                }
              >
                <Pencil />
              </Button>
              <Button
                type="button"
                className="cursor-pointer text-red-600 transition-shadow duration-300 hover:bg-gray-200"
                variant="outline"
                size="sm"
                title="Excluir"
                onClick={() =>
                  onAction({ idOrValue: id, fieldForm, action: 'delete' })
                }
              >
                <Trash />
              </Button>
            </ItemActions>
          </Item>
        ))
      )}
      {children}
    </div>
  );
};
