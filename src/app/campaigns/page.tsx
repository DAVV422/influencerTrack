'use client'; // Necesitas hacerlo un Client Component para usar useState

import Link from 'next/link';
import { useState } from 'react'; // <-- Importar useState
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
// Importa la función getCampaigns, la nueva función de guardar (si la tienes) 
// y el tipo de Campaña (asumo que existe)
import { getCampaigns } from '@/lib/data'; 
import { Instagram, Facebook } from 'lucide-react';
import { TikTokIcon } from '@/components/icons/tiktok-icon';
import { Badge } from '@/components/ui/badge';
import { CreateCampaignModal } from './components/create-campaign-modal'; // <-- Ajusta la ruta
import type { NewCampaign } from './components/create-campaign-modal.type'; // <-- Ajusta la ruta

// Asumo que tu tipo de Campaign existente es compatible o se puede extender con NewCampaign
// Para la demostración, usaremos un tipo simplificado o el tipo NewCampaign.

const platformIcons = {
  instagram: <Instagram className="h-5 w-5" />,
  tiktok: <TikTokIcon className="h-5 w-5" />,
  facebook: <Facebook className="h-5 w-5" />,
};

const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    // Se asume que dateString es un formato YYYY-MM-DD
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

// Reemplaza 'export default function CampaignsPage()' con el componente funcional
export default function CampaignsPage() {
  // Estado para los datos de la campaña
  const initialCampaigns = getCampaigns(); 
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  
  // Estado para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getNextCampaignId = (): number => {
    if (campaigns.length === 0) {
      return 1; // Primer ID si la lista está vacía
    }
    // Encuentra el ID más grande en la lista actual
    const maxId = campaigns.reduce((max, campaign) => 
        // Asegúrate de que los IDs sean números antes de comparar
        Math.max(max, Number(campaign.id)), 0);
        
    return maxId + 1;
  };

  // Función para manejar la adición de una nueva campaña
  const handleAddCampaign = (newCampaign: NewCampaign) => {
    // Añade la nueva campaña al principio de la lista
    setCampaigns(prev => [newCampaign, ...prev]); 
  };
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Campaigns" 
        action={
            // Botón para abrir el modal
            <Button onClick={() => setIsModalOpen(true)}>
                Crear campaña
            </Button>
        } 
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre Campaña</TableHead>
                <TableHead>Redes Sociales</TableHead>
                <TableHead>Influencers</TableHead>
                <TableHead>Fecha Inicio </TableHead>
                <TableHead>Fecha Fin</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* Asegúrate de que 'socials' sea un array de SocialPlatform */}
                      {campaign.socials.map((social) => ( 
                        <div key={social} className="rounded-full bg-secondary p-1.5">
                          {platformIcons[social]}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {/* Asumo que 'influencerIds' es un array en tu tipo de campaña */}
                    <Badge variant="outline" className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[100px]">{campaign.influencerIds.length} Influencers</Badge>
                  </TableCell>
                  <TableCell>
                    {formatDate(campaign.startDate)}
                  </TableCell>
                  <TableCell>
                    {formatDate(campaign.endDate)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/campaigns/${campaign.id}`}>View Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* El Modal de Creación de Campaña */}
      <CreateCampaignModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddCampaign={handleAddCampaign}
        nextIdGenerator={getNextCampaignId}
      />
    </div>
  );
}