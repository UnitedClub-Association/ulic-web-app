'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './customize.module.css';

// MOCK USER FOR ADMIN CHECK
const mockUser = { position: 'President' };

export default function CustomizeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = ['President', 'Vice President', 'General Secretary'].includes(mockUser.position);

  const navLinks = {
    'Basic Settings': [ { href: '/profile/customize/user-info', label: 'User Info', icon: 'fas fa-user-edit' } ],
    'Page Structure': [ { href: '/profile/customize/profile', label: 'Profile', icon: 'fas fa-id-card' } ],
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
        <Link href="/profile" className={styles.navBackButton}>
          <i className="fas fa-arrow-left"></i>
          <span>Back to Profile</span>
        </Link>
        
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
        
        {isAdmin && (
            <div className={styles.navCategory}>
                <h3 className={styles.navCategoryTitle}>Admin Settings</h3>
                {/* Admin-specific links go here */}
            </div>
        )}
      </nav>
      <main className={styles.customizationContent}>{children}</main>
    </div>
  );
}