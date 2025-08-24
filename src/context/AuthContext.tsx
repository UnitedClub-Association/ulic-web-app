'use client';
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { FontTarget } from '@/lib/fonts';

// Type for the font preferences object
type FontPreferences = {
  [key in FontTarget]: string;
};

type AuthContextType = {
  user: User | null;
  fullName: string | null;
  username: string | null; 
  role: string | null;
  theme: string | null;
  fontPrefs: FontPreferences | null; // <-- NEW: Add font preferences
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultFonts: FontPreferences = {
  primary: 'azonix',
  secondary: 'molgan',
  body: 'xeroda',
  accent: 'a-astro-space',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [theme, setTheme] = useState<string | null>('tokyo-night');
  const [fontPrefs, setFontPrefs] = useState<FontPreferences | null>(defaultFonts);
  const [loading, setLoading] = useState(true);

  const getFullUserProfile = useCallback(async (authUser: User | null) => {
    if (!authUser) {
      setUser(null);
      setFullName(null);
      setUsername(null);
      setRole(null);
      setTheme('tokyo-night');
      setFontPrefs(defaultFonts);
      setLoading(false);
      return;
    }
    
    // **FIX**: Now fetches font_preferences as well
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('full_name, username, role, theme, font_preferences')
      .eq('id', authUser.id)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
    }
    
    setUser(authUser);
    setFullName(profile?.full_name || null);
    setUsername(profile?.username || null);
    setRole(profile?.role || 'member');
    setTheme(profile?.theme || 'tokyo-night');
    setFontPrefs(profile?.font_preferences || defaultFonts);
    setLoading(false);

  }, [supabase]);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    await getFullUserProfile(session?.user ?? null);
  }, [supabase, getFullUserProfile]);

  useEffect(() => {
    refreshUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      refreshUser();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []); // Run only once on mount

  const value = { user, fullName, username, role, theme, fontPrefs, loading, refreshUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};