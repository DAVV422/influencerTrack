'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart,
  Users,
  Megaphone,
  BotMessageSquare,
  PanelLeft,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
        return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Button
              variant="ghost"
              size="icon"
              className="group-data-[collapsible=icon]:hidden"
              asChild
            >
              <Link href="/">
                <BotMessageSquare className="h-7 w-7 text-primary" />
              </Link>
            </Button>
            <h2 className="text-xl font-semibold text-primary group-data-[collapsible=icon]:hidden">
              METRIKENOS
            </h2>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/')}
                tooltip={{ children: 'Dashboard' }}
              >
                <Link href="/">
                  <BarChart />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/influencers')}
                tooltip={{ children: 'Influencers' }}
              >
                <Link href="/influencers">
                  <Users />
                  <span>Influencers</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/campaigns')}
                tooltip={{ children: 'Campaigns' }}
              >
                <Link href="/campaigns">
                  <Megaphone />
                  <span>Campaigns</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
            <SidebarTrigger className="md:hidden"/>
            <div/>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
