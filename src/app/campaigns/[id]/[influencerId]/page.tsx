import { notFound } from 'next/navigation';
import {
  getCampaignById,
  getInfluencerById,
  getPublicationsByCampaignAndInfluencer,
} from '@/lib/data';
import { PublicationList } from './components/publication-list';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/page-header';

export default function InfluencerCampaignPostsPage({
  params,
}: {
  params: { id: string; influencerId: string };
}) {
  const campaign = getCampaignById(params.id);
  const influencer = getInfluencerById(params.influencerId);

  if (!campaign || !influencer) {
    notFound();
  }

  const initialPublications = getPublicationsByCampaignAndInfluencer(
    params.id,
    params.influencerId
  );

  return (
    <div className="space-y-6">
       <Button asChild variant="outline" size="sm" className="gap-2">
        <Link href={`/campaigns/${campaign.id}`}>
          <ArrowLeft className="h-4 w-4" />
          Back to {campaign.name}
        </Link>
      </Button>

      <PageHeader title={`${influencer.name}'s Posts`} />

      <PublicationList
        initialPublications={initialPublications}
        campaignId={params.id}
        influencerId={params.influencerId}
      />
    </div>
  );
}
