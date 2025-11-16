'use client';

import { getInfluencers } from '@/lib/data_old';
import { InfluencerList } from './components/influencer-list';

export default function InfluencersPage() {
  const influencers = getInfluencers(); // Esto puede seguir siendo síncrono si es JSON local
  return (
    <div className="space-y-6">
      <InfluencerList initialInfluencers={influencers} />
    </div>
  );
}
