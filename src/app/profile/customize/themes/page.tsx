'use client';
import { useState, useEffect } from 'react';
import styles from '../customize.module.css';
import { themes } from '@/lib/themes';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function ThemesPage() {
  const { user, refreshUser } = useAuth();
  const supabase = createClient();
  const [activeTheme, setActiveTheme] = useState('tokyo-night');

  useEffect(() => {
    // Set initial active theme from context or localStorage as a fallback
    const savedTheme = localStorage.getItem('ulic-active-theme') || 'tokyo-night';
    setActiveTheme(savedTheme);
  }, []);

  const applyTheme = async (themeId: string) => {
    if (!user) {
      toast.error("You must be logged in to change your theme.");
      return;
    }

    const toastId = toast.loading(`Applying ${themeId} theme...`);

    // 1. Update the database
    const { error } = await supabase
      .from('profiles')
      .update({ theme: themeId })
      .eq('id', user.id);

    if (error) {
      toast.error(error.message, { id: toastId });
    } else {
      // 2. Refresh the user context to apply theme globally
      await refreshUser();
      localStorage.setItem('ulic-active-theme', themeId);
      setActiveTheme(themeId);
      toast.success('Theme applied!', { id: toastId });
    }
  };

  return (
    <div>
      <h1 className={styles.pageHeader}>Themes</h1>
      <p>Select a theme to apply it across the entire site. This is your personal preference and will not be seen by others.</p>
      <div className={styles.themeGrid}>
        {Object.values(themes).flatMap(category => Object.entries(category)).map(([themeId, theme]) => (
          <button
            key={themeId}
            onClick={() => applyTheme(themeId)}
            className={`${styles.themeButton} ${activeTheme === themeId ? styles.active : ''}`}
          >
            {theme.name}
          </button>
        ))}
      </div>
    </div>
  );
}