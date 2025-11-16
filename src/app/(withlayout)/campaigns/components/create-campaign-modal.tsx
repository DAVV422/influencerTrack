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
import { useToast } from '@/hooks/use-toast'; 
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import type { SocialPlatform, NewCampaign, CreateCampaignModalProps } from './create-campaign-modal.type';
import type { Campaign } from '@/lib/types';

// Función para guardar campaña vía API
const saveCampaign = async (campaign: Campaign) => {
  const res = await fetch('/api/campaigns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(campaign),
  });
  if (!res.ok) throw new Error('Error saving campaign');
  return res.json();
};

export function CreateCampaignModal({
  open,
  onOpenChange,
  onAddCampaign,
  nextIdGenerator
}: CreateCampaignModalProps) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSocials, setSelectedSocials] = useState<SocialPlatform[]>([]);
  const availableSocials: SocialPlatform[] = ['instagram', 'tiktok', 'facebook'];

  const handleCheckboxChange = (platform: SocialPlatform, isChecked: boolean) => {
    setSelectedSocials(prev =>
      isChecked ? [...prev, platform] : prev.filter(s => s !== platform)
    );
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({ title: 'Error', description: 'Ingrese el nombre de la campaña.', variant: 'destructive' });
      return;
    }
    if (!description.trim()) {
      toast({ title: 'Error', description: 'Ingrese la descripción de la campaña.', variant: 'destructive' });
      return;
    }
    if (!startDate || !endDate) {
      toast({ title: 'Error', description: 'Seleccione fecha de inicio y fin.', variant: 'destructive' });
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast({ title: 'Error', description: 'La fecha de inicio no puede ser posterior a la fecha fin.', variant: 'destructive' });
      return;
    }
    if (selectedSocials.length === 0) {
      toast({ title: 'Error', description: 'Seleccione al menos una red social.', variant: 'destructive' });
      return;
    }

    const newCampaignId = nextIdGenerator();

    const newCampaign: Campaign = {
      id: newCampaignId,
      name,
      description,
      startDate,
      endDate,
      socials: selectedSocials,
      influencerIds: [],
    };

    try {
      const savedCampaign = await saveCampaign(newCampaign);
      onAddCampaign(savedCampaign);

      toast({
        title: 'Éxito!',
        description: `Campaña "${name}" creada correctamente.`,
      });

      onOpenChange(false);
      // Reset form
      setName('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setSelectedSocials([]);
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo guardar la campaña.', variant: 'destructive' });
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nueva Campaña</DialogTitle>
          <DialogDescription>
            Ingrese el nombre, descripción y seleccione las redes sociales para la campaña.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Nombre */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="campaignName" className="text-right">Nombre</Label>
            <Input 
              id="campaignName" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="col-span-3" 
              placeholder="Summer Launch 2026"
            />
          </div>
          {/* Descripción */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">Descripción</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              className="col-span-3 min-h-[80px]" 
              placeholder="Descripción de la campaña"
            />
          </div>
          {/* Fechas */}
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
          {/* Redes Sociales */}
          <div className="grid grid-cols-4 items-start gap-4 pt-2">
            <Label className="text-right pt-2">Redes Sociales</Label>
            <div className="col-span-3 space-y-3">
              {availableSocials.map(platform => (
                <div key={platform} className="flex items-center space-x-2">
                  <Checkbox 
                    id={platform} 
                    checked={selectedSocials.includes(platform)}
                    onCheckedChange={(checked) => handleCheckboxChange(platform, checked as boolean)}
                  />
                  <label htmlFor={platform} className="text-sm font-medium capitalize leading-none">
                    {platform}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Crear Campaña</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
