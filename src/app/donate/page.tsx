
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { DonatePageContent } from "@/components/donate-page";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserProvider } from "@/hooks/use-user";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers';

export default async function DonatePage() {
    const cookieStore = cookies();
    const supabase = createServerClient({ cookies: () => cookieStore });
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <UserProvider user={user}>
            <SidebarProvider>
                <div className="relative flex min-h-dvh bg-background">
                    <AppSidebar />
                    <div className="relative flex flex-col flex-1">
                        <AppHeader />
                        <main className="flex-1 p-4 sm:p-6 lg:p-8">
                            <DonatePageContent />
                        </main>
                    </div>
                </div>
            </SidebarProvider>
        </UserProvider>
    );
}
