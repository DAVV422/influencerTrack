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
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import type { Influencer } from '@/lib/types';
import { MultiSelectCombobox } from './multi-select-combobox';

interface AddInfluencerToCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddInfluencers: (influencerIds: string[]) => void;
  influencers: Influencer[];
}

export function AddInfluencerToCampaignModal({
  open,
  onOpenChange,
  onAddInfluencers,
  influencers,
}: AddInfluencerToCampaignModalProps) {
  const { toast } = useToast();
  const [selectedInfluencerIds, setSelectedInfluencerIds] = useState<string[]>([]);

  const handleSubmit = () => {
    if (selectedInfluencerIds.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one influencer to add.',
        variant: 'destructive',
      });
      return;
    }

    onAddInfluencers(selectedInfluencerIds);
    toast({
      title: 'Influencers Added!',
      description: `${selectedInfluencerIds.length} influencer(s) have been added to the campaign.`,
    });
    onOpenChange(false);
    setSelectedInfluencerIds([]);
  };

  const comboboxOptions = influencers.map(inf => ({
    value: inf.id,
    label: inf.name,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Influencers to Campaign</DialogTitle>
          <DialogDescription>
            Search and select one or more influencers to add to this campaign.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <MultiSelectCombobox
            options={comboboxOptions}
            selected={selectedInfluencerIds}
            onChange={setSelectedInfluencerIds}
            placeholder="Select influencers..."
            searchPlaceholder="Search influencers..."
            notFoundMessage="No influencers found."
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleSubmit} 
            disabled={selectedInfluencerIds.length === 0}
          >
            Add to Campaign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
