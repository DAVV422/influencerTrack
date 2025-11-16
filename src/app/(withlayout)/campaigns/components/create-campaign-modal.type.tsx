// CreateCampaignModal.types.ts (o dentro de tu types.ts)

import { Campaign } from "@/lib/types";

// Definiciones de tipos para el modal

// Los "socials" disponibles para la campaña
export type SocialPlatform = 'instagram' | 'tiktok' | 'facebook';

// Estructura de la Campaña que se crea desde el modal
export interface NewCampaign {
  id: string;
  name: string;
  description: string;
  startDate: string; 
  endDate: string;
  socials: SocialPlatform[]; // Plataformas seleccionadas
  // Estos campos se inicializarán con datos simulados o se dejarán vacíos
  influencerIds: string[];
}

export interface CreateCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCampaign: (campaign: Campaign) => void;
  nextIdGenerator: () => number;
}