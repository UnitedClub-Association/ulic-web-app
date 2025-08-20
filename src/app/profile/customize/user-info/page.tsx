'use client';
import styles from '../customize.module.css';

export default function UserInfoPage() {
  return (
    <div>
      <h1 className={styles.pageHeader}>User Info</h1>
      <p>Here you can edit your profile details, like your name, bio, and position.</p>
      {/* Form elements will go here */}
    </div>
  );
}
