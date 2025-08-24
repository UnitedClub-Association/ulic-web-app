import Image from 'next/image';
import Link from 'next/link';
import styles from './DynamicGrid.module.css';

type ProfileProps = {
    userProfile: {
        userName: string;
        username: string;
        position: string;
        bio: string;
        avatar_url: string;
        followers: number;
        following: number;
        likes: string;
        badges: string[];
    };
    isOwnProfile: boolean;
};

export default function DynamicGrid({ userProfile, isOwnProfile }: ProfileProps) {
    return (
        <div className={styles.profileGrid}>
            <div className={`${styles.gridItem} ${styles.header}`}>
                <Image 
                    src={userProfile.avatar_url || '/user-icon.png'} 
                    alt="User Profile" 
                    width={120} 
                    height={120} 
                    className={styles.profilePicture}
                />
                <div>
                    <h2 className={styles.profileName}>{userProfile.userName}</h2>
                    <p className={styles.profileUsername}>{userProfile.username}</p>
                    <p className={styles.profilePosition}>{userProfile.position}</p>
                </div>
            </div>
            <div className={`${styles.gridItem} ${styles.stats}`}>
                 <div><strong>{userProfile.followers}</strong> Followers</div>
                 <div><strong>{userProfile.following}</strong> Following</div>
                 <div><strong>{userProfile.likes}</strong> Likes</div>
            </div>
            <div className={`${styles.gridItem} ${styles.bio}`}>
                 <h3 className={styles.sectionTitle}>About Me</h3>
                 <p>{userProfile.bio}</p>
            </div>
            <div className={`${styles.gridItem} ${styles.badges}`}>
                 <h3 className={styles.sectionTitle}>Badges</h3>
                 <div className={styles.badgeContainer}>
                    {userProfile.badges.length > 0 ? (
                        userProfile.badges.map(badge => <span key={badge} className={styles.badge}>{badge}</span>)
                    ) : (
                        <p>No badges yet.</p>
                    )}
                 </div>
            </div>
             <div className={`${styles.gridItem} ${styles.actions}`}>
                {!isOwnProfile ? (
                    <button className={styles.btnSecondary}>Follow</button>
                ) : (
                    <Link href="/profile/customize" className={styles.btnPrimary}>Customize</Link>
                )}
            </div>
        </div>
    );
}