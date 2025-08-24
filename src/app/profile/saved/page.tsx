'use client';
import { useState, useEffect } from 'react';
import styles from '../profile.module.css';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import Link from 'next/link';

// Define a generic type for a saved item
type SavedItem = {
    item_id: string;
    item_type: string; // 'post', 'project', 'event'
    // Joined data will be added here
    posts?: { title: string; content: string; };
    projects?: { title: string; description: string; };
    events?: { name: string; description: string; };
};

export default function SavedItemsPage() {
    const { user } = useAuth();
    const [savedItems, setSavedItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchSavedItems = async () => {
            if (!user) { setLoading(false); return; }
            setLoading(true);
            
            const { data, error } = await supabase
                .from('saved_items')
                .select(`
                    item_id,
                    item_type,
                    posts ( content ),
                    projects ( title ),
                    events ( name )
                `)
                .eq('user_id', user.id);
            
            if (error) {
                toast.error("Could not fetch your saved items.");
                console.error(error);
            } else {
                setSavedItems(data);
            }
            setLoading(false);
        };
        fetchSavedItems();
    }, [user, supabase]);

    return (
        <div className={styles.content}>
            <h1 className={styles.pageHeader}>Your Saved Items</h1>
            <div className={styles.savedItemsGrid}>
                {loading ? (
                    <p>Loading your saved items...</p>
                ) : savedItems.length > 0 ? (
                    savedItems.map(item => <SavedItemCard key={item.item_id} item={item} />)
                ) : (
                    <p>You haven't saved any items yet.</p>
                )}
            </div>
        </div>
    );
}

function SavedItemCard({ item }: { item: any }) {
    let title = 'Unknown Item';
    let type = item.item_type;
    let link = '/';

    if (type === 'post' && item.posts) {
        title = item.posts.content.substring(0, 50) + '...';
        link = `/`; // Link to post page if available
    } else if (type === 'project' && item.projects) {
        title = item.projects.title;
        link = '/projects';
    } else if (type === 'event' && item.events) {
        title = item.events.name;
        link = '/events';
    }

    return (
        <Link href={link} className={styles.savedItemCard}>
            <span className={styles.itemType}>{type}</span>
            <h4>{title}</h4>
        </Link>
    );
}