'use client'

import {
  BookOpen,
  Castle,
  Briefcase,
  FlaskConical,
  Gem,
  HeartHandshake,
  LayoutDashboard,
  Leaf,
  MessageSquare,
  Settings,
  Sigma,
  Trophy,
  UserCircle,
  Zap,
} from 'lucide-react'
import Link from 'next/link'

import { Logo } from '@/components/logo'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar'

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive>
              <Link href="/dashboard">
                <LayoutDashboard />
                Dashboard
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Leaf className="text-biology" />
              The Verdant Dragons
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <FlaskConical className="text-chemistry" />
              The Azure Dragons
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Zap className="text-physics" />
              The Crimson Dragons
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Sigma className="text-maths" />
              The Golden Dragons
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton>
              <BookOpen className="text-generalScience" />
              The Argent Dragons
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/profile">
                <UserCircle />
                My Profile
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard">
                <Trophy />
                Leaderboards
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarContent className="!flex-initial">
        <SidebarMenu>
           <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL_URL || '#'}>
                <MessageSquare />
                WhatsApp
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/membership">
                <Gem />
                Membership
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/donate">
                <HeartHandshake />
                Donate
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarSeparator />
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/careers">
                <Briefcase />
                Join the Wizards
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/settings">
                <Settings />
                Settings
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
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
