'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Instagram, Facebook, Heart, MessageSquare, Repeat } from 'lucide-react';
import type { Influencer } from '@/lib/types';
import { TikTokIcon } from '@/components/icons/tiktok-icon';
import { PageHeader } from '@/components/page-header';
import { AddInfluencerModal } from './add-influencer-modal';

export function InfluencerList({ initialInfluencers }: { initialInfluencers: Influencer[] }) {
  const [influencers, setInfluencers] = useState<Influencer[]>(initialInfluencers);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddInfluencer = (newInfluencer: Influencer) => {
    setInfluencers(prev => [newInfluencer, ...prev]);
  };
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <>
      <PageHeader
        title="Influencers"
        action={
          <Button onClick={() => setIsModalOpen(true)}>Add Influencer</Button>
        }
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {influencers.map((influencer) => (
          <Card key={influencer.id} className="flex flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
              <Image
                src={influencer.imageUrl}
                alt={`Profile of ${influencer.name}`}
                width={64}
                height={64}
                className="rounded-full border-2 border-primary"
                data-ai-hint="person portrait"
              />
              <div className="flex-1">
                <CardTitle className="text-lg">{influencer.name}</CardTitle>
                <div className="flex items-center gap-2 text-muted-foreground pt-1">
                  {influencer.socials.instagram && <a href={influencer.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary"><Instagram className="h-5 w-5" /></a>}
                  {influencer.socials.tiktok && <a href={influencer.socials.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-primary"><TikTokIcon className="h-5 w-5" /></a>}
                  {influencer.socials.facebook && <a href={influencer.socials.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-primary"><Facebook className="h-5 w-5" /></a>}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-4 pt-0">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Followers</p>
                  <p className="font-bold text-lg">{formatNumber(influencer.followers)}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Likes</p>
                  <p className="font-bold text-lg">{formatNumber(influencer.likes)}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Posts</p>
                  <p className="font-bold text-lg">{formatNumber(influencer.posts)}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-secondary/50 p-3">
              <div className="flex w-full items-center justify-between text-sm">
                <span className="font-medium text-muted-foreground">Reach</span>
                <span className="font-bold text-primary">{influencer.reach}%</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <AddInfluencerModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddInfluencer={handleAddInfluencer}
      />
    </>
  );
}
