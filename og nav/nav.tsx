'use client'; 
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

// --- MOCK USER DATA FOR ROLE CHECK ---
const mockUser = {
  position: 'General Secretary', // Change to 'General Member' to test admin link hiding
};

export default function Navbar() {
    const [position, setPosition] = useState('left');
    const [isMinimized, setIsMinimized] = useState(false);
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);
    const pathname = usePathname();
    const optionsMenuRef = useRef<HTMLDivElement>(null);
    const isCustomizePage = pathname.startsWith('/profile/customize');
    const isAdmin = ['President', 'Vice President', 'General Secretary'].includes(mockUser.position);

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
        const isVertical = position === 'left' || position === 'right';
        const paddingValue = isVertical ? (isMinimized ? '80px' : '260px') : '70px';
        if (position === 'left') document.body.style.paddingLeft = paddingValue;
        if (position === 'right') document.body.style.paddingRight = paddingValue;
        if (position === 'top') document.body.style.paddingTop = paddingValue;
        if (position === 'bottom') document.body.style.paddingBottom = paddingValue;
        localStorage.setItem('navPosition', position);
        localStorage.setItem('navMinimized', String(isMinimized));
    }, [position, isMinimized, isCustomizePage]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target as Node)) {
                setShowOptionsMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [optionsMenuRef]);

    const baseNavLinks = [
        { href: '/', label: 'Home', icon: 'fas fa-home fa-fw' },
        { href: '/search', label: 'Search', icon: 'fas fa-search fa-fw' },
        { href: '/calendar', label: 'Calendar', icon: 'fas fa-calendar-alt fa-fw' },
        { href: '/events', label: 'Events', icon: 'fas fa-bell fa-fw' },
        { href: '/projects', label: 'Projects', icon: 'fas fa-project-diagram fa-fw' },
        { href: '/profile', label: 'Profile', icon: 'fas fa-user fa-fw' },
    ];
    
    if (isAdmin) {
        baseNavLinks.push({ href: '/admin/settings', label: 'Admin', icon: 'fas fa-cogs fa-fw' });
    }

    const containerClasses = `${styles.navContainer} ${styles[position]} ${isMinimized ? styles.minimized : ''}`;
    if (isCustomizePage) return null;

    return (
        <div className={containerClasses}>
            <nav className={styles.navBar}>
                <div className={styles.navHeader}>
                    <Image src="/ulic-logo.jpg" alt="Logo" width={40} height={40} className={styles.navLogo} />
                    <h1 className={styles.navTitle}>ULIC</h1>
                </div>
                <ul className={styles.navList}>
                    {baseNavLinks.map((link) => (
                        <li key={link.href}>
                            <Link href={link.href} className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}>
                                <i className={link.icon}></i>
                                <span>{link.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className={styles.navFooter}>
                    <button onClick={() => setIsMinimized(!isMinimized)} className={styles.navIconBtn} id={styles.minimizeBtn}>
                        <i className="fas fa-chevron-left" style={{ transform: isMinimized && position === 'left' ? 'rotate(180deg)' : 'rotate(0deg)' }}></i>
                    </button>
                    <div className={styles.navOptionsContainer} ref={optionsMenuRef}>
                        <button onClick={() => setShowOptionsMenu(!showOptionsMenu)} className={styles.navIconBtn}>
                            <i className="fas fa-ellipsis-h"></i>
                        </button>
                        {showOptionsMenu && (
                            <div className={`${styles.navOptionsMenu} ${styles.show}`}>
                                {/* Position options */}
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
}