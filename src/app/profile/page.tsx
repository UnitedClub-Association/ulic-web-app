'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './profile.module.css';

export default function ProfileRedirectPage() {
  const { username, loading } = useAuth(); // **FIX**: Use username from context
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (username) {
        router.push(`/profile/${username}`);
      } else {
        router.push('/auth');
      }
    }
  }, [username, loading, router]);

  return (
    <div className={styles.content}>
      <p>Loading your profile...</p>
    </div>
  );
}