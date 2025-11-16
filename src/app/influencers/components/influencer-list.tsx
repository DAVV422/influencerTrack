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
import { Instagram, Facebook, Info } from 'lucide-react';
import type { Influencer } from '@/lib/types';
import { TikTokIcon } from '@/components/icons/tiktok-icon';
import { PageHeader } from '@/components/page-header';
import { AddInfluencerModal } from './add-influencer-modal';
import { deleteInfluencer } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export function InfluencerList({
  initialInfluencers,
}: {
  initialInfluencers: Influencer[];
}) {
  const [influencers, setInfluencers] = useState<Influencer[]>(
    initialInfluencers,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedInfluencer, setSelectedInfluencer] =
    useState<Influencer | null>(null);

  // Modal de información
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [infoInfluencer, setInfoInfluencer] =
    useState<Influencer | null>(null);

  const { toast } = useToast();

  const baseUrl = 'https://takenos.com';

  // 🔗 Link de tracking hacia la página principal de Takenos (solo para los botones de copiar en la card)
  const getTrackingUrl = (
    influencer: Influencer,
    social: 'instagram' | 'tiktok' | 'facebook',
  ) => {
    return `${baseUrl}/?influencer=${influencer.id}&social=${social}`;
  };

  // Agregar / actualizar en el estado local
  const handleSaveInfluencer = (newInfluencer: Influencer) => {
    setInfluencers((prev) => {
      const exists = prev.some((i) => i.id === newInfluencer.id);
      if (exists) {
        return prev.map((i) =>
          i.id === newInfluencer.id ? newInfluencer : i,
        );
      }
      return [newInfluencer, ...prev];
    });
  };

  const handleOpenAdd = () => {
    setSelectedInfluencer(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (influencer: Influencer) => {
    setSelectedInfluencer(influencer);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setInfluencers((prev) => prev.filter((i) => i.id !== id));
    deleteInfluencer(id);
  };

  const handleCopyLink = (url: string) => {
    if (!url) return;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast({
          title: 'Link copiado',
          description: url,
        });
      })
      .catch(() => {
        toast({
          title: 'Error al copiar',
          description: 'No se pudo copiar el link.',
          variant: 'destructive',
        });
      });
  };

  const openInfo = (influencer: Influencer) => {
    setInfoInfluencer(influencer);
    setIsInfoOpen(true);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  // 👉 Genera métricas por red social a partir de los totales
  const getSocialMetrics = (
    influencer: Influencer,
    _social: 'instagram' | 'tiktok' | 'facebook',
  ) => {
    const hasInstagram = !!influencer.socials.instagram;
    const hasTiktok = !!influencer.socials.tiktok;
    const hasFacebook = !!influencer.socials.facebook;

    const activeSocials = [
      hasInstagram ? 'instagram' : null,
      hasTiktok ? 'tiktok' : null,
      hasFacebook ? 'facebook' : null,
    ].filter(Boolean).length;

    if (!activeSocials) {
      return { followers: 0, likes: 0, posts: 0 };
    }

    const share = 1 / activeSocials;

    const baseFollowers = influencer.followers || 0;
    const baseLikes = influencer.likes || 0;
    const basePosts = influencer.posts || 0;

    return {
      followers: Math.max(0, Math.round(baseFollowers * share)),
      likes: Math.max(0, Math.round(baseLikes * share)),
      posts: Math.max(0, Math.round(basePosts * share)),
    };
  };

  return (
    <>
      <PageHeader
        title="Influencers"
        action={
          <Button onClick={handleOpenAdd}>Add Influencer</Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {influencers.map((influencer) => {
          const hasInstagram = !!influencer.socials.instagram;
          const hasTiktok = !!influencer.socials.tiktok;
          const hasFacebook = !!influencer.socials.facebook;

          // links de tracking hacia Takenos (solo para copiar desde la card)
          const igTrack = hasInstagram
            ? getTrackingUrl(influencer, 'instagram')
            : '';
          const tkTrack = hasTiktok
            ? getTrackingUrl(influencer, 'tiktok')
            : '';
          const fbTrack = hasFacebook
            ? getTrackingUrl(influencer, 'facebook')
            : '';

          return (
            <Card
              key={influencer.id}
              className="flex flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
            >
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
                  {/* Título + ícono de información */}
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg">
                      {influencer.name}
                    </CardTitle>
                    <Info
                      className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary"
                      title="Ver más información"
                      onClick={() => openInfo(influencer)}
                    />
                  </div>

                  {influencer.nickname && (
                    <p className="text-xs text-muted-foreground">
                      @{influencer.nickname}
                      {influencer.category
                        ? ` • ${influencer.category}`
                        : ''}
                    </p>
                  )}

                  {/* Íconos de redes → URL REAL del perfil */}
                  <div className="flex items-center gap-2 text-muted-foreground pt-1">
                    {hasInstagram && influencer.socials.instagram && (
                      <a
                        href={influencer.socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                    {hasTiktok && influencer.socials.tiktok && (
                      <a
                        href={influencer.socials.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary"
                      >
                        <TikTokIcon className="h-5 w-5" />
                      </a>
                    )}
                    {hasFacebook && influencer.socials.facebook && (
                      <a
                        href={influencer.socials.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                  </div>

                  {/* Links únicos creados + botones de copia (tracking Takenos) */}
                  {(hasInstagram || hasTiktok || hasFacebook) && (
                    <div className="mt-2 flex flex-col gap-1">
                      <p className="text-[11px] font-semibold text-muted-foreground">
                        Links únicos creados:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {hasInstagram && igTrack && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyLink(igTrack)}
                          >
                            Copiar link IG
                          </Button>
                        )}
                        {hasTiktok && tkTrack && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyLink(tkTrack)}
                          >
                            Copiar link TikTok
                          </Button>
                        )}
                        {hasFacebook && fbTrack && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyLink(fbTrack)}
                          >
                            Copiar link Facebook
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-4 pt-0">
                <p className="text-xs text-muted-foreground">
                  Haz clic en el icono de información (ⓘ) para ver
                  estadísticas detalladas por red social.
                </p>
              </CardContent>

              <CardFooter className="bg-secondary/50 p-3 flex flex-col gap-2">
                <div className="flex w-full justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(influencer)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(influencer.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Modal para agregar / editar influencer */}
      <AddInfluencerModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddInfluencer={handleSaveInfluencer}
        mode={modalMode}
        initialInfluencer={selectedInfluencer}
      />

      {/* Modal de información detallada */}
      {infoInfluencer && (
        <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>Información del influencer</DialogTitle>
              <DialogDescription>
                Perfiles y métricas por red social.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center gap-4">
              <Image
                src={infoInfluencer.imageUrl}
                alt={`Profile of ${infoInfluencer.name}`}
                width={96}
                height={96}
                className="rounded-full border-2 border-primary"
              />
              <div className="text-center space-y-1">
                <h2 className="text-lg font-semibold">
                  {infoInfluencer.name}
                </h2>
                {infoInfluencer.nickname && (
                  <p className="text-sm text-muted-foreground">
                    @{infoInfluencer.nickname}
                  </p>
                )}
                {infoInfluencer.category && (
                  <p className="text-xs text-muted-foreground">
                    Categoría: {infoInfluencer.category}
                  </p>
                )}
                {(infoInfluencer.email || infoInfluencer.phone) && (
                  <p className="text-xs text-muted-foreground">
                    {infoInfluencer.email
                      ? `Email: ${infoInfluencer.email}`
                      : ''}
                    {infoInfluencer.email && infoInfluencer.phone
                      ? ' • '
                      : ''}
                    {infoInfluencer.phone
                      ? `Teléfono: ${infoInfluencer.phone}`
                      : ''}
                  </p>
                )}
              </div>

              {/* ---------------------- DATOS POR RED SOCIAL ---------------------- */}
              <div className="w-full space-y-4 mt-2">
                {/* INSTAGRAM */}
                {infoInfluencer.socials.instagram && (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Instagram className="h-5 w-5 text-pink-500" />
                        <h3 className="font-semibold text-sm">
                          Instagram
                        </h3>
                      </div>
                      {/* 👉 Botón que abre el perfil REAL de Instagram */}
                      <a
                        href={infoInfluencer.socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm">
                          Ver perfil en Instagram
                        </Button>
                      </a>
                    </div>

                    <p className="text-xs text-muted-foreground mb-3">
                      Estadísticas generadas automáticamente para Instagram.
                    </p>

                    {(() => {
                      const stats = getSocialMetrics(
                        infoInfluencer,
                        'instagram',
                      );
                      return (
                        <div className="grid grid-cols-3 text-center gap-2">
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                              Followers
                            </p>
                            <p className="font-bold text-sm">
                              {formatNumber(stats.followers)}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                              Likes
                            </p>
                            <p className="font-bold text-sm">
                              {formatNumber(stats.likes)}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                              Posts
                            </p>
                            <p className="font-bold text-sm">
                              {formatNumber(stats.posts)}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* TIKTOK */}
                {infoInfluencer.socials.tiktok && (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TikTokIcon className="h-5 w-5" />
                        <h3 className="font-semibold text-sm">
                          TikTok
                        </h3>
                      </div>
                      {/* 👉 Botón que abre el perfil REAL de TikTok */}
                      <a
                        href={infoInfluencer.socials.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm">
                          Ver perfil en TikTok
                        </Button>
                      </a>
                    </div>

                    <p className="text-xs text-muted-foreground mb-3">
                      Estadísticas generadas automáticamente para TikTok.
                    </p>

                    {(() => {
                      const stats = getSocialMetrics(
                        infoInfluencer,
                        'tiktok',
                      );
                      return (
                        <div className="grid grid-cols-3 text-center gap-2">
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                              Followers
                            </p>
                            <p className="font-bold text-sm">
                              {formatNumber(stats.followers)}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                              Likes
                            </p>
                            <p className="font-bold text-sm">
                              {formatNumber(stats.likes)}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                              Posts
                            </p>
                            <p className="font-bold text-sm">
                              {formatNumber(stats.posts)}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* FACEBOOK */}
                {infoInfluencer.socials.facebook && (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Facebook className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-sm">
                          Facebook
                        </h3>
                      </div>
                      {/* 👉 Botón que abre el perfil REAL de Facebook */}
                      <a
                        href={infoInfluencer.socials.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm">
                          Ver perfil en Facebook
                        </Button>
                      </a>
                    </div>

                    <p className="text-xs text-muted-foreground mb-3">
                      Estadísticas generadas automáticamente para Facebook.
                    </p>

                    {(() => {
                      const stats = getSocialMetrics(
                        infoInfluencer,
                        'facebook',
                      );
                      return (
                        <div className="grid grid-cols-3 text-center gap-2">
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                              Followers
                            </p>
                            <p className="font-bold text-sm">
                              {formatNumber(stats.followers)}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                              Likes
                            </p>
                            <p className="font-bold text-sm">
                              {formatNumber(stats.likes)}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                              Posts
                            </p>
                            <p className="font-bold text-sm">
                              {formatNumber(stats.posts)}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {!infoInfluencer.socials.instagram &&
                  !infoInfluencer.socials.tiktok &&
                  !infoInfluencer.socials.facebook && (
                    <p className="text-xs text-muted-foreground">
                      Este influencer aún no tiene redes asociadas.
                    </p>
                  )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
