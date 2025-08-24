import Image from 'next/image';
import Link from 'next/link';
import styles from './MinimalistCard.module.css';

type ProfileProps = {
    userProfile: {
        userName: string;
        username: string;
        position: string;
        bio: string;
        avatar_url: string;
        badges: string[];
    };
    isOwnProfile: boolean;
};

export default function MinimalistCard({ userProfile, isOwnProfile }: ProfileProps) {
    return (
        <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
                <Image 
                    src={userProfile.avatar_url || '/user-icon.png'} 
                    alt="User Profile" 
                    width={100} 
                    height={100} 
                    className={styles.profilePicture}
                />
                <div className={styles.headerInfo}>
                    <h2 className={styles.profileName}>{userProfile.userName}</h2>
                    <p className={styles.profileUsername}>{userProfile.username}</p>
                    <p className={styles.profilePosition}>{userProfile.position}</p>
                </div>
            </div>

            <div className={styles.profileBody}>
                <p className={styles.profileBio}>{userProfile.bio}</p>
                <div className={styles.badges}>
                    {userProfile.badges.length > 0 ? (
                        userProfile.badges.map(badge => <span key={badge} className={styles.badge}>{badge}</span>)
                    ) : (
                        <p className={styles.noBadges}>No badges yet.</p>
                    )}
                </div>
            </div>
            
            {isOwnProfile && (
                <div className={styles.profileFooter}>
                    <Link href="/profile/customize" className={styles.btnPrimary}>
                        Customize
                    </Link>
                </div>
            )}
        </div>
    );
}