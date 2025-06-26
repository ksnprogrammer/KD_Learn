'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';
import { AIModuleCreator } from '@/components/ai-module-creator';
import { SidebarProvider } from '@/components/ui/sidebar';

export function Dashboard() {
    return (
        <SidebarProvider>
            <div className="relative flex min-h-dvh bg-background">
                <AppSidebar />
                <div className="relative flex flex-col flex-1">
                    <AppHeader />
                    <main className="flex-1 p-4 sm:p-6 lg:p-8">
                        <AIModuleCreator />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}
