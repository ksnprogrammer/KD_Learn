
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { MembershipPageContent } from "@/components/membership-page";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserProvider } from "@/hooks/use-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from '@/lib/supabase';

export default async function MembershipPage() {
    let user = null;

    if (isSupabaseConfigured) {
      const supabase = await createSupabaseServerClient();
      const { data } = await supabase.auth.getUser();
      user = data.user;
    }

    return (
        <UserProvider user={user}>
            <SidebarProvider>
                <div className="relative flex min-h-dvh bg-background">
                    <AppSidebar />
                    <div className="relative flex flex-col flex-1">
                        <AppHeader />
                        <main className="flex-1 p-4 sm:p-6 lg:p-8">
                            <MembershipPageContent />
                        </main>
                    </div>
                </div>
            </SidebarProvider>
        </UserProvider>
    );
}
