export type BlockType = 'A' | 'B';

export type UrgencyLevel = 'baixa' | 'media' | 'alta' | 'urgente';

export type TaskCategory =
  | 'seguranca'
  | 'elevadores'
  | 'garagem'
  | 'lazer_piscina'
  | 'fachada_estrutura'
  | 'eletrica_hidraulica'
  | 'jardim_areas_comuns'
  | 'sustentabilidade'
  | 'outros';

export type TaskStatus =
  | 'em_votacao'
  | 'analise_sindico'
  | 'aprovada_assembleia'
  | 'em_execucao'
  | 'concluida';

export type OccupancyType = 'proprietario_residente' | 'inquilino' | 'proprietario_nao_residente';

export interface ResidentProfile {
  id: string; // e.g. "A-101"
  block: BlockType;
  apartmentNumber: string; // "101", "102", ..., "1204"
  floor: number;
  residentName: string;
  phone: string;
  email: string;
  occupancyType: OccupancyType;
  avatarUrl?: string;
  vehiclePlate?: string;
  vehicleModel?: string;
  hasPets?: boolean;
  petDetails?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  registeredAt: string;
  updatedAt: string;
}

export interface TaskVote {
  residentId: string; // e.g. "A-502"
  residentName: string;
  block: BlockType;
  apartmentNumber: string;
  avatarUrl?: string;
  votedAt: string;
}

export interface TaskComment {
  id: string;
  residentId: string;
  residentName: string;
  block: BlockType;
  apartmentNumber: string;
  avatarUrl?: string;
  text: string;
  createdAt: string;
}

export interface TaskProposal {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  urgency: UrgencyLevel;
  status: TaskStatus;
  location: string;
  estimatedCostRange?: string; // ex: "R$ 2.000 - R$ 5.000" ou "Baixo Custo"
  createdByResidentId: string; // e.g. "A-101"
  createdByName: string;
  createdByBlock: BlockType;
  createdByApartment: string;
  createdAt: string;
  votes: TaskVote[]; // List of residents/apartments that voted
  comments: TaskComment[];
  targetAssemblyDate?: string;
}

export interface CondominiumSummary {
  totalApartments: number;
  totalBlocks: number;
  floorsPerBlock: number;
  apartmentsPerFloor: number;
}
