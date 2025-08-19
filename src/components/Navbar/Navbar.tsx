'use client'; // This directive is necessary for components that use hooks

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
    // State management with React hooks
    const [position, setPosition] = useState('left');
    const [isMinimized, setIsMinimized] = useState(false);
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);

    const pathname = usePathname(); // Hook to get the current URL path
    const optionsMenuRef = useRef<HTMLDivElement>(null); // Ref for closing the options menu

    // Load state from localStorage only on the client-side
    useEffect(() => {
        const savedPosition = localStorage.getItem('navPosition') || 'left';
        const savedMinimized = localStorage.getItem('navMinimized') === 'true';
        setPosition(savedPosition);
        setIsMinimized(savedMinimized);
    }, []);

    // Effect to apply body padding and save state to localStorage
    useEffect(() => {
        document.body.style.padding = '0'; // Reset all padding first
        const isVertical = position === 'left' || position === 'right';
        const paddingValue = isVertical ? (isMinimized ? '80px' : '260px') : '70px';

        if (position === 'left') document.body.style.paddingLeft = paddingValue;
        if (position === 'right') document.body.style.paddingRight = paddingValue;
        if (position === 'top') document.body.style.paddingTop = paddingValue;
        if (position === 'bottom') document.body.style.paddingBottom = paddingValue;

        localStorage.setItem('navPosition', position);
        localStorage.setItem('navMinimized', String(isMinimized));
    }, [position, isMinimized]);

    // Effect to handle clicks outside the options menu to close it
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target as Node)) {
                setShowOptionsMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [optionsMenuRef]);

    const navLinks = [
        { href: '/', label: 'Home', icon: 'fas fa-home fa-fw' },
        { href: '/calendar', label: 'Calendar', icon: 'fas fa-calendar-alt fa-fw' },
        { href: '/events', label: 'Events', icon: 'fas fa-bell fa-fw' },
        { href: '/projects', label: 'Projects', icon: 'fas fa-project-diagram fa-fw' },
        { href: '/profile', label: 'Profile', icon: 'fas fa-user fa-fw' },
    ];

    // Dynamically generate classes for the main container
    const containerClasses = `${styles.navContainer} ${styles[position]} ${isMinimized ? styles.minimized : ''}`;
    const minimizeIconStyle = { transform: isMinimized && position === 'left' ? 'rotate(180deg)' : 'rotate(0deg)' };

    return (
        <div className={containerClasses}>
            <nav className={styles.navBar}>
                <div className={styles.navHeader}>
                    <Image src="/ulic-logo.jpg" alt="Logo" width={40} height={40} className={styles.navLogo} />
                    <h1 className={styles.navTitle}>ULIC</h1>
                </div>

                <ul className={styles.navList}>
                    {navLinks.map((link) => (
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
                        <i className="fas fa-chevron-left" style={minimizeIconStyle}></i>
                    </button>
                    <div className={styles.navOptionsContainer} ref={optionsMenuRef}>
                        <button onClick={() => setShowOptionsMenu(!showOptionsMenu)} className={styles.navIconBtn}>
                            <i className="fas fa-ellipsis"></i>
                        </button>
                        {showOptionsMenu && (
                            <div className={`${styles.navOptionsMenu} ${styles.show}`}>
                                <button onClick={() => { setPosition('left'); setShowOptionsMenu(false); }} className={position === 'left' ? styles.active : ''}>
                                    <i className={`fas fa-window-maximize ${styles.iconLeft}`}></i><span>Left</span>
                                </button>
                                <button onClick={() => { setPosition('right'); setShowOptionsMenu(false); }} className={position === 'right' ? styles.active : ''}>
                                    <i className={`fas fa-window-maximize ${styles.iconRight}`}></i><span>Right</span>
                                </button>
                                <button onClick={() => { setPosition('top'); setShowOptionsMenu(false); }} className={position === 'top' ? styles.active : ''}>
                                    <i className={`fas fa-window-maximize ${styles.iconTop}`}></i><span>Top</span>
                                </button>
                                <button onClick={() => { setPosition('bottom'); setShowOptionsMenu(false); }} className={position === 'bottom' ? styles.active : ''}>
                                    <i className={`fas fa-window-maximize ${styles.iconBottom}`}></i><span>Bottom</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
}
