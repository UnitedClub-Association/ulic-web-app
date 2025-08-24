'use client';
import { useState, useEffect } from 'react';
import styles from '../customize.module.css';
import fontStyles from './fonts.module.css';
import { fonts, FontTarget } from '@/lib/fonts';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

type SelectedFonts = {
  [key in FontTarget]: string;
};

const defaultFonts: SelectedFonts = {
  primary: 'azonix',
  secondary: 'molgan',
  body: 'xeroda',
  accent: 'a-astro-space',
};

export default function FontsPage() {
  const { user, fontPrefs, refreshUser } = useAuth();
  const supabase = createClient();

  const [selectedFonts, setSelectedFonts] = useState<SelectedFonts>(fontPrefs || defaultFonts);
  const [selectedTarget, setSelectedTarget] = useState<FontTarget>('primary');

  // Update local state when context changes
  useEffect(() => {
    if (fontPrefs) {
      setSelectedFonts(fontPrefs);
    }
  }, [fontPrefs]);

  // Function to apply font locally for instant preview
  const applyFontPreview = (target: FontTarget, fontId: string) => {
    const font = fonts[fontId];
    if (font) {
      document.documentElement.style.setProperty(`--font-${target}`, font.family);
    }
  };
  
  const handleFontSelect = async (fontId: string) => {
    if (!selectedTarget || !user) {
        toast.error("You must select a font type and be logged in.");
        return;
    };

    const newFonts = { ...selectedFonts, [selectedTarget]: fontId };
    setSelectedFonts(newFonts);
    applyFontPreview(selectedTarget, fontId); // Apply visual change immediately

    const toastId = toast.loading('Saving font preference...');

    // Update the database
    const { error } = await supabase
      .from('profiles')
      .update({ font_preferences: newFonts })
      .eq('id', user.id);
      
    if (error) {
        toast.error(error.message, { id: toastId });
        // Revert visual change on error
        if(fontPrefs) applyFontPreview(selectedTarget, fontPrefs[selectedTarget]);
    } else {
        toast.success('Font preference saved!', { id: toastId });
        // Refresh context to ensure data is consistent
        await refreshUser();
    }
  };

  return (
    <div>
      <h1 className={styles.pageHeader}>Fonts</h1>
      <p>Select a font type, then choose a new font from the library to apply it. Your choices are saved automatically.</p>

      <div className={fontStyles.fontSection}>
        <h2 className={fontStyles.sectionTitle}>1. Select Font Type</h2>
        <div className={fontStyles.targetSelectionGrid}>
          {(Object.keys(selectedFonts) as FontTarget[]).map(target => (
            <button 
              key={target} 
              className={`${fontStyles.targetButton} ${selectedTarget === target ? fontStyles.active : ''}`}
              onClick={() => setSelectedTarget(target)}
            >
              <h3 className={fontStyles.targetLabel}>{target}</h3>
              <p 
                className={fontStyles.targetFontName} 
                style={{ fontFamily: fonts[selectedFonts[target]]?.family }}
              >
                {fonts[selectedFonts[target]]?.name || 'Not Set'}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className={fontStyles.fontSection}>
        <h2 className={fontStyles.sectionTitle}>2. Choose Font</h2>
        <div className={fontStyles.fontLibraryGrid}>
          {Object.entries(fonts).map(([fontId, font]) => (
            <button
              key={fontId}
              onClick={() => handleFontSelect(fontId)}
              className={`${fontStyles.fontCard} ${selectedFonts[selectedTarget] === fontId ? fontStyles.active : ''}`}
            >
              <span style={{ fontFamily: font.family }}>{font.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}