'use client';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { themes } from '@/lib/themes';
import { fonts, FontTarget } from '@/lib/fonts';

// Function to apply a theme
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
    if (!themeFound) {
        console.warn(`Theme "${themeId}" not found, applying default.`);
        applyTheme('tokyo-night');
    }
};

// Function to apply font preferences
const applyFonts = (fontPrefs: { [key in FontTarget]: string }) => {
    if (!fontPrefs) return;
    Object.entries(fontPrefs).forEach(([target, fontId]) => {
        const font = fonts[fontId];
        if (font) {
            document.documentElement.style.setProperty(`--font-${target}`, font.family);
        }
    });
};


export default function ThemeApplier() {
    const { theme, fontPrefs } = useAuth();

    // Apply theme
    useEffect(() => {
        if (theme) {
            applyTheme(theme);
        } else {
            applyTheme('tokyo-night');
        }
    }, [theme]);

    // Apply fonts
    useEffect(() => {
        if (fontPrefs) {
            applyFonts(fontPrefs);
        }
    }, [fontPrefs]);

    return null;
}