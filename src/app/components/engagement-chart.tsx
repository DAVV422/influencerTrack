'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis } from 'recharts';

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

export function EngagementChart() {
  return (
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
            <Bar dataKey="engagement" radius={8} />
          </RechartsBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
