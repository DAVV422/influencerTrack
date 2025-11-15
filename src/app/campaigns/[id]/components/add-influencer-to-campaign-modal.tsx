'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import type { Influencer } from '@/lib/types';

interface AddInfluencerToCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddInfluencer: (influencerId: string) => void;
  influencers: Influencer[];
}

export function AddInfluencerToCampaignModal({
  open,
  onOpenChange,
  onAddInfluencer,
  influencers,
}: AddInfluencerToCampaignModalProps) {
  const { toast } = useToast();
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!selectedInfluencerId) {
      toast({
        title: 'Error',
        description: 'Please select an influencer to add.',
        variant: 'destructive',
      });
      return;
    }

    onAddInfluencer(selectedInfluencerId);
    toast({
      title: 'Influencer Added!',
      description: 'The influencer has been added to the campaign.',
    });
    onOpenChange(false);
    setSelectedInfluencerId(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Influencer to Campaign</DialogTitle>
          <DialogDescription>
            Select an influencer from the list to add them to this campaign.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select onValueChange={setSelectedInfluencerId}>
            <SelectTrigger>
              <SelectValue placeholder="Select an influencer..." />
            </SelectTrigger>
            <SelectContent>
              {influencers.length > 0 ? (
                influencers.map((influencer) => (
                  <SelectItem key={influencer.id} value={influencer.id}>
                    {influencer.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  No available influencers to add
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleSubmit} 
            disabled={!selectedInfluencerId || influencers.length === 0}
          >
            Add to Campaign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
