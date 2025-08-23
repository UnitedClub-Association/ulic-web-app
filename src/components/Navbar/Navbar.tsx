'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Navbar.module.css';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';

export default function Navbar() {
    // --- STATE MANAGEMENT ---
    const [position, setPosition] = useState('left');
    const [isMinimized, setIsMinimized] = useState(false);
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    // --- HOOKS ---
    const { user, role } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    // --- REFS ---
    const optionsMenuRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const isCustomizePage = pathname.startsWith('/profile/customize');
    const isAdmin = role === 'admin';

    // --- DERIVED STATE ---
    const isVertical = position === 'left' || position === 'right';

    // --- EFFECTS ---
    useEffect(() => {
        if (isCustomizePage) return;
        const savedPosition = localStorage.getItem('navPosition') || 'left';
        const savedMinimized = localStorage.getItem('navMinimized') === 'true';
        setPosition(savedPosition);
        setIsMinimized(savedMinimized);
    }, [isCustomizePage]);

    useEffect(() => {
        if (isCustomizePage) {
            document.body.style.padding = '0';
            return;
        }
        document.body.style.padding = '0';
        const paddingValue = isVertical ? (isMinimized ? '80px' : '260px') : '70px';
        if (position === 'left') document.body.style.paddingLeft = paddingValue;
        if (position === 'right') document.body.style.paddingRight = paddingValue;
        if (position === 'top') document.body.style.paddingTop = paddingValue;
        if (position === 'bottom') document.body.style.paddingBottom = paddingValue;
        localStorage.setItem('navPosition', position);
        localStorage.setItem('navMinimized', String(isMinimized));
    }, [position, isMinimized, isCustomizePage, isVertical]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target as Node)) {
                setShowOptionsMenu(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- DYNAMIC CONTENT ---
    const baseNavLinks = [
        { href: '/', label: 'Home', icon: 'fas fa-home fa-fw' },
        { href: '/search', label: 'Search', icon: 'fas fa-search fa-fw' },
        { href: '/calendar', label: 'Calendar', icon: 'fas fa-calendar-alt fa-fw' },
        { href: '/events', label: 'Events', icon: 'fas fa-bell fa-fw' },
        { href: '/projects', label: 'Projects', icon: 'fas fa-project-diagram fa-fw' },
    ];
    if (isAdmin) {
        baseNavLinks.push({ href: '/admin/settings', label: 'Admin', icon: 'fas fa-cogs fa-fw' });
    }

    const getMinimizeIcon = () => {
        if (position === 'right') return isMinimized ? 'fa-chevron-left' : 'fa-chevron-right';
        return isMinimized ? 'fa-chevron-right' : 'fa-chevron-left';
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setShowUserMenu(false);
        router.push('/');
    };

    // --- RENDER LOGIC ---
    if (isCustomizePage) return null;

    const containerClasses = `${styles.navContainer} ${styles[position]} ${isMinimized && isVertical ? styles.minimized : ''}`;

    // Options Menu Component - Reusable for both layouts
    const optionsMenu = (
        <div className={styles.navOptionsContainer} ref={optionsMenuRef}>
            <button onClick={() => setShowOptionsMenu(!showOptionsMenu)} className={styles.navIconBtn}>
                <i className={isVertical ? "fas fa-ellipsis-h" : "fas fa-ellipsis-v"}></i>
                <span className={styles.tooltip}>Options</span>
            </button>
            {showOptionsMenu && (
                <div className={`${styles.navOptionsMenu} ${styles.show}`}>
                    <button onClick={() => setPosition('left')} className={position === 'left' ? styles.active : ''}><i className="fas fa-arrow-left fa-fw"></i> Position Left</button>
                    <button onClick={() => setPosition('right')} className={position === 'right' ? styles.active : ''}><i className="fas fa-arrow-right fa-fw"></i> Position Right</button>
                    <button onClick={() => setPosition('top')} className={position === 'top' ? styles.active : ''}><i className="fas fa-arrow-up fa-fw"></i> Position Top</button>
                    <button onClick={() => setPosition('bottom')} className={position === 'bottom' ? styles.active : ''}><i className="fas fa-arrow-down fa-fw"></i> Position Bottom</button>
                </div>
            )}
        </div>
    );

    return (
        <div className={containerClasses}>
            {isVertical ? (
                // --- VERTICAL LAYOUT (SIDEBAR) ---
                <nav className={styles.navBarVertical}>
                    <div className={styles.navHeader}>
                        <Image src="/ulic-logo.jpg" alt="Logo" width={40} height={40} className={styles.navLogo} />
                        <h1 className={styles.navTitle}>ULIC</h1>
                    </div>
                    <ul className={styles.navListVertical}>
                        {baseNavLinks.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href} className={`${styles.navLinkVertical} ${pathname === link.href ? styles.active : ''}`}>
                                    <i className={link.icon}></i>
                                    <span>{link.label}</span>
                                    <span className={styles.tooltip}>{link.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className={styles.navFooter}>
                        <div className={styles.footerUserSection}>
                            {user ? (
                                <div className={styles.navOptionsContainer} ref={userMenuRef}>
                                    <button onClick={() => setShowUserMenu(!showUserMenu)} className={styles.userProfileButton}>
                                        <Image src={user.user_metadata.avatar_url || '/ulic-logo.jpg'} alt="User Avatar" width={40} height={40} />
                                        <span>{user.user_metadata.full_name || user.email}</span>
                                        <span className={styles.tooltip}>{user.user_metadata.full_name || user.email}</span>
                                    </button>
                                    {showUserMenu && (
                                        <div className={`${styles.navOptionsMenu} ${styles.show}`}>
                                            <Link href="/profile" className={styles.menuButton}><i className="fas fa-user-circle fa-fw"></i> View Profile</Link>
                                            <button onClick={handleLogout} className={styles.menuButton}><i className="fas fa-sign-out-alt fa-fw"></i> Logout</button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link href="/auth" className={`${styles.navLinkVertical} ${styles.loginButton}`}>
                                    <i className="fas fa-sign-in-alt"></i><span>Login / Sign Up</span><span className={styles.tooltip}>Login / Sign Up</span>
                                </Link>
                            )}
                        </div>
                        <div className={styles.footerControls}>
                            {optionsMenu}
                            <button onClick={() => setIsMinimized(!isMinimized)} className={styles.navIconBtn}>
                                <i className={`fas ${getMinimizeIcon()}`}></i>
                                <span className={styles.tooltip}>{isMinimized ? 'Expand' : 'Collapse'}</span>
                            </button>
                        </div>
                    </div>
                </nav>
            ) : (
                // --- HORIZONTAL LAYOUT (TOP/BOTTOM BAR) ---
                <nav className={styles.navBarHorizontal}>
                    <div className={styles.navHeader}>
                        <Image src="/ulic-logo.jpg" alt="Logo" width={40} height={40} className={styles.navLogo} />
                        <h1 className={styles.navTitle}>ULIC</h1>
                    </div>
                    <ul className={styles.navListHorizontal}>
                        {baseNavLinks.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href} className={`${styles.navLinkHorizontal} ${pathname === link.href ? styles.active : ''}`}>
                                    <i className={link.icon}></i>
                                    <span className={styles.tooltip}>{link.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className={styles.navControlsHorizontal}>
                        {user ? (
                            <div className={styles.navOptionsContainer} ref={userMenuRef}>
                                <button onClick={() => setShowUserMenu(!showUserMenu)} className={styles.userAvatarButton}>
                                    <Image src={user.user_metadata.avatar_url || '/ulic-logo.jpg'} alt="User Avatar" width={38} height={38} />
                                    <span className={styles.tooltip}>{user.user_metadata.full_name || user.email}</span>
                                </button>
                                {showUserMenu && (
                                    <div className={`${styles.navOptionsMenu} ${styles.show}`}>
                                        <Link href="/profile" className={styles.menuButton}><i className="fas fa-user-circle fa-fw"></i> View Profile</Link>
                                        <button onClick={handleLogout} className={styles.menuButton}><i className="fas fa-sign-out-alt fa-fw"></i> Logout</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/auth" className={styles.horizontalLoginButton}>
                                Login / Sign Up
                            </Link>
                        )}
                        {optionsMenu}
                    </div>
                </nav>
            )}
        </div>
    );
}