'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Session } from '@supabase/supabase-js';
import styles from './CornerOrb.module.css';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';

// Define a union type for the menu items to allow for different properties
type MenuItem = 
    | { id: string; href: string; icon: string; tooltip: string; type?: never; }
    | { id: string; type: 'user'; tooltip: string; href?: never; icon?: never; };

export default function CornerOrb({ serverSession }: { serverSession: Session | null }) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const { user, role } = useAuth();

    const [isOpen, setIsOpen] = useState(false);

    const currentUser = user || serverSession?.user;
    const currentRole = role || serverSession?.user?.user_metadata?.role;
    const isAdmin = currentRole === 'admin';

    const visibleMenuItems = useMemo((): MenuItem[] => {
        const items: MenuItem[] = [
            { id: 'home', href: '/', icon: 'fas fa-home', tooltip: 'Home' },
            { id: 'search', href: '/search', icon: 'fas fa-search', tooltip: 'Search' },
            { id: 'calendar', href: '/calendar', icon: 'fas fa-calendar-alt', tooltip: 'Calendar' },
            { id: 'events', href: '/events', icon: 'fas fa-bell', tooltip: 'Events' },
            { id: 'projects', href: '/projects', icon: 'fas fa-project-diagram', tooltip: 'Projects' },
        ];
        if (isAdmin) {
            items.push({ id: 'admin', href: '/admin/settings', icon: 'fas fa-cogs', tooltip: 'Admin Settings' });
        }
        if (currentUser) {
            items.push({ id: 'user', type: 'user', tooltip: 'Profile Options' });
        } else {
            items.push({ id: 'login', href: '/auth', icon: 'fas fa-sign-in-alt', tooltip: 'Login / Sign Up' });
        }
        return items;
    }, [currentUser, isAdmin]);

    const itemPositions = useMemo(() => {
        const positions: React.CSSProperties[] = [];
        const itemCount = visibleMenuItems.length;
        const angleArc = 90;
        const radius = 110;
        const angleStep = itemCount > 1 ? angleArc / (itemCount - 1) : 0;

        visibleMenuItems.forEach((_, index) => {
            const angle = 90 - (index * angleStep);
            const angleInRad = angle * (Math.PI / 180);
            const x = Math.round(radius * Math.cos(angleInRad));
            const y = Math.round(-radius * Math.sin(angleInRad));
            
            positions.push({
                '--x-translate': `${x}px`,
                '--y-translate': `${y}px`,
                '--delay': `${(index * 0.05)}s`,
            } as React.CSSProperties);
        });
        return positions;
    }, [visibleMenuItems]);
    
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (pathname.startsWith('/profile/customize')) return null;

    return (
        <div id="orb-nav-container" className={`${styles.orbNavContainer} ${isOpen ? styles.isOpen : ''}`}>
            <div onClick={() => setIsOpen(!isOpen)} className={styles.orbTrigger}>
                <i className={`${styles.icon} ${styles.iconPlus} fas fa-plus`}></i>
                <i className={`${styles.icon} ${styles.iconClose} fas fa-times`}></i>
            </div>

            <nav className={styles.orbMenu}>
                <ul>
                    {visibleMenuItems.map((item, index) => (
                        <li key={item.id} className={`${styles.orbMenuItemWrapper} ${item.id === 'user' ? styles.profileMenu : ''}`} style={itemPositions[index]}>
                            {item.type === 'user' && currentUser ? (
                                <>
                                    <a href="#" className={`${styles.orbMenuItem} ${styles.userAvatarButton}`} data-tooltip={item.tooltip}>
                                        <Image src={currentUser.user_metadata.avatar_url || '/user-icon.png'} alt="User Avatar" width={48} height={48} />
                                    </a>
                                    <div className={styles.profileSubmenu}>
                                        <Link href="/profile" className={styles.submenuButton}><i className="fas fa-user-circle fa-fw"></i> View Profile</Link>
                                        <button onClick={handleLogout} className={styles.submenuButton}><i className="fas fa-sign-out-alt fa-fw"></i> Logout</button>
                                    </div>
                                </>
                            ) : (
                                <Link href={item.href || '#'} className={`${styles.orbMenuItem} ${styles[item.id]}`} data-tooltip={item.tooltip}>
                                    <i className={item.icon}></i>
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}