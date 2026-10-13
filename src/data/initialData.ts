import { BlockType, ResidentProfile, TaskProposal, TaskCategory, UrgencyLevel, TaskStatus } from '../types';

export const BUILDING_FACADE_IMAGE = '/src/assets/images/condo_building_facade_1791507292885.jpg';

export const RESIDENT_AVATARS = {
  renan: '/src/assets/images/avatar_renan_resident_1791507302400.jpg',
  beatriz: '/src/assets/images/avatar_beatriz_resident_1791507311657.jpg',
  carlos: '/src/assets/images/avatar_carlos_resident_1791507320662.jpg',
  helena: '/src/assets/images/avatar_helena_resident_1791507328811.jpg',
};

// Generate list of all 96 apartments in the Condominium (101 to 1204)
export function generateApartmentList(): Array<{ id: string; block: BlockType; apartmentNumber: string; floor: number; label: string }> {
  const apartments: Array<{ id: string; block: BlockType; apartmentNumber: string; floor: number; label: string }> = [];
  const blocks: BlockType[] = ['A', 'B'];

  for (const block of blocks) {
    // 12 floors with 4 apartments each (101-104 up to 1201-1204) = 48 per block
    for (let floor = 1; floor <= 12; floor++) {
      for (let unit = 1; unit <= 4; unit++) {
        const aptNumber = `${floor}${unit < 10 ? '0' + unit : unit}`;
        apartments.push({
          id: `${block}-${aptNumber}`,
          block,
          apartmentNumber: aptNumber,
          floor,
          label: `Bloco ${block} - Apto ${aptNumber}`,
        });
      }
    }
  }

  return apartments;
}

export const CATEGORY_DETAILS: Record<
  TaskCategory,
  { label: string; iconName: string; colorClass: string; bgClass: string; borderClass: string }
> = {
  seguranca: {
    label: 'Segurança & Portaria',
    iconName: 'ShieldAlert',
    colorClass: 'text-rose-700',
    bgClass: 'bg-rose-50',
    borderClass: 'border-rose-200',
  },
  elevadores: {
    label: 'Elevadores',
    iconName: 'ArrowUpDown',
    colorClass: 'text-amber-700',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
  },
  garagem: {
    label: 'Garagem & Estacionamento',
    iconName: 'Car',
    colorClass: 'text-sky-700',
    bgClass: 'bg-sky-50',
    borderClass: 'border-sky-200',
  },
  lazer_piscina: {
    label: 'Lazer & Salão de Festas',
    iconName: 'Waves',
    colorClass: 'text-cyan-700',
    bgClass: 'bg-cyan-50',
    borderClass: 'border-cyan-200',
  },
  fachada_estrutura: {
    label: 'Fachada & Estrutura',
    iconName: 'Building2',
    colorClass: 'text-indigo-700',
    bgClass: 'bg-indigo-50',
    borderClass: 'border-indigo-200',
  },
  eletrica_hidraulica: {
    label: 'Elétrica & Hidráulica',
    iconName: 'Zap',
    colorClass: 'text-orange-700',
    bgClass: 'bg-orange-50',
    borderClass: 'border-orange-200',
  },
  jardim_areas_comuns: {
    label: 'Jardim & Áreas Comuns',
    iconName: 'Trees',
    colorClass: 'text-emerald-700',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-200',
  },
  sustentabilidade: {
    label: 'Sustentabilidade & Energia',
    iconName: 'Sun',
    colorClass: 'text-teal-700',
    bgClass: 'bg-teal-50',
    borderClass: 'border-teal-200',
  },
  outros: {
    label: 'Outras Melhorias',
    iconName: 'Wrench',
    colorClass: 'text-slate-700',
    bgClass: 'bg-slate-50',
    borderClass: 'border-slate-200',
  },
};

export const URGENCY_DETAILS: Record<
  UrgencyLevel,
  { label: string; badgeClass: string; dotClass: string }
> = {
  urgente: {
    label: 'Urgência Máxima',
    badgeClass: 'bg-red-100 text-red-800 border-red-200',
    dotClass: 'bg-red-500',
  },
  alta: {
    label: 'Alta Prioridade',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    dotClass: 'bg-amber-500',
  },
  media: {
    label: 'Média Prioridade',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    dotClass: 'bg-blue-500',
  },
  baixa: {
    label: 'Baixa Prioridade',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    dotClass: 'bg-slate-400',
  },
};

export const STATUS_DETAILS: Record<
  TaskStatus,
  { label: string; badgeClass: string; description: string }
> = {
  em_votacao: {
    label: 'Em Votação Aberta',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-500/20',
    description: 'Moradores podem registrar seus votos nesta proposta.',
  },
  analise_sindico: {
    label: 'Em Análise pelo Síndico',
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-300 ring-1 ring-purple-500/20',
    description: 'Levantando orçamentos técnicos para apresentação.',
  },
  aprovada_assembleia: {
    label: 'Aprovada em Assembleia',
    badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-300 ring-1 ring-indigo-500/20',
    description: 'Item votado e homologado pelos condôminos.',
  },
  em_execucao: {
    label: 'Obras / Em Execução',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-500/20',
    description: 'Serviço contratado e em andamento no condomínio.',
  },
  concluida: {
    label: 'Concluída',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    description: 'Melhoria finalizada e entregue aos moradores.',
  },
};

// Initial realistic resident profiles
export const INITIAL_RESIDENTS: Record<string, ResidentProfile> = {
  'A-101': {
    id: 'A-101',
    block: 'A',
    apartmentNumber: '101',
    floor: 1,
    residentName: 'Renan Braga Vieira',
    phone: '(11) 98765-4321',
    email: 'renanbragavieira@hotmail.com',
    occupancyType: 'proprietario_residente',
    avatarUrl: RESIDENT_AVATARS.renan,
    registeredAt: '2025-01-10T10:00:00Z',
    updatedAt: '2026-08-20T14:30:00Z',
  },
  'A-304': {
    id: 'A-304',
    block: 'A',
    apartmentNumber: '304',
    floor: 3,
    residentName: 'Beatriz Vasconcelos',
    phone: '(11) 97123-8899',
    email: 'beatriz.vasc@gmail.com',
    occupancyType: 'proprietario_residente',
    avatarUrl: RESIDENT_AVATARS.beatriz,
    registeredAt: '2025-02-15T09:00:00Z',
    updatedAt: '2026-06-11T11:00:00Z',
  },
  'B-502': {
    id: 'B-502',
    block: 'B',
    apartmentNumber: '502',
    floor: 5,
    residentName: 'Carlos Eduardo Mendes',
    phone: '(11) 98456-7890',
    email: 'carlos.mendes@empresa.com.br',
    occupancyType: 'inquilino',
    avatarUrl: RESIDENT_AVATARS.carlos,
    registeredAt: '2025-03-01T15:20:00Z',
    updatedAt: '2026-07-05T18:00:00Z',
  },
  'B-1003': {
    id: 'B-1003',
    block: 'B',
    apartmentNumber: '1003',
    floor: 10,
    residentName: 'Dra. Helena Martins',
    phone: '(11) 99112-3344',
    email: 'helena.martins.med@uol.com.br',
    occupancyType: 'proprietario_residente',
    avatarUrl: RESIDENT_AVATARS.helena,
    registeredAt: '2025-01-05T08:00:00Z',
    updatedAt: '2026-08-15T10:00:00Z',
  },
};

// Realistic initial condominium task proposals with votes from different apartments
export const INITIAL_TASKS: TaskProposal[] = [
  {
    id: 'task-1',
    title: 'Modernização e Manutenção Preventiva dos Elevadores (Blocos A e B)',
    description: 'Substituição dos cabos de tração, revisão dos quadros de comando elétrico e troca do piso interno dos 4 elevadores sociais e de serviço.',
    category: 'elevadores',
    urgency: 'urgente',
    status: 'em_votacao',
    location: 'Torres A e B - Elevadores',
    estimatedCostRange: 'R$ 18.000 - R$ 24.000',
    createdByResidentId: 'A-101',
    createdByName: 'Renan Braga Vieira',
    createdByBlock: 'A',
    createdByApartment: '101',
    createdAt: '2026-08-10T14:20:00Z',
    targetAssemblyDate: '2026-09-15',
    votes: [
      { residentId: 'A-101', residentName: 'Renan Braga Vieira', block: 'A', apartmentNumber: '101', avatarUrl: RESIDENT_AVATARS.renan, votedAt: '2026-08-10T14:22:00Z' },
      { residentId: 'A-201', residentName: 'Morador A-201', block: 'A', apartmentNumber: '201', votedAt: '2026-08-10T15:00:00Z' },
      { residentId: 'A-304', residentName: 'Beatriz Vasconcelos', block: 'A', apartmentNumber: '304', avatarUrl: RESIDENT_AVATARS.beatriz, votedAt: '2026-08-10T16:10:00Z' },
      { residentId: 'A-702', residentName: 'Morador A-702', block: 'A', apartmentNumber: '702', votedAt: '2026-08-11T09:30:00Z' },
      { residentId: 'A-1104', residentName: 'Morador A-1104', block: 'A', apartmentNumber: '1104', votedAt: '2026-08-11T11:45:00Z' },
      { residentId: 'B-203', residentName: 'Morador B-203', block: 'B', apartmentNumber: '203', votedAt: '2026-08-11T13:20:00Z' },
      { residentId: 'B-502', residentName: 'Carlos Eduardo Mendes', block: 'B', apartmentNumber: '502', avatarUrl: RESIDENT_AVATARS.carlos, votedAt: '2026-08-11T18:00:00Z' },
      { residentId: 'B-801', residentName: 'Morador B-801', block: 'B', apartmentNumber: '801', votedAt: '2026-08-12T10:15:00Z' },
      { residentId: 'B-1003', residentName: 'Dra. Helena Martins', block: 'B', apartmentNumber: '1003', avatarUrl: RESIDENT_AVATARS.helena, votedAt: '2026-08-12T14:40:00Z' },
      { residentId: 'B-1204', residentName: 'Morador B-1204', block: 'B', apartmentNumber: '1204', votedAt: '2026-08-13T08:10:00Z' },
    ],
    comments: [
      {
        id: 'c-1',
        residentId: 'B-1003',
        residentName: 'Dra. Helena Martins',
        block: 'B',
        apartmentNumber: '1003',
        avatarUrl: RESIDENT_AVATARS.helena,
        text: 'Excelente iniciativa! O elevador social do Bloco B apresentou trancos na semana passada. Precisamos levar essa cotação já para a assembleia.',
        createdAt: '2026-08-12T14:45:00Z',
      },
      {
        id: 'c-2',
        residentId: 'A-304',
        residentName: 'Beatriz Vasconcelos',
        block: 'A',
        apartmentNumber: '304',
        avatarUrl: RESIDENT_AVATARS.beatriz,
        text: 'Apoio totalmente. Segurança em primeiro lugar para todos os 96 apartamentos.',
        createdAt: '2026-08-13T09:00:00Z',
      },
    ],
  },
  {
    id: 'task-2',
    title: 'Reconhecimento Facial na Portaria e Tags Veiculares na Garagem',
    description: 'Instalação de leitores faciais nos portões de pedestres dos Blocos A e B e abertura automática por tag no portão da garagem.',
    category: 'seguranca',
    urgency: 'alta',
    status: 'em_votacao',
    location: 'Portaria Principal e Garagem',
    estimatedCostRange: 'R$ 12.000',
    createdByResidentId: 'B-1003',
    createdByName: 'Dra. Helena Martins',
    createdByBlock: 'B',
    createdByApartment: '1003',
    createdAt: '2026-08-11T10:00:00Z',
    targetAssemblyDate: '2026-09-15',
    votes: [
      { residentId: 'B-1003', residentName: 'Dra. Helena Martins', block: 'B', apartmentNumber: '1003', avatarUrl: RESIDENT_AVATARS.helena, votedAt: '2026-08-11T10:05:00Z' },
      { residentId: 'A-101', residentName: 'Renan Braga Vieira', block: 'A', apartmentNumber: '101', avatarUrl: RESIDENT_AVATARS.renan, votedAt: '2026-08-11T12:00:00Z' },
      { residentId: 'A-402', residentName: 'Morador A-402', block: 'A', apartmentNumber: '402', votedAt: '2026-08-11T15:30:00Z' },
      { residentId: 'A-603', residentName: 'Morador A-603', block: 'A', apartmentNumber: '603', votedAt: '2026-08-12T08:15:00Z' },
      { residentId: 'B-301', residentName: 'Morador B-301', block: 'B', apartmentNumber: '301', votedAt: '2026-08-12T16:20:00Z' },
      { residentId: 'B-704', residentName: 'Morador B-704', block: 'B', apartmentNumber: '704', votedAt: '2026-08-13T11:00:00Z' },
      { residentId: 'B-902', residentName: 'Morador B-902', block: 'B', apartmentNumber: '902', votedAt: '2026-08-14T17:40:00Z' },
    ],
    comments: [
      {
        id: 'c-3',
        residentId: 'A-101',
        residentName: 'Renan Braga Vieira',
        block: 'A',
        apartmentNumber: '101',
        avatarUrl: RESIDENT_AVATARS.renan,
        text: 'Vai agilizar muito a entrada com compras e aumentar a segurança.',
        createdAt: '2026-08-11T12:05:00Z',
      },
    ],
  },
  {
    id: 'task-3',
    title: 'Pintura Epóxi e Nova Demarcação das Vagas de Garagem',
    description: 'Aplicação de piso antiderrapante na circulação dos veículos e pintura refletiva nas vagas e colunas de proteção.',
    category: 'garagem',
    urgency: 'media',
    status: 'em_votacao',
    location: 'Subsolos G1 e G2',
    estimatedCostRange: 'R$ 9.500',
    createdByResidentId: 'B-502',
    createdByName: 'Carlos Eduardo Mendes',
    createdByBlock: 'B',
    createdByApartment: '502',
    createdAt: '2026-08-12T09:15:00Z',
    votes: [
      { residentId: 'B-502', residentName: 'Carlos Eduardo Mendes', block: 'B', apartmentNumber: '502', avatarUrl: RESIDENT_AVATARS.carlos, votedAt: '2026-08-12T09:20:00Z' },
      { residentId: 'A-304', residentName: 'Beatriz Vasconcelos', block: 'A', apartmentNumber: '304', avatarUrl: RESIDENT_AVATARS.beatriz, votedAt: '2026-08-12T14:10:00Z' },
      { residentId: 'A-801', residentName: 'Morador A-801', block: 'A', apartmentNumber: '801', votedAt: '2026-08-13T10:00:00Z' },
      { residentId: 'B-404', residentName: 'Morador B-404', block: 'B', apartmentNumber: '404', votedAt: '2026-08-14T19:15:00Z' },
    ],
    comments: [],
  },
  {
    id: 'task-4',
    title: 'Painéis Solares Fotovoltaicos para Energia das Áreas Comuns',
    description: 'Instalação de 36 módulos solares no topo das Torres A e B para reduzir em até 70% a conta de energia elétrica condominial.',
    category: 'sustentabilidade',
    urgency: 'media',
    status: 'em_votacao',
    location: 'Topo das Torres A e B',
    estimatedCostRange: 'R$ 35.000',
    createdByResidentId: 'A-304',
    createdByName: 'Beatriz Vasconcelos',
    createdByBlock: 'A',
    createdByApartment: '304',
    createdAt: '2026-08-13T16:00:00Z',
    votes: [
      { residentId: 'A-304', residentName: 'Beatriz Vasconcelos', block: 'A', apartmentNumber: '304', avatarUrl: RESIDENT_AVATARS.beatriz, votedAt: '2026-08-13T16:05:00Z' },
      { residentId: 'A-101', residentName: 'Renan Braga Vieira', block: 'A', apartmentNumber: '101', avatarUrl: RESIDENT_AVATARS.renan, votedAt: '2026-08-13T17:20:00Z' },
      { residentId: 'B-1003', residentName: 'Dra. Helena Martins', block: 'B', apartmentNumber: '1003', avatarUrl: RESIDENT_AVATARS.helena, votedAt: '2026-08-14T09:10:00Z' },
      { residentId: 'B-602', residentName: 'Morador B-602', block: 'B', apartmentNumber: '602', votedAt: '2026-08-14T13:40:00Z' },
      { residentId: 'A-1201', residentName: 'Morador A-1201', block: 'A', apartmentNumber: '1201', votedAt: '2026-08-15T08:30:00Z' },
    ],
    comments: [
      {
        id: 'c-4',
        residentId: 'A-101',
        residentName: 'Renan Braga Vieira',
        block: 'A',
        apartmentNumber: '101',
        avatarUrl: RESIDENT_AVATARS.renan,
        text: 'Ótima proposta sustentável! A longo prazo vai baixar o condomínio de todas as 96 unidades.',
        createdAt: '2026-08-13T17:25:00Z',
      },
    ],
  },
  {
    id: 'task-5',
    title: 'Revitalização das Pastilhas Azuis das Varandas Centrais e Fachada',
    description: 'Limpeza hidrojateada, rejuntamento impermeável das pastilhas azuis das varandas curvas e manutenção preventiva das colunas de tijolinho terracota.',
    category: 'fachada_estrutura',
    urgency: 'alta',
    status: 'analise_sindico',
    location: 'Fachada Externa - Torres A e B',
    estimatedCostRange: 'R$ 14.500',
    createdByResidentId: 'A-101',
    createdByName: 'Renan Braga Vieira',
    createdByBlock: 'A',
    createdByApartment: '101',
    createdAt: '2026-08-05T11:00:00Z',
    votes: [
      { residentId: 'A-101', residentName: 'Renan Braga Vieira', block: 'A', apartmentNumber: '101', avatarUrl: RESIDENT_AVATARS.renan, votedAt: '2026-08-05T14:10:00Z' },
      { residentId: 'A-304', residentName: 'Beatriz Vasconcelos', block: 'A', apartmentNumber: '304', avatarUrl: RESIDENT_AVATARS.beatriz, votedAt: '2026-08-05T16:10:00Z' },
      { residentId: 'B-502', residentName: 'Carlos Eduardo Mendes', block: 'B', apartmentNumber: '502', avatarUrl: RESIDENT_AVATARS.carlos, votedAt: '2026-08-06T18:00:00Z' },
      { residentId: 'B-1003', residentName: 'Dra. Helena Martins', block: 'B', apartmentNumber: '1003', avatarUrl: RESIDENT_AVATARS.helena, votedAt: '2026-08-07T10:00:00Z' },
    ],
    comments: [],
  },
  {
    id: 'task-6',
    title: 'Limpeza e Impermeabilização das Caixas d’Água',
    description: 'Manutenção semestral das 4 caixas superiores e cisterna inferior dos Blocos A e B para garantia da potabilidade da água.',
    category: 'eletrica_hidraulica',
    urgency: 'alta',
    status: 'aprovada_assembleia',
    location: 'Reservatórios Superiores e Inferiores',
    estimatedCostRange: 'R$ 4.200',
    createdByResidentId: 'B-1003',
    createdByName: 'Dra. Helena Martins',
    createdByBlock: 'B',
    createdByApartment: '1003',
    createdAt: '2026-07-28T09:00:00Z',
    votes: [
      { residentId: 'B-1003', residentName: 'Dra. Helena Martins', block: 'B', apartmentNumber: '1003', avatarUrl: RESIDENT_AVATARS.helena, votedAt: '2026-07-28T09:05:00Z' },
      { residentId: 'A-101', residentName: 'Renan Braga Vieira', block: 'A', apartmentNumber: '101', avatarUrl: RESIDENT_AVATARS.renan, votedAt: '2026-07-28T10:00:00Z' },
      { residentId: 'A-304', residentName: 'Beatriz Vasconcelos', block: 'A', apartmentNumber: '304', avatarUrl: RESIDENT_AVATARS.beatriz, votedAt: '2026-07-28T11:30:00Z' },
      { residentId: 'B-502', residentName: 'Carlos Eduardo Mendes', block: 'B', apartmentNumber: '502', avatarUrl: RESIDENT_AVATARS.carlos, votedAt: '2026-07-28T14:00:00Z' },
      { residentId: 'A-901', residentName: 'Morador A-901', block: 'A', apartmentNumber: '901', votedAt: '2026-07-29T08:00:00Z' },
      { residentId: 'B-1102', residentName: 'Morador B-1102', block: 'B', apartmentNumber: '1102', votedAt: '2026-07-29T12:00:00Z' },
    ],
    comments: [],
  },
];
