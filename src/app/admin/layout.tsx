
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation';
import { isSupabaseConfigured } from "@/lib/supabase";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!isSupabaseConfigured) {
    redirect('/login?message=Database is not configured by the administrator.');
  }

  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // A simple role check from user metadata
  const userRole = user?.user_metadata?.role;
  if (userRole !== 'admin') {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
