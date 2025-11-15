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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import type { Publication } from '@/lib/types';
import { addPublication } from '@/lib/data';

interface AddPublicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPublication: (publication: Publication) => void;
  campaignId: string;
  influencerId: string;
}

export function AddPublicationModal({
  open,
  onOpenChange,
  onAddPublication,
  campaignId,
  influencerId,
}: AddPublicationModalProps) {
  const { toast } = useToast();
  const [url, setUrl] = useState('');

  const handleSubmit = () => {
    if (!url || !URL.canParse(url)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid URL for the publication.',
        variant: 'destructive',
      });
      return;
    }
    
    // In a real app, this would call a backend service to fetch metrics.
    // Here, we simulate it with random data.
    const newPublication: Publication = {
      id: Date.now().toString(),
      url,
      likes: Math.floor(Math.random() * 50000),
      comments: Math.floor(Math.random() * 2000),
      shares: Math.floor(Math.random() * 1000),
      campaignId,
      influencerId,
    };

    addPublication(newPublication);
    onAddPublication(newPublication);

    toast({
      title: 'Publication added!',
      description: 'Metrics have been fetched and added to the list.',
    });
    onOpenChange(false);
    setUrl('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Publication</DialogTitle>
          <DialogDescription>
            Enter the URL of the publication. The system will automatically fetch its metrics.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              URL
            </Label>
            <Input id="url" value={url} onChange={e => setUrl(e.target.value)} className="col-span-3" placeholder="https://instagram.com/p/..." />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Add and Fetch Metrics
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
