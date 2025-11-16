'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import {
  getCampaignById,
  getInfluencerById,
  getPublicationsByCampaignAndInfluencer,
} from '@/lib/data';
import { use } from 'react'; 
import { PublicationList } from './components/publication-list';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/page-header';

export default function InfluencerCampaignPostsPage({ params }: any) {

  const resolvedParams: any = use(params);

  const [campaign, setCampaign] = useState<any | null>(null);
  const [influencer, setInfluencer] = useState<any | null>(null);
  const [initialPublications, setInitialPublications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const [fetchedCampaign, fetchedInfluencer, fetchedPublications] =
        await Promise.all([
          getCampaignById(resolvedParams.id),
          getInfluencerById(resolvedParams.influencerId),
          getPublicationsByCampaignAndInfluencer(resolvedParams.id, resolvedParams.influencerId),
        ]);

      if (!fetchedCampaign || !fetchedInfluencer) {
        notFound();
        return;
      }

      setCampaign(fetchedCampaign);
      setInfluencer(fetchedInfluencer);
      setInitialPublications(fetchedPublications);
      setIsLoading(false);
    };

    fetchData();
  }, [resolvedParams.id, resolvedParams.influencerId]);

  if (isLoading) return <p>Loading...</p>;
  if (!campaign || !influencer) return <p>Not found</p>;

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="gap-2">
        <Link href={`/campaigns/${campaign.id}`}>
          <ArrowLeft className="h-4 w-4" />
          Back to {campaign.name}
        </Link>
      </Button>

      <PageHeader title={`Posts ${influencer.name}`} />

      <PublicationList
        initialPublications={initialPublications}
        campaignId={resolvedParams.id}
        influencerId={resolvedParams.influencerId}
      />
    </div>
  );
}
