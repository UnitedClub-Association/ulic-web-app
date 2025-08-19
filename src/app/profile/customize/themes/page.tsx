'use client';
import { useState, useEffect } from 'react';
import styles from '../customize.module.css';
import { themes } from '@/lib/themes'; // We will create this file next

export default function ThemesPage() {
  const [activeTheme, setActiveTheme] = useState('tokyo-night');

  useEffect(() => {
    const savedTheme = localStorage.getItem('ulic-active-theme') || 'tokyo-night';
    setActiveTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeId: string) => {
    let themeFound = false;
    for (const category in themes) {
      if (themes[category][themeId]) {
        const themeVars = themes[category][themeId].vars;
        for (const varName in themeVars) {
          document.documentElement.style.setProperty(varName, themeVars[varName]);
        }
        themeFound = true;
        break;
      }
    }
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
