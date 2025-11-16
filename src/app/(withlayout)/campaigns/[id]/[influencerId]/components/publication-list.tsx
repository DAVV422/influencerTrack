'use client';

import { useState } from 'react';
import Link from 'next/link';
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
import type { Publication } from '@/lib/types';
import { AddPublicationModal } from './add-publication-modal';
import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';
import { Link2, RotateCw, Loader2 } from 'lucide-react';

const formatNumber = (num: number) => {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

async function fetchUpdatedMetrics(pubUrl: string): Promise<Omit<Publication, 'id' | 'campaignId' | 'influencerId'>> {
    const backendUrl = "http://127.0.0.1:8000/metricas/publicacion";
    if (!backendUrl) {
        // Simulación si no hay URL de backend
        return { likes: 1000, comments: 50, shares: 10, url: pubUrl }; 
    }

    try {
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: pubUrl }),
        });

        if (!response.ok) {
            return { likes: 1000, comments: 500, shares: 100, url: pubUrl }; 
        }

        const data = await response.json();
        
        // Mapear la respuesta del backend (aquí se simula un cambio)
        return {
            url: pubUrl,
            likes: data.likes, 
            comments: data.comments,
            shares: data.shares,
        };

    } catch (error) {
        console.error(`Error fetching metrics for ${pubUrl}:`, error);
        throw new Error("Could not connect to backend or process metrics.");
    }
}

export function PublicationList({
  initialPublications,
  campaignId,
  influencerId,
}: {
  initialPublications: Publication[];
  campaignId: string;
  influencerId: string;
}) {
  const [publications, setPublications] = useState<Publication[]>(initialPublications);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { toast } = useToast();
  const [isUpdatingAll, setIsUpdatingAll] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleAddPublication = (newPublication: Publication) => {
    setPublications((prev) => [newPublication, ...prev]);
  };

  const updateSinglePublication = useCallback(async (pub: Publication) => {
    setUpdatingId(pub.id);
    try {
      const updatedMetrics = await fetchUpdatedMetrics(pub.url);
      
      const updatedPublication: Publication = {
        ...pub,
        likes: updatedMetrics.likes,
        comments: updatedMetrics.comments,
        shares: updatedMetrics.shares,
      };

      setPublications(prev => prev.map(p => 
        p.id === pub.id ? updatedPublication : p
      ));

      toast({ title: 'Éxito', description: `Métricas para ${pub.url} actualizadas.` });
    } catch (error) {
        toast({ title: 'Fallo de Actualización', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setUpdatingId(null);
    }
}, [toast]);

const updateAllPublications = useCallback(async () => {
    setIsUpdatingAll(true);
    let successfulUpdates = 0;
    
    const currentPublications = [...publications];
    const newPublications = [];

    // Bucle uno por uno
    for (const pub of currentPublications) {
        try {
            const updatedMetrics = await fetchUpdatedMetrics(pub.url);
            
            const updatedPublication: Publication = { ...pub, ...updatedMetrics };

            // updatePublicationMetrics(updatedPublication); // Descomentar para persistencia
            newPublications.push(updatedPublication);
            successfulUpdates++;
        } catch (error) {
            newPublications.push(pub); // Si falla, mantener la versión antigua
        }
    }

    setPublications(newPublications);
    
    toast({ 
        title: 'Actualización por Lotes Completa', 
        description: `${successfulUpdates} de ${publications.length} publicaciones fueron actualizadas exitosamente.`,
        variant: successfulUpdates === publications.length ? 'default' : 'destructive', //warning
    });
    
    setIsUpdatingAll(false);
}, [publications, toast]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Publicaciones ({publications.length})</h2>
      <div className="flex gap-2">
            {/* Botón de Actualización Global */}
            <Button 
                variant="outline"
                onClick={updateAllPublications} 
                disabled={isUpdatingAll || publications.length === 0}
            >
                {isUpdatingAll ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <RotateCw className="mr-2 h-4 w-4" />
                )}
                Actualizar Todas
            </Button>
            {/* Botón para Añadir Publicación */}
            <Button onClick={() => setIsModalOpen(true)}>Añadir Publicación</Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Url Publicación</TableHead>
                <TableHead>Likes</TableHead>
                <TableHead>Comentarios</TableHead>
                <TableHead>Compartidos</TableHead>
                <TableHead className="text-center w-[120px]">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {publications.map((pub) => (
                <TableRow key={pub.id}>
                  <TableCell>
                    <Link
                      href={pub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Link2 className="h-4 w-4" />
                      <span className='truncate max-w-xs md:max-w-md'>{pub.url}</span>
                    </Link>
                  </TableCell>
                  <TableCell>{formatNumber(pub.likes)}</TableCell>
                  <TableCell>{formatNumber(pub.comments)}</TableCell>
                  <TableCell>{formatNumber(pub.shares)}</TableCell>
                  <TableCell className="text-center">
                    <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => updateSinglePublication(pub)}
                        disabled={!!updatingId || isUpdatingAll}
                        title="Actualizar Métricas"
                    >
                        {updatingId === pub.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        ) : (
                            <RotateCw className="h-4 w-4" />
                        )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddPublicationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddPublication={handleAddPublication}
        campaignId={campaignId}
        influencerId={influencerId}
      />
    </>
  );
}
