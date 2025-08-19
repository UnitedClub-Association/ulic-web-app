'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './customize.module.css';

export default function CustomizeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/profile/customize/user-info', label: 'User Info', icon: 'fas fa-user-edit' },
    { href: '/profile/customize/themes', label: 'Themes', icon: 'fas fa-palette' },
    { href: '/profile/customize/backgrounds', label: 'Backgrounds', icon: 'fas fa-layer-group' },
    { href: '/profile/customize/cursor', label: 'Cursor', icon: 'fas fa-mouse-pointer' },
  ];

  return (
    <div className={styles.customizationLayout}>
      <nav className={styles.customizationNav}>
        <Link href="/profile" className={styles.navBackButton}>
          <i className="fas fa-arrow-left"></i>
          <span>Back to Profile</span>
        </Link>
        <div className={styles.navCategory}>
          <h3 className={styles.navCategoryTitle}>Customization</h3>
          <ul className={styles.navList}>
            {navLinks.map(link => (
              <li key={link.href}>
                <Link href={link.href} className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}>
                  <i className={link.icon}></i>
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <main className={styles.customizationContent}>
        {children}
      </main>
    </div>
  );
}
