'use client';
import { useState, useEffect } from 'react';
import styles from '../customize.module.css';
import { themes } from '@/lib/themes';

export default function ThemesPage() {
  const [activeTheme, setActiveTheme] = useState('tokyo-night');

  // Effect to apply the saved theme on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem('ulic-active-theme') || 'tokyo-night';
    setActiveTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeId: string) => {
    let themeFound = false;
    // Find the selected theme in the themes object
    for (const category in themes) {
      if (themes[category][themeId]) {
        const themeVars = themes[category][themeId].vars;
        
        // **FIX:** Iterate over theme variables and apply only non-font styles
        for (const varName in themeVars) {
          // This condition ensures that font settings are NOT overwritten by the theme
          if (!varName.startsWith('--font-')) {
            document.documentElement.style.setProperty(varName, themeVars[varName]);
          }
        }
        
        themeFound = true;
        break; // Exit loop once theme is found and applied
      }
    }

    // If the theme was found, save it to localStorage
    if (themeFound) {
      localStorage.setItem('ulic-active-theme', themeId);
      setActiveTheme(themeId);
    }
  };

  return (
    <div>
      <h1 className={styles.pageHeader}>Themes</h1>
      <p>Select a theme to apply it across the entire site.</p>
      <div className={styles.themeGrid}>
        {/* Map through all themes and render a button for each */}
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
