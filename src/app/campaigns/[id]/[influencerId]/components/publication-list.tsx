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
import { Link2 } from 'lucide-react';

const formatNumber = (num: number) => {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

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

  const handleAddPublication = (newPublication: Publication) => {
    setPublications((prev) => [newPublication, ...prev]);
  };

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => setIsModalOpen(true)}>Add Publication</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Publication URL</TableHead>
                <TableHead>Likes</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Shares</TableHead>
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
