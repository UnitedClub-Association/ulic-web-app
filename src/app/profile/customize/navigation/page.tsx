'use client';
import styles from '../customize.module.css';
import navLayoutStyles from './navigation.module.css';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast'; // Import toast

// Define a type for our layout objects for better type safety
type NavLayout = {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
};

const navLayouts: NavLayout[] = [
    { id: 'classic', name: 'Classic Bar', description: 'A versatile bar that can be docked to any edge of the screen.', imageUrl: 'https://ik.imagekit.io/ulicapp/Navbar%20Layouts/ClassicNav_GyQ50BQC9.png?updatedAt=1756058438030' },
    { id: 'floating-dock', name: 'Floating Dock', description: 'A compact, draggable pill for a minimalist setup.', imageUrl: 'https://ik.imagekit.io/ulicapp/Navbar%20Layouts/FloatingDock_Lmx07duFD.png?updatedAt=1756059964992' },
    { id: 'corner-orb', name: 'Corner Orb', description: 'A single button that expands into a beautiful radial menu.', imageUrl: 'https://ik.imagekit.io/ulicapp/Navbar%20Layouts/CornerOrb_TNBmE0_j3.png?updatedAt=1756065328848' },
];

export default function NavigationLayoutsPage() {
    const [activeLayout, setActiveLayout] = useState('classic');
    const [showModal, setShowModal] = useState(false);
    const [selectedLayout, setSelectedLayout] = useState<NavLayout | null>(null);

    useEffect(() => {
        const savedLayout = localStorage.getItem('ulic-nav-layout') || 'classic';
        setActiveLayout(savedLayout);
    }, []);

    // Function to open the preview modal
    const handlePreview = (layout: NavLayout) => {
        setSelectedLayout(layout);
        setShowModal(true);
    };

    // Function to apply the selected layout and reload
    const handleApplyLayout = () => {
        if (!selectedLayout) return;
        localStorage.setItem('ulic-nav-layout', selectedLayout.id);
        setActiveLayout(selectedLayout.id);
        setShowModal(false);
        
        toast.success(`Applying ${selectedLayout.name} layout...`);
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };

    return (
        <div>
            <h1 className={styles.pageHeader}>Navigation Style</h1>
            <p>Choose a navigation layout that fits your workflow. Click a card to preview, then apply your choice.</p>

            <div className={navLayoutStyles.layoutGrid}>
                {navLayouts.map(layout => (
                    <div 
                        key={layout.id} 
                        className={`${navLayoutStyles.layoutCard} ${activeLayout === layout.id ? navLayoutStyles.active : ''}`} 
                        onClick={() => handlePreview(layout)}
                    >
                        <Image src={layout.imageUrl} alt={`${layout.name} preview`} width={300} height={150} className={navLayoutStyles.previewImage} />
                        <div className={navLayoutStyles.cardContent}>
                            <h3>{layout.name}</h3>
                            <p>{layout.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- Preview Modal --- */}
            {showModal && selectedLayout && (
                <div className={navLayoutStyles.modalBackdrop} onClick={() => setShowModal(false)}>
                    <div className={navLayoutStyles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2>{selectedLayout.name}</h2>
                        {/* **FIX**: The wrapper and fill props make the image responsive */}
                        <div className={navLayoutStyles.modalImageWrapper}>
                            <Image 
                                src={selectedLayout.imageUrl} 
                                alt={`${selectedLayout.name} preview`} 
                                layout="fill" 
                                objectFit="contain" 
                                className={navLayoutStyles.modalImage}
                            />
                        </div>
                        <p>{selectedLayout.description}</p>
                        <div className={navLayoutStyles.modalActions}>
                            <button onClick={() => setShowModal(false)} className={navLayoutStyles.btnSecondary}>Cancel</button>
                            <button onClick={handleApplyLayout} className={navLayoutStyles.btnPrimary}>Apply Layout</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}