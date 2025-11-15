import { influencers } from '@/lib/data';
import { InfluencerList } from './components/influencer-list';

export default function InfluencersPage() {
  return (
    <div className="space-y-6">
      <InfluencerList initialInfluencers={influencers} />
    </div>
  );
}
