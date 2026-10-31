// Define types for the grouped structure
type Servico = {
  id: string;
  nome: string;
};

type PacienteGroup = {
  nome: string;
  servicos: Servico[];
};

type DentistaGroup = {
  nome: string;
  pacientes: Record<string, PacienteGroup>;
};

type ConsultorioGroup = {
  nome: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  dentistas: Record<string, DentistaGroup>;
};

export type GroupedData = Record<string, ConsultorioGroup>;

interface iServicos {
  id: string;
  nome: string;
}

export interface iPdfRoteiroItems {
  id: string;
  consultorio: string;
  cep: string;
  endereco: string;
  complemento: string;
  numero: string;
  bairro: string;
  dentista: string;
  paciente: string;
  servicos: iServicos[];
}

export interface iPdfRoteiroProps {
  data: string;
  observacao?: string;
  items: iPdfRoteiroItems[];
}
