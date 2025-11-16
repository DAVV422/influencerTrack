'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import {
  getCampaignById,
  getInfluencersByCampaignId,
  getPublications,
  addInfluencersToCampaign,
  getInfluencers,
} from '@/lib/data';
import Image from 'next/image';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import type { Influencer } from '@/lib/types';
import { useState, useMemo } from 'react';
import { AddInfluencerToCampaignModal } from './components/add-influencer-to-campaign-modal';

function getInfluencerStats(influencerId: string, campaignId: string) {
  const allPublications = getPublications();
  const influencerPublications = allPublications.filter(
    (p) => p.influencerId === influencerId && p.campaignId === campaignId
  );
  return influencerPublications.reduce(
    (acc, pub) => {
      acc.likes += pub.likes;
      acc.comments += pub.comments;
      acc.shares += pub.shares;
      return acc;
    },
    { likes: 0, comments: 0, shares: 0, publications: influencerPublications.length }
  );
}

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export default function CampaignDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const campaign = getCampaignById(params.id);
  console.log(params.id)
  console.log(campaign)
  const allInfluencers = getInfluencers();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaignInfluencers, setCampaignInfluencers] = useState<Influencer[]>(
    () => getInfluencersByCampaignId(params.id)
  );

  if (!campaign) {
    notFound();
  }

  const handleAddInfluencers = (influencerIds: string[]) => {
    addInfluencersToCampaign(campaign.id, influencerIds);
    setCampaignInfluencers(getInfluencersByCampaignId(params.id));
  };
  
  const availableInfluencers = useMemo(() => {
    const campaignInfluencerIds = new Set(campaignInfluencers.map(i => i.id));
    return allInfluencers.filter(
      (inf) => !campaignInfluencerIds.has(inf.id)
    );
  }, [allInfluencers, campaignInfluencers]);

  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm" className="gap-2">
        <Link href="/campaigns">
          <ArrowLeft className="h-4 w-4" />
          Back to Campaigns
        </Link>
      </Button>
      <PageHeader
        title={campaign.name}
        action={
          <Button onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Influencer
          </Button>
        }
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Influencer</TableHead>
                <TableHead>Total Likes</TableHead>
                <TableHead>Total Comentarios</TableHead>
                <TableHead>Total Compartidos</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaignInfluencers.map((influencer) => {
                const stats = getInfluencerStats(influencer.id, campaign.id);
                return (
                  <TableRow key={influencer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={influencer.imageUrl}
                          alt={influencer.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                          data-ai-hint="person portrait"
                        />
                        <span className="font-medium">{influencer.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatNumber(stats.likes)}</TableCell>
                    <TableCell>{formatNumber(stats.comments)}</TableCell>
                    <TableCell>{formatNumber(stats.shares)}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/campaigns/${campaign.id}/${influencer.id}`}>
                          View Posts
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AddInfluencerToCampaignModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddInfluencers={handleAddInfluencers}
        influencers={availableInfluencers}
      />
    </div>
  );
}
