'use client';
import { useState, useEffect } from 'react';
import styles from '../customize.module.css';
import layoutStyles from './layouts.module.css';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';

type Layout = {
    id: string;
    name: string;
    imageUrl: string;
};

const layouts: Layout[] = [
    { id: 'layout1', name: 'Classic Center',imageUrl: 'https://ik.imagekit.io/ulicapp/Profile%20Layouts/Classic_Ym0AW4bOL.png?updatedAt=1756066403858' },
    { id: 'layout2', name: 'Modern Banner', imageUrl: 'https://ik.imagekit.io/ulicapp/Profile%20Layouts/ModernBanner_RETOIQLc1.png?updatedAt=1756066403821' },
    { id: 'layout3', name: 'Minimalist Card', imageUrl: 'https://ik.imagekit.io/ulicapp/Profile%20Layouts/MinimalistCard_LsFoiMRpw.png?updatedAt=1756067034610' },
    { id: 'layout4', name: 'Sidebar Focus', imageUrl: 'https://ik.imagekit.io/ulicapp/Profile%20Layouts/SidebarFocus_1iWscRVCk.png?updatedAt=1756067034709' },
    { id: 'layout5', name: 'Dynamic Grid', imageUrl: 'https://ik.imagekit.io/ulicapp/Profile%20Layouts/DynamicGrid_IgsArBCH6.png?updatedAt=1756067034602' },
    { id: 'layout6', name: 'Content First', imageUrl: 'https://ik.imagekit.io/ulicapp/Profile%20Layouts/ContentFirst_U41C43s7v.png?updatedAt=1756067034573' },
];

export default function ProfileLayoutsPage() {
    const { user } = useAuth();
    const supabase = createClient();
    const [selectedLayout, setSelectedLayout] = useState<Layout | null>(null);
    const [activeLayout, setActiveLayout] = useState('layout1');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchLayout = async () => {
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('profile_layout')
                    .eq('id', user.id)
                    .single();
                setActiveLayout(data?.profile_layout || 'layout1');
            }
        };
        fetchLayout();
    }, [user, supabase]);

    const handleApply = async () => {
        if (!selectedLayout || !user) return;
        
        const toastId = toast.loading(`Applying ${selectedLayout.name}...`);
        
        const { error } = await supabase
            .from('profiles')
            .update({ profile_layout: selectedLayout.id })
            .eq('id', user.id);

        if (error) {
            toast.error(error.message, { id: toastId });
        } else {
            setActiveLayout(selectedLayout.id);
            toast.success(`${selectedLayout.name} layout applied!`, { id: toastId });
        }
        setShowModal(false);
        setSelectedLayout(null);
    };
    
    const handlePreview = (layout: Layout) => {
        setSelectedLayout(layout);
        setShowModal(true);
    };

    const handleCancel = () => {
        setShowModal(false);
        setSelectedLayout(null);
    };

    return (
        <div>
            <h1 className={styles.pageHeader}>Profile Layout</h1>
            <p>Choose a layout that best represents you. This will be visible to everyone who views your profile.</p>

            <div className={layoutStyles.layoutGrid}>
                {layouts.map(layout => (
                    <div key={layout.id} className={`${layoutStyles.layoutCard} ${activeLayout === layout.id ? layoutStyles.active : ''}`} onClick={() => handlePreview(layout)}>
                        <Image src={layout.imageUrl} alt={`${layout.name} preview`} width={400} height={200} className={layoutStyles.previewImage}/>
                        <h3 className={layoutStyles.layoutName}>{layout.name}</h3>
                    </div>
                ))}
            </div>

            {showModal && selectedLayout && (
                <div className={layoutStyles.modalBackdrop} onClick={handleCancel}>
                    <div className={layoutStyles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2>Preview: {selectedLayout.name}</h2>
                        <div className={layoutStyles.modalImageWrapper}>
                             <Image src={selectedLayout.imageUrl} alt={`${selectedLayout.name} preview`} layout="fill" objectFit="contain" className={layoutStyles.modalImage}/>
                        </div>
                        <div className={layoutStyles.modalFooter}>
                            <p>This is a visual preview. Your information will populate this structure.</p>
                            <div className={layoutStyles.modalActions}>
                                <button onClick={handleCancel} className={layoutStyles.btnSecondary}>Cancel</button>
                                <button onClick={handleApply} className={layoutStyles.btnPrimary}>Apply Layout</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}