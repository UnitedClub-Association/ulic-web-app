'use client';
import { useState } from 'react';
import styles from './settings.module.css';
import UserManagement from './UserManagement';
import EventManagement from './EventManagement';
import ProjectManagement from './ProjectManagement';
import BadgeManagement from './BadgeManagement'; // <-- NEW IMPORT

type AdminTab = 'users' | 'events' | 'projects' | 'badges'; // <-- NEW TAB

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');

  const renderContent = () => {
    switch (activeTab) {
      case 'users': return <UserManagement />;
      case 'events': return <EventManagement />;
      case 'projects': return <ProjectManagement />;
      case 'badges': return <BadgeManagement />; // <-- NEW CASE
      default: return <UserManagement />;
    }
  };

  return (
    <main className={styles.mainContent}>
      <header className={styles.pageHeader}>
        <h1>Admin Dashboard</h1>
        <p>Manage users, content, and application settings.</p>
      </header>

      <div className={styles.tabContainer}>
        <button onClick={() => setActiveTab('users')} className={activeTab === 'users' ? styles.active : ''}><i className="fas fa-users-cog"></i> User Management</button>
        <button onClick={() => setActiveTab('events')} className={activeTab === 'events' ? styles.active : ''}><i className="fas fa-calendar-plus"></i> Event Management</button>
        <button onClick={() => setActiveTab('projects')} className={activeTab === 'projects' ? styles.active : ''}><i className="fas fa-project-diagram"></i> Project Management</button>
        <button onClick={() => setActiveTab('badges')} className={activeTab === 'badges' ? styles.active : ''}><i className="fas fa-medal"></i> Badge Management</button>
      </div>

      <div className={styles.contentPanel}>
        {renderContent()}
      </div>
    </main>
  );
}