import {
  BadgeDollarSign,
  CircleDollarSign,
  DollarSign,
  Receipt,
  SquarePen,
} from 'lucide-react';

export const TABS = [
  { value: 'dados', description: 'Dados', icon: SquarePen },
  {
    value: 'valor_sem_nota',
    description: 'Valores Sem Nota',
    icon: Receipt,
  },
  {
    value: 'valor_com_nota',
    description: 'Valores Com Nota',
    icon: DollarSign,
  },
  {
    value: 'valor_unicid',
    description: 'Valores Unicid',
    icon: BadgeDollarSign,
  },
  {
    value: 'valor_pinheros',
    description: 'Valores Pinheros',
    icon: CircleDollarSign,
  },
];
