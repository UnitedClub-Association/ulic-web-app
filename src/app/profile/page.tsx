import Image from 'next/image';
import Link from 'next/link';
import styles from './profile.module.css';

// Mock data, later this would come from Supabase
const userProfile = {
    userName: 'A. R. Fahim',
    position: 'President',
    bio: 'Aspiring full-stack developer and president of ULIC. Passionate about creating intuitive and dynamic web experiences.',
    avatar_url: '/ulic-logo.jpg', // Using the logo from the public folder
    badges: ['Code Jam 2024 Winner', 'Active Contributor', 'Founder'],
};

export default function ProfilePage() {
    return (
        <div className={styles.content}>
            <h1 className={styles.pageTitle}>User Profile</h1>

            <div className={styles.profileCard}>
                <div className={styles.profilePictureWrapper}>
                    <Image 
                        src={userProfile.avatar_url} 
                        alt="User Profile Picture" 
                        width={150} 
                        height={150} 
                        className={styles.profilePicture} 
                    />
                </div>
                <h2 className={styles.profileName}>{userProfile.userName}</h2>
                <p className={styles.profilePosition}>{userProfile.position}</p>
                <p className={styles.profileBio}>{userProfile.bio}</p>
                
                <h3 className={styles.profileBadgesTitle}>Badges</h3>
                <div className={styles.profileBadges}>
                    {userProfile.badges.length > 0 ? (
                        userProfile.badges.map(badge => (
                            <span key={badge} className={styles.badge}>{badge}</span>
                        ))
                    ) : (
                        <span className={styles.badge}>No badges yet</span>
                    )}
                </div>
                
                <div className={styles.customizationLinkWrapper}>
                    <Link href="/profile/customize" className={styles.btnPrimary}>
                        <i className="fas fa-sliders-h"></i>
                        <span>Customize Profile</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
