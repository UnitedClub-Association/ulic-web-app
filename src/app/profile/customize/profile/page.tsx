'use client';
import { useState } from 'react';
import styles from '../customize.module.css';
import layoutStyles from './layouts.module.css';
import Image from 'next/image';

const layouts = [
    { id: 'layout1', name: 'Classic Center',imageUrl: '/layout1-preview.png' },
    { id: 'layout2', name: 'Modern Banner', imageUrl: '/layout2-preview.png' },
    { id: 'layout3', name: 'Minimalist Card', imageUrl: '/layout3-preview.png' },
    { id: 'layout4', name: 'Sidebar Focus', imageUrl: '/layout4-preview.png' },
    { id: 'layout5', name: 'Dynamic Grid', imageUrl: '/layout5-preview.png' },
    { id: 'layout6', name: 'Content First', imageUrl: '/layout6-preview.png' },
];

export default function ProfileLayoutsPage() {
    const [selectedLayout, setSelectedLayout] = useState(layouts[0]);
    const [showModal, setShowModal] = useState(false);

    const handleApply = () => {
        localStorage.setItem('ulic-profile-layout', selectedLayout.id);
        setShowModal(false);
        // You might want to add a success notification here
    };

    return (
        <div>
            <h1 className={styles.pageHeader}>Profile Layout</h1>
            <p>Choose a layout that best represents you. Click to preview and apply.</p>

            <div className={layoutStyles.layoutGrid}>
                {layouts.map(layout => (
                    <div key={layout.id} className={layoutStyles.layoutCard} onClick={() => { setSelectedLayout(layout); setShowModal(true); }}>
                        <Image src={layout.imageUrl} alt={`${layout.name} preview`} width={300} height={200} className={layoutStyles.previewImage}/>
                        <h3 className={layoutStyles.layoutName}>{layout.name}</h3>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className={layoutStyles.modalBackdrop} onClick={() => setShowModal(false)}>
                    <div className={layoutStyles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2>Preview: {selectedLayout.name}</h2>
                        <Image src={selectedLayout.imageUrl} alt={`${selectedLayout.name} preview`} width={600} height={400} className={layoutStyles.modalImage}/>
                        <p>This is a visual preview. Your information will populate this structure.</p>
                        <div className={layoutStyles.modalActions}>
                            <button onClick={() => setShowModal(false)} className={layoutStyles.btnSecondary}>Cancel</button>
                            <button onClick={handleApply} className={layoutStyles.btnPrimary}>Apply Layout</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}