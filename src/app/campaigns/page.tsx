import Link from 'next/link';
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
import { campaigns, influencers } from '@/lib/data';
import { Instagram, Facebook } from 'lucide-react';
import { TikTokIcon } from '@/components/icons/tiktok-icon';
import { Badge } from '@/components/ui/badge';

const platformIcons = {
  instagram: <Instagram className="h-5 w-5" />,
  tiktok: <TikTokIcon className="h-5 w-5" />,
  facebook: <Facebook className="h-5 w-5" />,
};

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Campaigns" action={<Button>Create Campaign</Button>} />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Networks</TableHead>
                <TableHead>Influencers</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {campaign.socials.map((social) => (
                        <div key={social} className="rounded-full bg-secondary p-1.5">
                            {platformIcons[social]}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{campaign.influencerIds.length} Influencers</Badge>
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
    </div>
  );
}
