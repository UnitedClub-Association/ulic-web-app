import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import NavbarLoader from './NavbarLoader';

export default async function Navbar() {
  const cookieStore = await cookies(); // Await the cookies function for Next.js 15+
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // THE FIX: Remove the 'key' prop. The AuthProvider handles re-rendering.
  return <NavbarLoader serverSession={session} />;
}