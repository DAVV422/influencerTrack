import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Users,
  Megaphone,
  Heart,
  BarChart,
  Instagram,
  Facebook,
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis } from 'recharts';
import { TikTokIcon } from '@/components/icons/tiktok-icon';
import { PageHeader } from '@/components/page-header';

const chartData = [
  { platform: 'Instagram', engagement: 186, fill: 'var(--color-instagram)' },
  { platform: 'TikTok', engagement: 305, fill: 'var(--color-tiktok)' },
  { platform: 'Facebook', engagement: 237, fill: 'var(--color-facebook)' },
];

const chartConfig = {
  engagement: {
    label: 'Engagement',
  },
  instagram: {
    label: 'Instagram',
    color: 'hsl(var(--chart-1))',
  },
  tiktok: {
    label: 'TikTok',
    color: 'hsl(var(--chart-2))',
  },
  facebook: {
    label: 'Facebook',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Dashboard" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Influencers
            </CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">150</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Campaigns
            </CardTitle>
            <Megaphone className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +5 since last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2M</div>
            <p className="text-xs text-muted-foreground">
              Across all campaigns
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Engagement
            </CardTitle>
            <BarChart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8%</div>
            <p className="text-xs text-muted-foreground">
              Average across all influencers
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Engagement by Platform</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <RechartsBarChart
                accessibilityLayer
                data={chartData}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <XAxis
                  dataKey="platform"
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}k`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar
                  dataKey="engagement"
                  radius={8}
                />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Top Performing Influencers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src="https://picsum.photos/seed/1/40/40" data-ai-hint="woman smiling" alt="Influencer" className="h-10 w-10 rounded-full" />
                  <div>
                    <p className="font-semibold">Elena Rodriguez</p>
                    <p className="text-sm text-muted-foreground">@elena_styles</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">12.5%</p>
                  <p className="text-sm text-muted-foreground">Engagement</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src="https://picsum.photos/seed/2/40/40" data-ai-hint="man urban" alt="Influencer" className="h-10 w-10 rounded-full" />
                  <div>
                    <p className="font-semibold">Marcus Chen</p>
                    <p className="text-sm text-muted-foreground">@marcus.travels</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">10.2%</p>
                  <p className="text-sm text-muted-foreground">Engagement</p>
                </div>
              </div>
               <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src="https://picsum.photos/seed/3/40/40" data-ai-hint="woman fashion" alt="Influencer" className="h-10 w-10 rounded-full" />
                  <div>
                    <p className="font-semibold">Sophie Dubois</p>
                    <p className="text-sm text-muted-foreground">@sophie.foodie</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">9.8%</p>
                  <p className="text-sm text-muted-foreground">Engagement</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
