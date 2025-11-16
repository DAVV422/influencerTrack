export interface Socials {
  instagram?: string;
  tiktok?: string;
  facebook?: string;
}

export interface Influencer {
  id: string;
  name: string;
  imageUrl: string;
  socials: Socials;
  followers: number;
  clic_descargas: object;
  likes: number;
  posts: number;
  reach: number;
}

export interface Publication {
  id: string;
  url: string;
  likes: number;
  comments: number;
  shares: number;
  influencerId: string;
  campaignId: string;
}

export interface Campaign {
  id: string;
  name: string;
  // Nuevos campos
  description: string;
  startDate: string; // Usamos string porque el input[type="date"] devuelve una cadena
  endDate: string;   // Usamos string porque el input[type="date"] devuelve una cadena
  // createdAt: string; // Añadido para seguir la lógica de la función createCampaign

  // Campos existentes
  socials: ('instagram' | 'tiktok' | 'facebook')[];
  influencerIds: string[];
}
