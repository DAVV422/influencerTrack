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
import { FileUp, Link as LinkIcon, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Importar componentes Tabs (asumo que los tienes)

interface AddPublicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPublication: (publication: Publication) => void;
  campaignId: string;
  influencerId: string;
}

async function fetchMetricsAndCreatePublication(
  pubUrl: string,
  campaignId: string,
  influencerId: string,
): Promise<Publication | null> {
  console.log(`Attempting to fetch metrics for: ${pubUrl}`);

  const backendUrl = "http://127.0.0.1:8000/metricas/publicacion";

  if (!backendUrl) {
    console.error("NEXT_PUBLIC_BACKEND_API_URL is not defined in the environment.");
    return null;
  }
  
  try {
    console.log(`Calling backend at ${backendUrl} for URL: ${pubUrl}`);

    // 2. HACER LA LLAMADA HTTP (FETCH)
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // 🚨 ENVIAR LA URL DE LA PUBLICACIÓN EN FORMATO JSON
      body: JSON.stringify({ url: pubUrl }), 
    });

    // Manejar errores HTTP (ej: 404, 500)
    if (!response.ok) {
      throw new Error(`Backend request failed with status: ${response.status}`);
    }

    // 3. PROCESAR LA RESPUESTA
    // Asumo que tu backend retorna un JSON con los datos de la publicación.
    const data = await response.json(); 

    // Aquí deberías mapear la respuesta de tu backend a tu tipo 'Publication'
    const newPublication: Publication = {
      id: data.id || Date.now().toString() + Math.random().toString().slice(2, 6),
      url: pubUrl,
      likes: data.likes,
      comments: data.comments || 0,
      shares: data.shares || 0,
      campaignId,
      influencerId,
      // Si tu backend devuelve más métricas, añádelas aquí.
    };
    
    return newPublication;

  } catch (error) {
    console.error(`Failed to fetch metrics for ${pubUrl}:`, error);
    return null; 
  }
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
  const [file, setFile] = useState<File | null>(null); // Estado para el archivo CSV
  const [isProcessing, setIsProcessing] = useState(false); // Estado de carga
  const [activeTab, setActiveTab] = useState('url'); // Estado para la pestaña activa

  // --- Lógica de Simulación ---
  const createPublication = (pubUrl: string): Publication => ({
    id: Date.now().toString() + Math.random().toString().slice(2, 6), // ID único
    url: pubUrl,
    likes: Math.floor(Math.random() * 50000),
    comments: Math.floor(Math.random() * 2000),
    shares: Math.floor(Math.random() * 1000),
    campaignId,
    influencerId,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      setFile(null);
      if (selectedFile) {
        toast({
          title: 'Error',
          description: 'Please select a valid CSV file.',
          variant: 'destructive',
        });
      }
    }
  };

  // --- Lógica de Procesamiento CSV ---
  const processCsvFile = (file: File) => {
    return new Promise<string[]>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        // Asume que cada URL está en una nueva línea o separada por comas
        const urls = text.split(/[\n,]/)
                         .map(line => line.trim())
                         .filter(url => url.length > 0 && URL.canParse(url));
        resolve(urls);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  // --- Lógica de Envío Principal ---
  const handleSubmit = async () => {
    setIsProcessing(true);
    let urlsToProcess: string[] = [];
    let processingFailed = false;

    if (activeTab === 'url') {
      // --- Modo URL Individual ---
      if (!url || !URL.canParse(url)) {
        toast({ title: 'Error', description: 'Please enter a valid URL.', variant: 'destructive' });
        setIsProcessing(false);
        return;
      }
      urlsToProcess = [url];
    } else if (activeTab === 'csv') {
      // --- Modo CSV Upload ---
      if (!file) {
        toast({ title: 'Error', description: 'Please select a CSV file to upload.', variant: 'destructive' });
        setIsProcessing(false);
        return;
      }
      try {
        urlsToProcess = await processCsvFile(file);
        if (urlsToProcess.length === 0) {
            toast({ title: 'Error', description: 'No valid URLs found in the CSV file.', variant: 'destructive' });
            setIsProcessing(false);
            return;
        }
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to read the CSV file.', variant: 'destructive' });
        setIsProcessing(false);
        return;
      }
    }

    // Procesar todas las URLs
    // const addedPublications: Publication[] = [];
    // urlsToProcess.forEach(pubUrl => {
    //   const newPublication = createPublication(pubUrl);
    //   addPublication(newPublication); // Llama a la función de guardar datos
    //   onAddPublication(newPublication); // Actualiza el estado local
    //   addedPublications.push(newPublication);
    // });
    
    // const count = addedPublications.length;

    const addedPublications: Publication[] = [];
    let successfulCalls = 0;
    
    // 🚨 Bucle para hacer la llamada a la URL una por una
    for (const pubUrl of urlsToProcess) {
      const publication = await fetchMetricsAndCreatePublication(
        pubUrl,
        campaignId,
        influencerId
      );

      if (publication) {
        addPublication(publication);
        onAddPublication(publication);
        addedPublications.push(publication);
        successfulCalls++;
      } else {
        // Notificar el fallo de una URL en particular
        toast({
            title: 'URL Failed',
            description: `Could not fetch metrics for: ${pubUrl}. Skipping.`,
            variant: 'destructive', //warning
        });
      }
    }

    // toast({
    //   title: 'Publications added!',
    //   description: `${count} publication(s) added successfully. Metrics have been fetched and added to the list.`,
    // });

    if (successfulCalls > 0) {
        toast({
            title: 'Publications added!',
            description: `${successfulCalls} publication(s) added successfully.`,
        });
    } else if (urlsToProcess.length > 0) {
         toast({
            title: 'Process Complete',
            description: `No publications were added due to errors.`,
            variant: 'destructive',
        });
    }
    
    // Resetear
    onOpenChange(false);
    setUrl('');
    setFile(null);
    setIsProcessing(false);
    setActiveTab('url');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Add Publication</DialogTitle>
          <DialogDescription>
            Enter the URL or upload a CSV file containing multiple publication URLs.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url"><LinkIcon className="h-4 w-4 mr-2" /> Single URL</TabsTrigger>
                <TabsTrigger value="csv"><FileUp className="h-4 w-4 mr-2" /> Upload CSV</TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="pt-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="url" className="text-right">URL</Label>
                    <Input 
                        id="url" 
                        type="url"
                        value={url} 
                        onChange={e => setUrl(e.target.value)} 
                        className="col-span-3" 
                        placeholder="https://instagram.com/p/..." 
                    />
                </div>
            </TabsContent>

            <TabsContent value="csv" className="pt-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="csv-file" className="text-right">CSV File</Label>
                    <Input 
                        id="csv-file" 
                        type="file" 
                        accept=".csv"
                        onChange={handleFileChange}
                        className="col-span-3"
                    />
                </div>
                {file && (
                    <p className="text-sm text-muted-foreground mt-2 text-center col-span-4">
                        File selected: **{file.name}**
                    </p>
                )}
            </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isProcessing}>
            {isProcessing ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                </>
            ) : activeTab === 'url' ? (
                'Add and Fetch Metrics'
            ) : (
                'Upload and Fetch Metrics'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}