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
  socials: ('instagram' | 'tiktok' | 'facebook')[];
  influencerIds: string[];
}
