'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { Influencer } from '@/lib/types';
import { v4 as uuid } from 'uuid';

export function AddInfluencerModal({
  open,
  onOpenChange,
  onAddInfluencer,
  mode,
  initialInfluencer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddInfluencer: (inf: Influencer) => void;
  mode: 'add' | 'edit';
  initialInfluencer: Influencer | null;
}) {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Moda');
  const [imageUrl, setImageUrl] = useState('');

  // Redes sociales
  const [useInstagram, setUseInstagram] = useState(false);
  const [useTiktok, setUseTiktok] = useState(false);
  const [useFacebook, setUseFacebook] = useState(false);

  const [instagramUrl, setInstagramUrl] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');

  // COSTOS
  const [instagramCost, setInstagramCost] = useState('');
  const [tiktokCost, setTiktokCost] = useState('');
  const [facebookCost, setFacebookCost] = useState('');

  // Totales globales
  const [followers, setFollowers] = useState<number>(0);
  const [likes, setLikes] = useState<number>(0);
  const [posts, setPosts] = useState<number>(0);
  const [reach, setReach] = useState<number>(0);

  useEffect(() => {
    if (open && mode === 'edit' && initialInfluencer) {
      setName(initialInfluencer.name);
      setNickname(initialInfluencer.nickname || '');
      setEmail(initialInfluencer.email || '');
      setPhone(initialInfluencer.phone || '');
      setCategory(initialInfluencer.category || 'Moda');
      setImageUrl(initialInfluencer.imageUrl);

      // Redes sociales previas
      setUseInstagram(!!initialInfluencer.socials.instagram);
      setUseTiktok(!!initialInfluencer.socials.tiktok);
      setUseFacebook(!!initialInfluencer.socials.facebook);

      setInstagramUrl(initialInfluencer.socials.instagram || '');
      setTiktokUrl(initialInfluencer.socials.tiktok || '');
      setFacebookUrl(initialInfluencer.socials.facebook || '');

      // Costos previos
      setInstagramCost(initialInfluencer.instagramCost?.toString() || '');
      setTiktokCost(initialInfluencer.tiktokCost?.toString() || '');
      setFacebookCost(initialInfluencer.facebookCost?.toString() || '');

      setFollowers(initialInfluencer.followers);
      setLikes(initialInfluencer.likes);
      setPosts(initialInfluencer.posts);
      setReach(initialInfluencer.reach);
    }

    if (open && mode === 'add') {
      setName('');
      setNickname('');
      setEmail('');
      setPhone('');
      setCategory('Moda');
      setImageUrl('');

      setUseInstagram(false);
      setUseTiktok(false);
      setUseFacebook(false);

      setInstagramUrl('');
      setTiktokUrl('');
      setFacebookUrl('');

      setInstagramCost('');
      setTiktokCost('');
      setFacebookCost('');

      setFollowers(0);
      setLikes(0);
      setPosts(0);
      setReach(0);
    }
  }, [open, mode, initialInfluencer]);

  const handleSubmit = () => {
    const influencer: Influencer = {
      id: initialInfluencer?.id || uuid(),
      name,
      nickname,
      email,
      phone,
      category,
      imageUrl,
      socials: {
        instagram: useInstagram ? instagramUrl : undefined,
        tiktok: useTiktok ? tiktokUrl : undefined,
        facebook: useFacebook ? facebookUrl : undefined,
      },

      followers,
      likes,
      posts,
      reach,

      instagramCost: useInstagram ? Number(instagramCost) : undefined,
      tiktokCost: useTiktok ? Number(tiktokCost) : undefined,
      facebookCost: useFacebook ? Number(facebookCost) : undefined,
    };

    onAddInfluencer(influencer);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Agregar nuevo influencer' : 'Editar influencer'}
          </DialogTitle>
          <DialogDescription>
            Completa los datos del influencer y asigna costos por red social.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">

          {/* Nombre */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Nombre</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <Label>Usuario / Nickname</Label>
              <Input value={nickname} onChange={(e) => setNickname(e.target.value)} />
            </div>
          </div>

          {/* Email y teléfono */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>

          {/* Categoría */}
          <div>
            <Label>Categoría</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>

          {/* Imagen */}
          <div>
            <Label>URL de imagen</Label>
            <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          </div>

          {/* Redes sociales */}
          <div className="space-y-4 pt-2">
            <Label className="font-semibold">Redes sociales</Label>

            {/* INSTAGRAM */}
            <div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={useInstagram}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setUseInstagram(checked);
                    if (!checked) {
                      setInstagramUrl('');
                      setInstagramCost('');
                    }
                  }}
                />
                Instagram
              </label>

              {useInstagram && (
                <div className="flex gap-2 mt-1">
                  <Input
                    placeholder="URL Instagram"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Costo IG"
                    type="number"
                    value={instagramCost}
                    onChange={(e) => setInstagramCost(e.target.value)}
                    className="w-28"
                  />
                </div>
              )}
            </div>

            {/* TIKTOK */}
            <div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={useTiktok}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setUseTiktok(checked);
                    if (!checked) {
                      setTiktokUrl('');
                      setTiktokCost('');
                    }
                  }}
                />
                TikTok
              </label>

              {useTiktok && (
                <div className="flex gap-2 mt-1">
                  <Input
                    placeholder="URL TikTok"
                    value={tiktokUrl}
                    onChange={(e) => setTiktokUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Costo TikTok"
                    type="number"
                    value={tiktokCost}
                    onChange={(e) => setTiktokCost(e.target.value)}
                    className="w-28"
                  />
                </div>
              )}
            </div>

            {/* FACEBOOK */}
            <div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={useFacebook}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setUseFacebook(checked);
                    if (!checked) {
                      setFacebookUrl('');
                      setFacebookCost('');
                    }
                  }}
                />
                Facebook
              </label>

              {useFacebook && (
                <div className="flex gap-2 mt-1">
                  <Input
                    placeholder="URL Facebook"
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Costo FB"
                    type="number"
                    value={facebookCost}
                    onChange={(e) => setFacebookCost(e.target.value)}
                    className="w-28"
                  />
                </div>
              )}
            </div>
          </div>

          {/* SUBMIT */}
          <div className="pt-4 flex justify-end">
            <Button onClick={handleSubmit}>
              {mode === 'add' ? 'Agregar influencer' : 'Guardar cambios'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
