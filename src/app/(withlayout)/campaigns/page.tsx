'use client'; // Necesitas hacerlo un Client Component para usar useState y useEffect

import Link from 'next/link';
import { useState, useEffect } from 'react'; // <-- Importar useState y useEffect
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
import { PageHeader } from '@/components/page-header';
// Se asume que getCampaigns ahora devuelve Promise<Campaign[]>
import { getCampaigns } from '@/lib/data'; 
import { Instagram, Facebook, Loader2 } from 'lucide-react'; // Importar Loader2 para el spinner
import { TikTokIcon } from '@/components/icons/tiktok-icon';
import { Badge } from '@/components/ui/badge';
import { CreateCampaignModal } from './components/create-campaign-modal'; 
import type { NewCampaign } from './components/create-campaign-modal.type'; 

// Asumo que tienes un tipo de Campaign (que incluye el 'id', 'name', 'socials', etc.)
// Para este ejemplo, Campaign será el tipo retornado por getCampaigns y compatible con NewCampaign
type Campaign = NewCampaign & { id: string }; // Asumo que Campaign es NewCampaign + un id

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

export default function CampaignsPage() {
  // Estado para los datos de la campaña, inicializado como un array vacío
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  
  // Estado para manejar la carga de datos
  const [isLoading, setIsLoading] = useState(true); 

  // Estado para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔄 useEffect para cargar los datos asíncronamente
  useEffect(() => {
    // Definimos una función asíncrona dentro de useEffect
    const loadCampaigns = async () => {
      try {
        setIsLoading(true); // Iniciar la carga
        // Esperar a que la promesa se resuelva
        const initialCampaigns: Campaign[] = await getCampaigns(); 
        setCampaigns(initialCampaigns);
      } catch (error) {
        console.error("Error loading campaigns:", error);
        // Manejar el error de manera apropiada (ej. mostrar un mensaje al usuario)
      } finally {
        setIsLoading(false); // Finalizar la carga
      }
    };

    loadCampaigns();
  }, []); // El array vacío asegura que solo se ejecute al montar el componente

  const getNextCampaignId = (): number => {
    if (campaigns.length === 0) {
      return 1;
    }
    // Encuentra el ID más grande en la lista actual. 
    // Usamos Number() para asegurar la comparación si los IDs vienen como string.
    const maxId = campaigns.reduce((max, campaign) => 
        Math.max(max, Number(campaign.id)), 0);
        
    // Se asume que el ID de NewCampaign debe ser compatible con un número (como en el tipo Campaign)
    return maxId + 1;
  };

  // Función para manejar la adición de una nueva campaña
  const handleAddCampaign = (newCampaign: any) => {
    console.log(newCampaign.campaign)
    // Debemos convertir NewCampaign a Campaign añadiendo el id
    const campaignWithId: Campaign = { 
        ...newCampaign, 
        id: getNextCampaignId().toString() // Usamos el ID generado
    }; 
    
    // Añade la nueva campaña al principio de la lista
    setCampaigns(prev => [newCampaign.campaign, ...prev]); 
  };
  
  // --- Renderizado del Componente ---
  
  // Contenido de la tabla basado en el estado de carga
  const tableContent = isLoading ? (
    <TableRow>
        <TableCell colSpan={6} className="text-center py-10">
            <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
            Cargando campañas...
        </TableCell>
    </TableRow>
  ) : (
    console.log(campaigns),
    campaigns?.map((campaign) => (
      <TableRow key={campaign.id}>
        <TableCell className="font-medium">{campaign.name}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {/* Asegúrate de que 'socials' sea un array de SocialPlatform */}
            {campaign.socials.map((social) => ( 
              <div key={social} className="rounded-full bg-secondary p-1.5">
                {platformIcons[social as keyof typeof platformIcons]}
              </div>
            ))}
          </div>
        </TableCell>
        <TableCell>
          <Badge variant="outline" className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[100px]">
            {campaign.influencerIds.length} Influencers
          </Badge>
        </TableCell>
        <TableCell>
          {formatDate(campaign.startDate)}
        </TableCell>
        <TableCell>
          {formatDate(campaign.endDate)}
        </TableCell>
        <TableCell className="text-right">
          <Button asChild variant="outline" size="sm">
            <Link href={`/campaigns/${campaign.id}`}>Ver Detalles</Link>
          </Button>
        </TableCell>
      </TableRow>
    ))
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Campaigns" 
        action={
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
                {tableContent}
            </TableBody>
          </Table>
          {/* Opcional: Mostrar mensaje si no hay campañas y no está cargando */}
          {!isLoading && campaigns.length === 0 && (
            <div className="text-center py-8 text-gray-500">
                No hay campañas disponibles. ¡Crea una!
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* El Modal de Creación de Campaña */}
      {isModalOpen && (
        <CreateCampaignModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onAddCampaign={handleAddCampaign}
          nextIdGenerator={getNextCampaignId} // Esta prop parece redundante
        />
      )}
    </div>
  );
}