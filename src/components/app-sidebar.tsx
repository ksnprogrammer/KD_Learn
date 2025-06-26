'use client'

import {
  BrainCircuit,
  Briefcase,
  Castle,
  Feather,
  Gem,
  HeartHandshake,
  LayoutDashboard,
  Library,
  MessageSquare,
  Settings,
  Swords,
  UserCircle,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Logo } from '@/components/logo'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar'

export function AppSidebar() {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/dashboard')}>
              <Link href="/dashboard">
                <LayoutDashboard />
                Dashboard
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        <SidebarGroup>
          <SidebarGroupLabel>Training Grounds</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/dashboard/weapon-training')}>
                <Link href="/dashboard/weapon-training">
                  <Swords />
                  Weapon Training
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/dashboard/mental-training')}>
                <Link href="/dashboard/mental-training">
                  <BrainCircuit />
                  Mental Training
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/dashboard/team-wars')}>
                <Link href="/dashboard/team-wars">
                  <Users />
                  Team Wars
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        
        <SidebarGroup>
           <SidebarGroupLabel>Kingdom Archives</SidebarGroupLabel>
           <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/dashboard/story-weaver')}>
                  <Link href="/dashboard/story-weaver">
                    <Feather />
                    Story Weaver
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/dashboard/hall-of-legends')}>
                  <Link href="/dashboard/hall-of-legends">
                    <Library />
                    Hall of Legends
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
           </SidebarMenu>
        </SidebarGroup>

      </SidebarContent>
      <SidebarContent className="!flex-initial">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/dashboard/profile')}>
              <Link href="/dashboard/profile">
                <UserCircle />
                My Profile
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL_URL || '#'}>
                <MessageSquare />
                WhatsApp
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/membership')}>
              <Link href="/membership">
                <Gem />
                Membership
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/donate')}>
              <Link href="/donate">
                <HeartHandshake />
                Donate
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarSeparator />
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/careers')}>
              <Link href="/careers">
                <Briefcase />
                Join the Wizards
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/dashboard/settings')}>
              <Link href="/dashboard/settings">
                <Settings />
                Settings
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/admin')}>
              <Link href="/admin">
                <Castle />
                King's Court
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
