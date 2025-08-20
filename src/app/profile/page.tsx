'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './profile.module.css';
import Layout1 from './layouts/Layout1';
import Layout2 from './layouts/Layout2';
// Import other layouts as you create them...

// --- MOCK USER DATA ---
const mockUsers = {
  admin: {
    userName: 'Sazidur Rahman',
    username: '@sazidur62',
    status: 'Student',
    position: 'President',
    bio: 'Aspiring full-stack developer and president of ULIC. Passionate about creating intuitive and dynamic web experiences.',
    avatar_url: '/ulic-logo.jpg',
    followers: 1250,
    following: 300,
    likes: '12.3k',
    badges: ['Code Jam 2024 Winner', 'Active Contributor', 'Founder'],
  },
  student: {
    userName: 'Jane Doe',
    username: '@janedoe_dev',
    status: 'Student',
    position: 'General Member',
    bio: 'Enthusiastic about UI/UX design and front-end development. Currently learning Next.js.',
    avatar_url: '/ulic-logo.jpg',
    followers: 150,
    following: 80,
    likes: '1.2k',
    badges: ['Active Member'],
  },
  teacher: {
    userName: 'Dr. Alan Turing',
    username: '@prof_turing',
    status: 'Teacher',
    position: 'Advisor',
    bio: 'Faculty advisor for the University Laboratory ICT Club. Specializing in computational theory and AI.',
    avatar_url: '/ulic-logo.jpg',
    followers: 5800,
    following: 15,
    likes: '50k',
    badges: ['Club Advisor', 'PhD'],
  },
};

export default function ProfilePage() {
  const [currentUserKey, setCurrentUserKey] = useState<'admin' | 'student' | 'teacher'>('admin');
  const [activeLayout, setActiveLayout] = useState('layout1');
  const userProfile = mockUsers[currentUserKey];

  useEffect(() => {
    const savedLayout = localStorage.getItem('ulic-profile-layout') || 'layout1';
    setActiveLayout(savedLayout);
  }, []);
  
  const renderLayout = () => {
    switch(activeLayout) {
      case 'layout1':
        return <Layout1 userProfile={userProfile} />;
      case 'layout2':
        return <Layout2 userProfile={userProfile} />;
      // Add cases for other layouts here
      default:
        return <Layout1 userProfile={userProfile} />;
    }
  };

  return (
    <div className={styles.content}>
       {/* --- Temporary User Switcher --- */}
      <div className={styles.tempSwitcher}>
        <strong>Test Profile:</strong>
        <button onClick={() => setCurrentUserKey('admin')} className={currentUserKey === 'admin' ? styles.active : ''}>Admin</button>
        <button onClick={() => setCurrentUserKey('student')} className={currentUserKey === 'student' ? styles.active : ''}>Student</button>
        <button onClick={() => setCurrentUserKey('teacher')} className={currentUserKey === 'teacher' ? styles.active : ''}>Teacher</button>
      </div>
      
      {renderLayout()}
    </div>
  );
}