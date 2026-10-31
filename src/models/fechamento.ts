import { iIdSingleProps } from './id';

export type fechamentoType = 'consultorio' | 'dentista';

export type iFechamentoProps = {
  params: Promise<{ slug: string }>;
};

export interface iFechamentoEntradaServico {
  id: string;
  data: string | undefined;
  nome: string;
  valor: number;
  quantidade: number;
  repeticao: number;
  desconto: number;
  total: number;
}

export interface iFechamentoEntradaItem {
  id: string;
  dentista?: string;
  consultorio?: string;
  paciente: string;
  servicos: iFechamentoEntradaServico[];
  sumEntrada: number;
}

export interface iFechamentoEntradaProps {
  type: fechamentoType;
  nome: string;
  itens: iFechamentoEntradaItem[];
  sumEntradas: number;
  desconto?: number;
  observacao?: string;
  fechamentoData?: Date | null;
}

export interface iFuncionarioFormPageProps extends iIdSingleProps {
  searchParams?:
    | Promise<{ [key: string]: string | string[] | undefined }>
    | { [key: string]: string | string[] | undefined };
}

export interface iFechamentoCloseProps {
  id?: string;
  date?: Date;
}
