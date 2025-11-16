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
import { Checkbox } from '@/components/ui/checkbox';
// Asegúrate de que este hook esté disponible en tu proyecto
import { useToast } from '@/hooks/use-toast'; 
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import type { SocialPlatform, NewCampaign, CreateCampaignModalProps } from './create-campaign-modal.type'; // Ajusta la ruta

// Simulación de la función de guardar campaña para que el código compile
const saveCampaign = (campaign: NewCampaign) => {
    console.log('Campaign saved:', campaign);
};


export function CreateCampaignModal({
  open,
  onOpenChange,
  onAddCampaign,
  nextIdGenerator
}: CreateCampaignModalProps) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState(''); // <-- Nuevo estado
  const [startDate, setStartDate] = useState('');     // <-- Nuevo estado
  const [endDate, setEndDate] = useState('');
  // Estado para manejar las plataformas seleccionadas
  const [selectedSocials, setSelectedSocials] = useState<SocialPlatform[]>([]);

  const availableSocials: SocialPlatform[] = ['instagram', 'tiktok', 'facebook'];

  const handleCheckboxChange = (platform: SocialPlatform, isChecked: boolean) => {
    setSelectedSocials((prev) => 
      isChecked
        ? [...prev, platform] // Añadir si está marcado
        : prev.filter((s) => s !== platform) // Quitar si está desmarcado
    );
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a name for the campaign.',
        variant: 'destructive',
      });
      return;
    }
    if (!description.trim()) {
      toast({ title: 'Error', description: 'Please enter a description for the campaign.', variant: 'destructive' });
      return;
    }
    if (!startDate || !endDate) {
      toast({ title: 'Error', description: 'Please select both start and end dates.', variant: 'destructive' });
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast({ title: 'Error', description: 'The start date cannot be after the end date.', variant: 'destructive' });
      return;
    }
    if (selectedSocials.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one social network.',
        variant: 'destructive',
      });
      return;
    }

    const newCampaignId = nextIdGenerator();

    // Simulamos la creación de la nueva campaña
    const newCampaign: NewCampaign = {
      id: newCampaignId,
      name,
      description, // <-- Añadido
      startDate,   // <-- Añadido
      endDate,
      socials: selectedSocials,
      influencerIds: [], // Inicialmente vacía
    };

    // saveCampaign(newCampaign); // Descomentar en tu app real

    onAddCampaign(newCampaign);

    toast({
      title: 'Success!',
      description: `Campaign "${name}" has been created.`,
    });
    
    onOpenChange(false);
    // Reset form
    setName('');
    setDescription(''); // Reset
    setStartDate('');   // Reset
    setEndDate('');
    setSelectedSocials([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nueva Campaña</DialogTitle>
          <DialogDescription>
            Ingrese el nombre de la campaña y seleccione las redes sociales para la campaña.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Campo Nombre de Campaña */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="campaignName" className="text-right">
              Nombre
            </Label>
            <Input 
              id="campaignName" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="col-span-3" 
              placeholder="Summer Launch 2026"
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">Descripción</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              className="col-span-3 min-h-[80px]" 
              placeholder="Brief description of the campaign goals and content."
            />
          </div>

          {/* Campos Fechas */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startDate" className="text-right">Fecha Inicio</Label>
            <Input 
              id="startDate" 
              type="date"
              value={startDate} 
              onChange={e => setStartDate(e.target.value)} 
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endDate" className="text-right">Fecha Fin</Label>
            <Input 
              id="endDate" 
              type="date"
              value={endDate} 
              onChange={e => setEndDate(e.target.value)} 
              className="col-span-3" 
            />
          </div>

          {/* Selección de Redes Sociales */}
          <div className="grid grid-cols-4 items-start gap-4 pt-2">
            <Label className="text-right pt-2">
              Redes Sociales
            </Label>
            <div className="col-span-3 space-y-3">
              {availableSocials.map((platform) => (
                <div key={platform} className="flex items-center space-x-2">
                  <Checkbox 
                    id={platform} 
                    checked={selectedSocials.includes(platform)}
                    onCheckedChange={(checked) => handleCheckboxChange(platform, checked as boolean)}
                  />
                  <label
                    htmlFor={platform}
                    className="text-sm font-medium capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {platform}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Crear Campaña
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}