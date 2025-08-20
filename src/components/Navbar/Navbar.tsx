'use client'; 
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import { useAuth } from '@/context/AuthContext'; // Import the useAuth hook

export default function Navbar() {
    const [position, setPosition] = useState('left');
    const [isMinimized, setIsMinimized] = useState(false);
    const { user, role } = useAuth(); // Use the hook to get user and role
    const pathname = usePathname();
    const isCustomizePage = pathname.startsWith('/profile/customize');
    
    // Logic for hiding/showing the navbar based on the customize page
    useEffect(() => {
      // ... same as before
    }, [position, isMinimized, isCustomizePage]);

    const navLinks = [
        { href: '/', label: 'Home', icon: 'fas fa-home fa-fw' },
        { href: '/search', label: 'Search', icon: 'fas fa-search fa-fw' },
        { href: '/calendar', label: 'Calendar', icon: 'fas fa-calendar-alt fa-fw' },
        { href: '/events', label: 'Events', icon: 'fas fa-bell fa-fw' },
        { href: '/projects', label: 'Projects', icon: 'fas fa-project-diagram fa-fw' },
    ];
    
    // Conditionally add links based on auth state
    if (user) {
        navLinks.push({ href: '/profile', label: 'Profile', icon: 'fas fa-user fa-fw' });
        if (role === 'admin') {
            navLinks.push({ href: '/admin/settings', label: 'Admin', icon: 'fas fa-cogs fa-fw' });
        }
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
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <Link href={link.href} className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}>
                                <i className={link.icon}></i>
                                <span>{link.label}</span>
                            </Link>
                        </li>
                    ))}
                    {!user && (
                         <li>
                            <Link href="/auth" className={`${styles.navLink} ${pathname === '/auth' ? styles.active : ''}`}>
                                <i className="fas fa-sign-in-alt"></i>
                                <span>Login / Sign Up</span>
                            </Link>
                        </li>
                    )}
                </ul>
                 {/* Footer can be added here if needed */}
            </nav>
        </div>
    );
}