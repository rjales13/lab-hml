import {
  BriefcaseBusiness,
  Contact,
  Headset,
  Hospital,
  House,
  ListTodo,
  Motorbike,
  ReceiptText,
  Stethoscope,
  Syringe,
  Wrench,
} from 'lucide-react';

const homeFeature = [
  {
    title: 'Home',
    description: 'Página inicial',
    icon: House,
    link: '/',
    adminOnly: false,
  },
];

const itensFeatures = [
  {
    title: 'Consultórios',
    description: 'Cadastro Consultórios',
    icon: Hospital,
    link: '/consultorio',
  },
  {
    title: 'Dentistas',
    description: 'Cadastro Dentistas',
    icon: Stethoscope,
    link: '/dentista',
  },
  {
    title: 'Especialidades',
    description: 'Cadastro Especialidades',
    icon: Syringe,
    link: '/especialidade',
  },
  {
    title: 'Secretárias',
    description: 'Cadastro Secretárias',
    icon: Headset,
    link: '/secretaria',
  },
  {
    title: 'Funções',
    description: 'Cadastro Funções',
    icon: BriefcaseBusiness,
    link: '/funcao',
  },
  {
    title: 'Funcionários',
    description: 'Cadastro Funcionários',
    icon: Contact,
    link: '/funcionario',
  },
  {
    title: 'Serviços',
    description: 'Cadastro Serviços',
    icon: Wrench,
    link: '/servico',
  },
  {
    title: 'Entradas',
    description: 'Lançamento de Entradas',
    icon: ListTodo,
    link: '/entrada',
  },
  {
    title: 'Roteiros',
    description: 'Planejamento de Roteiros',
    icon: Motorbike,
    link: '/roteiro',
  },
  {
    title: 'Fechamento',
    description: 'Fechamento Mensal',
    icon: ReceiptText,
    link: '/fechamento',
    adminOnly: true,
  },
].sort((a, b) => a.title.localeCompare(b.title));

export const features = [...homeFeature, ...itensFeatures];
