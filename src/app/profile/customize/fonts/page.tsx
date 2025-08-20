'use client';
import { useState, useEffect } from 'react';
import styles from '../customize.module.css';
import fontStyles from './fonts.module.css';
import { fonts, FontTarget } from '@/lib/fonts';

type SelectedFonts = {
  [key in FontTarget]: string; // e.g., { primary: 'azonix', body: 'arial' }
};

export default function FontsPage() {
  const [selectedFonts, setSelectedFonts] = useState<SelectedFonts>({
    primary: 'azonix',
    secondary: 'molgan',
    body: 'xeroda',
    accent: 'astro-space',
  });
  const [selectedTarget, setSelectedTarget] = useState<FontTarget>('primary');

  // Load saved fonts from localStorage on initial render
  useEffect(() => {
    const saved = localStorage.getItem('ulic-selected-fonts');
    if (saved) {
      const parsedFonts = JSON.parse(saved);
      setSelectedFonts(parsedFonts);
      // Apply all saved fonts on load
      Object.entries(parsedFonts).forEach(([target, fontId]) => {
        applyFont(target as FontTarget, fontId as string);
      });
    }
  }, []);

  const applyFont = (target: FontTarget, fontId: string) => {
    const font = fonts[fontId];
    if (font) {
      document.documentElement.style.setProperty(`--font-${target}`, font.family);
    }
  };

  const handleFontSelect = (fontId: string) => {
    if (!selectedTarget) return; // Do nothing if no target is selected

    const newFonts = { ...selectedFonts, [selectedTarget]: fontId };
    setSelectedFonts(newFonts);
    applyFont(selectedTarget, fontId);
    
    // Save to localStorage
    localStorage.setItem('ulic-selected-fonts', JSON.stringify(newFonts));
  };

  return (
    <div>
      <h1 className={styles.pageHeader}>Fonts</h1>

      {/* Section 1: Target Selection */}
      <div className={fontStyles.fontSection}>
        <h2 className={fontStyles.sectionTitle}>1. Select a Font Type to Change</h2>
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

      {/* Section 2: Font Library */}
      <div className={fontStyles.fontSection}>
        <h2 className={fontStyles.sectionTitle}>2. Choose a New Font</h2>
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
