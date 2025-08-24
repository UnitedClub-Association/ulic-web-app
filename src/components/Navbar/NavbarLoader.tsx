'use client';

import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import dynamic from 'next/dynamic';

// Dynamically import components for better code splitting and performance.
// The loading component provides a simple skeleton to prevent layout shift.
const ClassicNav = dynamic(() => import('./ClassicNav'), { loading: () => <div style={{ height: '70px', width: '100%' }} /> });
const FloatingDock = dynamic(() => import('./FloatingDock'), { loading: () => null });
const CornerOrb = dynamic(() => import('./CornerOrb'), { loading: () => null });

export default function NavbarLoader({ serverSession }: { serverSession: Session | null }) {
    const [activeLayout, setActiveLayout] = useState<string | null>(null);

    useEffect(() => {
        // This code now only runs on the client, preventing server/client mismatch.
        const savedLayout = localStorage.getItem('ulic-nav-layout') || 'classic';
        setActiveLayout(savedLayout);
    }, []);

    // While waiting for localStorage to be read, we render nothing.
    // The `loading` property in dynamic() handles the initial placeholder.
    if (!activeLayout) {
        return null;
    }

    // Render the chosen layout component
    switch (activeLayout) {
        case 'floating-dock':
            return <FloatingDock serverSession={serverSession} />;
        case 'corner-orb':
            return <CornerOrb serverSession={serverSession} />;
        case 'classic':
        default:
            return <ClassicNav serverSession={serverSession} />;
    }
}