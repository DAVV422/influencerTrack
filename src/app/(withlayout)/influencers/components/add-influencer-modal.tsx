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
import type { Influencer } from '@/lib/types';
import { addInfluencer as saveInfluencer } from '@/lib/data';


interface AddInfluencerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddInfluencer: (influencer: Influencer) => void;
}

export function AddInfluencerModal({
  open,
  onOpenChange,
  onAddInfluencer,
}: AddInfluencerModalProps) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [facebook, setFacebook] = useState('');

  const handleSubmit = () => {
    if (!name) {
      toast({
        title: 'Error',
        description: 'Please enter a name for the influencer.',
        variant: 'destructive',
      });
      return;
    }
    // In a real app, this would call a backend service
    // to fetch influencer data. Here we simulate it.
    const newInfluencer: Influencer = {
      id: Date.now().toString(),
      name,
      imageUrl: `https://picsum.photos/seed/${Date.now()}/200/200`,
      socials: { instagram, tiktok, facebook },
      followers: Math.floor(Math.random() * 1000000),
      likes: Math.floor(Math.random() * 5000000),
      posts: Math.floor(Math.random() * 500),
      reach: parseFloat((Math.random() * 15).toFixed(1)),
    };

    saveInfluencer(newInfluencer);
    onAddInfluencer(newInfluencer);

    toast({
      title: 'Success!',
      description: `${name} has been added to the directory.`,
    });
    onOpenChange(false);
    // Reset form
    setName('');
    setInstagram('');
    setTiktok('');
    setFacebook('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Influencer</DialogTitle>
          <DialogDescription>
            Enter the influencer's details below. Adding a profile URL will help fetch their data automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="instagram" className="text-right">
              Instagram URL
            </Label>
            <Input id="instagram" value={instagram} onChange={e => setInstagram(e.target.value)} className="col-span-3" placeholder="https://instagram.com/username" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tiktok" className="text-right">
              TikTok URL
            </Label>
            <Input id="tiktok" value={tiktok} onChange={e => setTiktok(e.target.value)} className="col-span-3" placeholder="https://tiktok.com/@username" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="facebook" className="text-right">
              Facebook URL
            </Label>
            <Input id="facebook" value={facebook} onChange={e => setFacebook(e.target.value)} className="col-span-3" placeholder="https://facebook.com/username" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Add Influencer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
