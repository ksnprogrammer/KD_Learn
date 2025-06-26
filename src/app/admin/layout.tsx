import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers';
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

  const cookieStore = cookies();
  const supabase = createServerClient({ cookies: () => cookieStore });
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
