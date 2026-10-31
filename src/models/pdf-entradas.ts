interface servicos {
  nome: string;
  quantidade: number;
  data_previsao: Date;
}

export interface iPdfEntradasItens {
  servico: servicos[];
  funcionario: string;
}

export interface iPdfEntradasProps extends iPdfEntradasItens {
  id: string;
  consultorio: string;
  dentista: string;
  paciente: string;
}
