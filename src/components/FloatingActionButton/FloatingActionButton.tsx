'use client';
import Link from 'next/link';
import styles from './FloatingActionButton.module.css';
import { usePathname } from 'next/navigation';

export default function FloatingActionButton() {
  const pathname = usePathname();

  // Don't show the button on the auth or customize pages
  if (pathname.startsWith('/auth') || pathname.startsWith('/profile/customize')) {
    return null;
  }

  return (
    <Link href="/profile/notifications" className={styles.fab} title="Notifications">
      <i className="fas fa-bell"></i>
    </Link>
  );
}