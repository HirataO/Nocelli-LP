/** Conteúdo institucional — extraído do site atual (nocelli.com.br). Itens "PENDENTE" precisam ser confirmados pela Nocelli. */
import { routes } from '../lib/routes';
import type { IconName } from '../types';

export const COMPANY = {
  name: 'Nocelli',
  since: 1984,
  logoUrl: 'https://nocelli.com.br/img/logo-nocelli.png', // hotlink do site atual; há fallback (wordmark) se não carregar
  address: {
    street: 'Av. Luiz Antônio de Oliveira, 180 e 186',
    district: 'Jundiapeba',
    city: 'Mogi das Cruzes',
    state: 'SP',
    zip: '08752-070',
  },
  phones: [
    { display: '(11) 2905-4081', href: 'tel:+551129054081' },
    { display: '(11) 2378-4190', href: 'tel:+551123784190' }, // aparece só no rodapé do site atual — confirmar
  ],
  whatsapp: { display: '(11) 99149-2876', number: '5511991492876' },
  email: null as string | null, // PENDENTE: o site atual oculta o e-mail
  social: [
    { label: 'Instagram', href: 'https://instagram.com/nocelli_maquinas' },
    { label: 'LinkedIn', href: 'https://linkedin.com/company/nocelli-maquinas-industriais' },
    { label: 'YouTube', href: 'https://youtube.com/c/NocelliMaquinas' },
    { label: 'Facebook', href: 'https://facebook.com/nocelli.maquinas' },
  ],
};

export interface NavItem { key: string; label: string; href: string }
export const NAV: NavItem[] = [
  { key: 'equipamentos', label: 'Equipamentos', href: routes.equipamentos() },
  { key: 'vender', label: 'Vender equipamento', href: routes.vender() },
  { key: 'nocelli', label: 'A Nocelli', href: routes.home('#a-nocelli') },
  { key: 'servicos', label: 'Serviços', href: routes.home('#servicos') },
  { key: 'contato', label: 'Contato', href: routes.home('#contato') },
];

export const SERVICES: { icon: IconName; title: string; text: string }[] = [
  { icon: 'factory', title: 'Compra e venda', text: 'Compra e venda de plantas industriais, equipamentos e máquinas.' },
  { icon: 'wrench', title: 'Desmontagem e remoção', text: 'Desmontagem e remoção de plantas industriais, com visita gratuita e sem compromisso.' },
  { icon: 'truck', title: 'Transporte', text: 'Transporte de máquinas e equipamentos.' },
  { icon: 'recycle', title: 'Reciclagem', text: 'Soluções em reciclagem para equipamentos desativados.' },
];

export const DIFFERENTIALS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'shield-check', title: 'Compliance e transparência', text: 'Política de compliance e código de ética aplicados aos colaboradores e às empresas envolvidas nos processos de aquisição.' },
  { icon: 'leaf', title: 'Compromisso social', text: 'Cumprimento de requisitos de segurança e meio ambiente em todos os processos.' },
  { icon: 'clock', title: 'Prazos cumpridos', text: 'Projetos executados dentro dos prazos definidos em contrato.' },
];

export const SEGMENTS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'package', title: 'Alimentício', text: 'Doces, molhos, conservas, óleos vegetais, laticínios e produtos farináceos.' },
  { icon: 'droplet', title: 'Cosmético', text: 'Equipamentos para a indústria cosmética.' },
  { icon: 'pill', title: 'Farmacêutico', text: 'Equipamentos para a indústria farmacêutica.' },
  { icon: 'flask', title: 'Químico', text: 'Tintas, petroquímica e produtos de limpeza.' },
];

/** Opções EXATAS pedidas no briefing para o campo "Ramo de atividade". */
export const SELL_ACTIVITIES: string[] = ['Alimentício', 'Cosméticos', 'Farmacêutico', 'Particular', 'Químico', 'Veterinário', 'Outros'];

export const SELL_STEPS: { title: string; text: string }[] = [
  { title: 'Você nos conta sobre o equipamento', text: 'Preencha o formulário com seus dados e observações.' },
  { title: 'Visita gratuita e sem compromisso', text: 'Nossa equipe avalia as possibilidades de negociação.' },
  { title: 'Proposta de compra', text: 'O equipamento também pode entrar como parte do pagamento de outra máquina.' },
  { title: 'Desmontagem e remoção', text: 'A Nocelli cuida da desmontagem e da retirada do equipamento.' },
];

export const WHAT_WE_BUY: string[] = [
  'Máquinas e equipamentos desativados',
  'Plantas, indústrias e setores completos',
  'Compressoras, encapsuladoras, encartuchadoras, envasadoras, misturadores, moinhos, rotuladoras, tanques e reatores',
];

export function formatAddress(): string {
  const a = COMPANY.address;
  return `${a.street} — ${a.district}, ${a.city} – ${a.state}, CEP ${a.zip}`;
}
