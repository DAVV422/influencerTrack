import type { Influencer, Campaign, Publication } from './types';

// Influencers
export const getInfluencers = async (): Promise<Influencer[]> => {
  const res = await fetch('/api/influencers');
  return res.json();
}

export const getInfluencerById = async (id: string): Promise<Influencer | undefined> => {
  const influencers = await getInfluencers();
  return influencers.find(i => i.id === id);
}

export const addInfluencer = async (influencer: Influencer) => {
  const res = await fetch('/api/influencers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(influencer),
  });
  return res.json();
}

export const updateInfluencer = async (id: string, data: Partial<Influencer>) => {
  const res = await fetch(`/api/influencers/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}


// Campaigns
export const getCampaigns = async (): Promise<Campaign[]> => {
  const res = await fetch('/api/campaigns');
  return res.json();
}

export const getCampaignById = async (id: string): Promise<Campaign | undefined> => {
  const campaigns = await getCampaigns();
  return campaigns.find(c => c.id === id);
}

export const addCampaign = async (campaign: Campaign) => {
  const res = await fetch('/api/campaigns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(campaign),
  });
  return res.json();
}

export const updateCampaign = async (id: string, data: Partial<Campaign>) => {
  const res = await fetch(`/api/campaigns/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Agregar influencers a una campaña
export const addInfluencersToCampaign = async (campaignId: string, influencerIds: string[]) => {
  const campaign = await getCampaignById(campaignId);
  if (!campaign) return false;

  const updatedIds = Array.from(new Set([...campaign.influencerIds, ...influencerIds]));
  return updateCampaign(campaignId, { influencerIds: updatedIds });
}



// Publications
export const getPublications = async (): Promise<Publication[]> => {
  const res = await fetch('/api/publications');
  return res.json();
}

export const getPublicationsByCampaignAndInfluencer = async (campaignId: string, influencerId: string) => {
  const publications = await getPublications();
  return publications.filter(p => p.campaignId === campaignId && p.influencerId === influencerId);
}

export const addPublication = async (publication: Publication) => {
  const res = await fetch('/api/publications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(publication),
  });
  return res.json();
}

export const updatePublication = async (id: string, data: Partial<Publication>) => {
  const res = await fetch(`/api/publications/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}


