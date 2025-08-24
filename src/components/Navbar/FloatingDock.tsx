'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Session } from '@supabase/supabase-js';
import styles from './FloatingDock.module.css';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';

export default function FloatingDock({ serverSession }: { serverSession: Session | null }) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const { user, role } = useAuth();

    const [showUserMenu, setShowUserMenu] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Prioritize client-side user data for the most up-to-date info
    const currentUser = user || serverSession?.user;
    const currentRole = role || serverSession?.user?.user_metadata?.role;
    const isAdmin = currentRole === 'admin';

    // --- DYNAMIC NAVIGATION LINKS ---
    const baseNavLinks = [
        { href: '/', icon: 'fas fa-home' },
        { href: '/search', icon: 'fas fa-search' },
        { href: '/calendar', icon: 'fas fa-calendar-alt' },
        { href: '/events', icon: 'fas fa-bell' },
        { href: '/projects', icon: 'fas fa-project-diagram' },
    ];
    // Conditionally add the admin link
    if (isAdmin) {
        baseNavLinks.push({ href: '/admin/settings', icon: 'fas fa-cogs' });
    }
    
    // Close user menu on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };
    
    // Hide on customize page
    if (pathname.startsWith('/profile/customize')) return null;

    return (
        <div className={styles.dockContainer}>
            {baseNavLinks.map(link => (
                <Link key={link.href} href={link.href} className={`${styles.dockLink} ${pathname === link.href ? styles.active : ''}`}>
                    <i className={link.icon}></i>
                </Link>
            ))}

            {/* --- SEPARATOR & USER MENU --- */}
            <div className={styles.separator}></div>

            {currentUser ? (
                <div className={styles.userMenuContainer} ref={userMenuRef}>
                    <button onClick={() => setShowUserMenu(!showUserMenu)} className={styles.userAvatarButton}>
                        <Image 
                            src={currentUser.user_metadata.avatar_url || '/user-icon.png'} 
                            alt="User Avatar" 
                            width={38} 
                            height={38} 
                        />
                    </button>
                    {showUserMenu && (
                        <div className={styles.userMenu}>
                            <Link href="/profile" className={styles.menuButton}><i className="fas fa-user-circle fa-fw"></i> View Profile</Link>
                            <button onClick={handleLogout} className={styles.menuButton}><i className="fas fa-sign-out-alt fa-fw"></i> Logout</button>
                        </div>
                    )}
                </div>
            ) : (
                <Link href="/auth" className={styles.dockLink}>
                    <i className="fas fa-sign-in-alt"></i>
                </Link>
            )}
        </div>
    );
}