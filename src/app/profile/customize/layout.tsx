'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './customize.module.css';
import { useAuth } from '@/context/AuthContext';

export default function CustomizeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role } = useAuth();
  const isAdmin = role === 'admin';

  const navLinks = {
    'Account': [
        { href: '/profile/customize/user-info', label: 'User Info', icon: 'fas fa-user-edit' },
        { href: '/profile/saved', label: 'Saved Items', icon: 'fas fa-bookmark' } // <-- NEW LINK
    ],
    'Page Structure': [ 
      { href: '/profile/customize/profile', label: 'Profile Layout', icon: 'fas fa-id-card' },
      { href: '/profile/customize/navigation', label: 'Navigation', icon: 'fas fa-compass' } 
    ],
    'Appearance': [
        { href: '/profile/customize/themes', label: 'Themes', icon: 'fas fa-palette' },
        { href: '/profile/customize/fonts', label: 'Fonts', icon: 'fas fa-font' },
        { href: '/profile/customize/cursor', label: 'Cursor', icon: 'fas fa-mouse-pointer' },
    ],
    'System Settings': [ { href: '/profile/customize/sounds', label: 'Sounds', icon: 'fas fa-volume-up' } ]
  };

  return (
    <div className={styles.customizationLayout}>
      <nav className={styles.customizationNav}>
        <Link href="/profile" className={styles.navBackButton}><i className="fas fa-arrow-left"></i><span>Back to Profile</span></Link>
        {Object.entries(navLinks).map(([category, links]) => (
            <div key={category} className={styles.navCategory}>
                <h3 className={styles.navCategoryTitle}>{category}</h3>
                <ul className={styles.navList}>
                    {links.map(link => (
                        <li key={link.href}>
                            <Link href={link.href} className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}>
                                <i className={link.icon}></i><span>{link.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        ))}
      </nav>
      <main className={styles.customizationContent}>{children}</main>
    </div>
  );
}