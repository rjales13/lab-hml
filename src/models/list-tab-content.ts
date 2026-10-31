import { iItensProps } from './itens';

export interface iListTabContentProps {
  type: 'input' | 'select';
  commandData?: iItensProps[];
  isPending?: boolean;
  itens: string[] | number[];
  placeholder?: string;
  mask?: string;
  monetary?: boolean;
  fieldForm: string;
  fieldLabel: string;
}
