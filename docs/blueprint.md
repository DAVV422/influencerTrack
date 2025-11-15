# **App Name**: InfluenceTrack

## Core Features:

- Influencer Directory: Display a list of registered influencers with their profile photo, name, social media icons (TikTok, Instagram, Facebook), follower count, likes, and number of posts. Includes a static reach percentage. Add an influencer using a modal.
- Campaign Overview: A page to manage marketing campaigns, including the campaign name, connected social networks, the number of influencers involved, and campaign metrics.
- Campaign Influencer List: Displays a list of influencers associated with a specific campaign, with aggregated data (sum of likes, comments, and shares).
- Publication Metrics: Upon clicking on an influencer in the campaign list, displays a list of their publications (URLs) along with metrics such as likes, comments, and shares. Allows for adding new publications via a modal.
- Publication Metrics Fetching: When adding a publication URL, the app calls a backend service to fetch metrics (likes, comments, shares) for that publication.
- Influencer Profile Fetching: When registering an influencer, the app calls a backend service to fetch influencer data and metrics from their social media profile URLs (Instagram, Facebook, TikTok).
- Dashboard Statistics: Landing page showcasing overall statistics related to influencers and campaigns.

## Style Guidelines:

- Primary color: Slate Blue (#8457DB) for a modern and professional feel.
- Background color: Lavender (#EBE4F9) for a soft and inviting background.
- Accent color: Periwinkle (#D3C3F2) to highlight key interactive elements.
- Body and headline font: 'Inter', a grotesque-style sans-serif with a modern, machined, objective, neutral look.
- Use simple, clear icons for social media platforms and engagement metrics.
- Card-based layout for displaying influencer information and campaign details.
- Subtle transitions and animations when loading data or opening modals.