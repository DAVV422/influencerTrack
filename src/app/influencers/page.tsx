//influencers/pagetsx
import { getInfluencers } from '@/lib/data';
import { InfluencerList } from './components/influencer-list';

export default function InfluencersPage() {
  const influencers = getInfluencers();
  return (
    <div className="space-y-6">
      <InfluencerList initialInfluencers={influencers} />
    </div>
  );
}
