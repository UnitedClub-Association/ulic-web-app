import styles from './settings.module.css';

export default function AdminSettingsPage() {
  return (
    <main className={styles.mainContent}>
      <header className={styles.pageHeader}>
        <h1>Admin Settings</h1>
        <p>Manage users, content, and application settings.</p>
      </header>

      <div className={styles.settingsGrid}>
        {/* User Management Card */}
        <div className={styles.settingsCard}>
          <div className={styles.cardIcon}><i className="fas fa-users-cog"></i></div>
          <h2 className={styles.cardTitle}>User Management</h2>
          <p className={styles.cardDescription}>View, edit, and manage member roles and permissions.</p>
          <button className={styles.cardButton}>Manage Users</button>
        </div>

        {/* Event Management Card */}
        <div className={styles.settingsCard}>
          <div className={styles.cardIcon}><i className="fas fa-calendar-plus"></i></div>
          <h2 className={styles.cardTitle}>Event Management</h2>
          <p className={styles.cardDescription}>Create, update, and publish new club events and workshops.</p>
          <button className={styles.cardButton}>Create Event</button>
        </div>
        
        {/* Project Management Card */}
        <div className={styles.settingsCard}>
          <div className={styles.cardIcon}><i className="fas fa-project-diagram"></i></div>
          <h2 className={styles.cardTitle}>Project Management</h2>
          <p className={styles.cardDescription}>Add new projects to the showcase and update their status.</p>
          <button className={styles.cardButton}>Add Project</button>
        </div>

        {/* Site Customization Card */}
        <div className={styles.settingsCard}>
          <div className={styles.cardIcon}><i className="fas fa-paint-brush"></i></div>
          <h2 className={styles.cardTitle}>Site Customization</h2>
          <p className={styles.cardDescription}>Modify global themes, fonts, and featured content.</p>
          <button className={styles.cardButton}>Customize Site</button>
        </div>
      </div>
    </main>
  );
}