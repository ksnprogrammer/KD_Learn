
'use client'

import { Bell, User, Settings, LogOut } from 'lucide-react'
import Link from 'next/link';
import { useState, useEffect } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { logout } from '@/app/actions';
import { useUser } from '@/hooks/use-user';
import { usePathname } from 'next/navigation';

export function AppHeader() {
  const [progress, setProgress] = useState(0);
  const user = useUser();
  const pathname = usePathname();

  useEffect(() => {
    // Simulate XP gain
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  const getPageTitle = () => {
    if (!user) return 'Public Area';
    if (pathname.includes('/admin')) return "King's Court";
    if (pathname.includes('/settings')) return "Settings";
    if (pathname.includes('/profile')) return "Knight Profile";
    if (pathname.includes('/story-weaver')) return "Story Weaver";
    if (pathname.includes('/hall-of-legends')) return "Hall of Legends";
    if (pathname.includes('/weapon-training')) return "Weapon Training";
    if (pathname.includes('/mental-training')) return "Mental Training";
    if (pathname.includes('/team-wars')) return "Team Wars";
    if (pathname.includes('/training/')) return "Training Session";
    if (pathname.includes('/membership')) return "Membership";
    if (pathname.includes('/donate')) return "Donate";
    return 'Dashboard';
  }
  
  const userName = user?.user_metadata?.name || 'Knight';
  const userLevel = user ? `Level 5` : 'Visitor';

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="font-headline text-xl font-semibold tracking-tight">
        {getPageTitle()}
      </h1>
      <div className="ml-auto flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell />
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://placehold.co/100x100.png" alt={userName} data-ai-hint="dragon avatar" />
                <AvatarFallback>{userName?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-2">
                <p className="font-headline text-base font-medium leading-none">
                  {userName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userLevel}
                </p>
                {user && (
                  <div className="flex items-center gap-2">
                    <Progress value={progress} className="h-2" />
                    <span className="text-xs text-muted-foreground">{progress}%</span>
                  </div>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">
                <User className="mr-2" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <Settings className="mr-2" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <form action={logout}>
                <button type="submit" className='w-full'>
                    <DropdownMenuItem>
                        <LogOut className="mr-2" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </button>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
