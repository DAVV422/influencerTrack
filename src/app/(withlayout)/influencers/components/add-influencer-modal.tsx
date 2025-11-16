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

interface ProfileMetrics {
  followers: number;
  likes: number;
  posts: number;
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

  async function fetchProfileMetrics(profileUrl: string): Promise<ProfileMetrics | null> {
    const backendUrl = "http://127.0.0.1:8000/metricas/profile"; // tu endpoint del backend

    if (!backendUrl) {
      console.error("Backend URL no definida.");
      return null;
    }

    try {
      console.log(`Llamando al backend para perfil: ${profileUrl}`);

      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: profileUrl }),
      });

      if (!response.ok) {
        throw new Error(`Request falló con status ${response.status}`);
      }

      const data = await response.json();

      return {
        followers: data.followers || 0,
        likes: data.likes || 0,
        posts: data.posts || 0,
        // añade otros campos si tu backend los devuelve
      };
    } catch (error) {
      console.error("Error obteniendo métricas del perfil:", error);
      return null;
    }
  }

  function estimateReach(followers: number, likes: number, posts: number): number {
    if (followers === 0 || posts === 0) return 0;
    const avgLikesPerPost = likes / posts;
    const engagementRate = (avgLikesPerPost / followers) * 100;
    const reach = engagementRate * 2; // factor genérico
    return parseFloat(reach.toFixed(1)); // reach en porcentaje
  }

  const handleSubmit = async () => {
  if (!name) {
    toast({
      title: "Error",
      description: "Please enter a name for the influencer.",
      variant: "destructive",
    });
    return;
  }

  // Elegir la URL principal del influencer (Instagram, TikTok, Facebook)
  const profileUrl = instagram || tiktok || facebook;
    let metrics = { followers: 0, likes: 0, posts: 0 };

    if (profileUrl) {
      const fetchedMetrics = await fetchProfileMetrics(profileUrl);
      if (fetchedMetrics) {
        metrics = fetchedMetrics;
      }
    }

    const reach_influencer = estimateReach(metrics.followers, metrics.likes, metrics.posts);

    const newInfluencer: Influencer = {
      id: Date.now().toString(),
      name,
      imageUrl: `https://picsum.photos/seed/${Date.now()}/200/200`,
      socials: { instagram, tiktok, facebook },
      followers: metrics.followers,
      likes: metrics.likes,
      posts: metrics.posts,
      reach: reach_influencer,
      clic_descargas: {},
    };

    saveInfluencer(newInfluencer);
    onAddInfluencer(newInfluencer);

    toast({
      title: "Success!",
      description: `${name} has been added to the directory.`,
    });
    onOpenChange(false);

    // Reset form
    setName("");
    setInstagram("");
    setTiktok("");
    setFacebook("");
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
