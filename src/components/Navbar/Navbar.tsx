import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import NavbarLoader from './NavbarLoader';

export default async function Navbar() {
  const cookieStore = cookies();
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

  // Fetch the user session ON THE SERVER for the fastest initial render.
  const { data: { session } } = await supabase.auth.getSession();

  // Pass the initial session data down to the client-side loader.
  // Using a key helps ensure React remounts it correctly if the session changes.
  return <NavbarLoader key={session?.user?.id} serverSession={session} />;
}