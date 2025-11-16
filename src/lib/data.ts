import type { Influencer, Campaign, Publication } from './types';
import allInfluencers from '@/data/influencers.json';
import allCampaigns from '@/data/campaigns.json';
import allPublications from '@/data/publications.json';

// State management for demo purposes
let influencers: Influencer[] = allInfluencers;
let campaigns: Campaign[] = allCampaigns as Campaign[];
let publications: Publication[] = allPublications;


// Helper functions to get data
export const getCampaigns = () => campaigns;
export const getInfluencers = () => influencers;
export const getPublications = () => publications;

export const getCampaignById = (id: string) => campaigns.find((c) => c.id === id);
export const getInfluencerById = (id: string) => influencers.find((i) => i.id === id);
export const getPublicationsByCampaignAndInfluencer = (campaignId: string, influencerId: string) =>
  publications.filter((p) => p.campaignId === campaignId && p.influencerId === influencerId);

export const getInfluencersByCampaignId = (id: string) => {
  const campaign = getCampaignById(id);
  if (!campaign) return [];
  return campaign.influencerIds.map(id => getInfluencerById(id)).filter((i): i is Influencer => !!i);
}

export const addInfluencersToCampaign = (campaignId: string, influencerIds: string[]) => {
  const campaign = getCampaignById(campaignId);
  if (campaign) {
    influencerIds.forEach(influencerId => {
      if (!campaign.influencerIds.includes(influencerId)) {
        campaign.influencerIds.push(influencerId);
      }
    });
    // In a real DB, you'd update the campaign record.
    // Here we're updating the in-memory array.
    campaigns = campaigns.map(c => c.id === campaignId ? campaign : c);
    return true;
  }
  return false;
}

export const addPublication = (publication: Publication) => {
    publications = [publication, ...publications];
}

export const addInfluencer = (influencer: Influencer) => {
    influencers = [influencer, ...influencers];
}
