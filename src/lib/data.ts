import type { Influencer, Campaign, Publication } from './types';

export const influencers: Influencer[] = [
  {
    id: '1',
    name: 'Elena Rodriguez',
    imageUrl: 'https://picsum.photos/seed/1/200/200',
    socials: {
      instagram: 'https://instagram.com/elena_styles',
      tiktok: 'https://tiktok.com/@elena_styles',
    },
    followers: 1200000,
    likes: 5400000,
    posts: 350,
    reach: 7.8,
  },
  {
    id: '2',
    name: 'Marcus Chen',
    imageUrl: 'https://picsum.photos/seed/2/200/200',
    socials: {
      instagram: 'https://instagram.com/marcus.travels',
      facebook: 'https://facebook.com/marcus.travels',
    },
    followers: 850000,
    likes: 3200000,
    posts: 210,
    reach: 6.5,
  },
  {
    id: '3',
    name: 'Sophie Dubois',
    imageUrl: 'https://picsum.photos/seed/3/200/200',
    socials: {
      tiktok: 'https://tiktok.com/@sophie.foodie',
    },
    followers: 2500000,
    likes: 12000000,
    posts: 500,
    reach: 12.3,
  },
  {
    id: '4',
    name: 'Kenji Tanaka',
    imageUrl: 'https://picsum.photos/seed/4/200/200',
    socials: {
      instagram: 'https://instagram.com/kenji.tech',
      facebook: 'https://facebook.com/kenji.tech',
    },
    followers: 500000,
    likes: 1800000,
    posts: 150,
    reach: 5.2,
  },
  {
    id: '5',
    name: 'Chloe Kim',
    imageUrl: 'https://picsum.photos/seed/5/200/200',
    socials: {
      instagram: 'https://instagram.com/chloe.fit',
      tiktok: 'https://tiktok.com/@chloe.fit',
      facebook: 'https://facebook.com/chloe.fit',
    },
    followers: 1800000,
    likes: 7800000,
    posts: 420,
    reach: 9.1,
  },
  {
    id: '6',
    name: 'Liam O\'Connell',
    imageUrl: 'https://picsum.photos/seed/6/200/200',
    socials: {
      instagram: 'https://instagram.com/liam.explores',
    },
    followers: 650000,
    likes: 2100000,
    posts: 180,
    reach: 4.9,
  },
];

export const campaigns: Campaign[] = [
  {
    id: '1',
    name: 'Summer Style 2024',
    socials: ['instagram', 'tiktok'],
    influencerIds: ['1', '3', '5'],
  },
  {
    id: '2',
    name: 'Tech & Travel Gear',
    socials: ['instagram', 'facebook'],
    influencerIds: ['2', '4'],
  },
  {
    id: '3',
    name: 'Fitness Challenge',
    socials: ['instagram', 'tiktok', 'facebook'],
    influencerIds: ['5', '6'],
  },
];

export const publications: Publication[] = [
  { id: '1', url: 'https://instagram.com/p/C8a1b2c3d4e', likes: 12000, comments: 345, shares: 120, influencerId: '1', campaignId: '1' },
  { id: '2', url: 'https://tiktok.com/v/123456789', likes: 250000, comments: 2300, shares: 1500, influencerId: '3', campaignId: '1' },
  { id: '3', url: 'https://instagram.com/p/C8fG5h6i7j8', likes: 50000, comments: 1200, shares: 450, influencerId: '5', campaignId: '1' },
  { id: '4', url: 'https://instagram.com/p/C8hI9j0kL1m', likes: 8000, comments: 210, shares: 80, influencerId: '2', campaignId: '2' },
  { id: '5', url: 'https://facebook.com/kenji.tech/posts/123', likes: 4500, comments: 150, shares: 55, influencerId: '4', campaignId: '2' },
  { id: '6', url: 'https://instagram.com/p/C8jK1l2mN3o', likes: 15000, comments: 400, shares: 200, influencerId: '4', campaignId: '2' },
  { id: '7', url: 'https://instagram.com/p/C8lM3n4oP5q', likes: 75000, comments: 1800, shares: 600, influencerId: '5', campaignId: '3' },
  { id: '8', url: 'https://tiktok.com/v/987654321', likes: 120000, comments: 3500, shares: 2200, influencerId: '5', campaignId: '3' },
  { id: '9', url: 'https://instagram.com/p/C8nO5p6qR7s', likes: 9500, comments: 250, shares: 110, influencerId: '6', campaignId: '3' },
];

// Helper functions to get data
export const getCampaignById = (id: string) => campaigns.find((c) => c.id === id);
export const getInfluencerById = (id: string) => influencers.find((i) => i.id === id);
export const getPublicationsByCampaignAndInfluencer = (campaignId: string, influencerId: string) =>
  publications.filter((p) => p.campaignId === campaignId && p.influencerId === influencerId);

export const getInfluencersByCampaignId = (id: string) => {
  const campaign = getCampaignById(id);
  if (!campaign) return [];
  return campaign.influencerIds.map(id => getInfluencerById(id)).filter((i): i is Influencer => !!i);
}
