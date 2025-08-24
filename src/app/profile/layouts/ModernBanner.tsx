import Image from 'next/image';
import Link from 'next/link';
import styles from './ModernBanner.module.css';

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

export default function ModernBanner({ userProfile, isOwnProfile }: ProfileProps) {
    return (
        <div className={styles.profileCard}>
            <div className={styles.banner}></div>
            <div className={styles.profileHeader}>
                <Image src={userProfile.avatar_url || '/user-icon.png'} alt="User Profile" width={150} height={150} className={styles.profilePicture} />
                <div className={styles.headerInfo}>
                    <h2 className={styles.profileName}>{userProfile.userName}</h2>
                    <p className={styles.profileUsername}>{userProfile.username}</p>
                    <p className={styles.profilePosition}>{userProfile.position}</p>
                </div>
                {!isOwnProfile && <button className={styles.btnSecondary}>Follow</button>}
            </div>
            <div className={styles.socialStats}>
                <div><strong>{userProfile.followers}</strong> Followers</div>
                <div><strong>{userProfile.following}</strong> Following</div>
                <div><strong>{userProfile.likes}</strong> Likes</div>
            </div>
            <div className={styles.profileBody}>
                <div className={styles.leftColumn}>
                    <h3 className={styles.sectionTitle}>About Me</h3>
                    <p className={styles.profileBio}>{userProfile.bio}</p>
                </div>
                <div className={styles.rightColumn}>
                    <h3 className={styles.sectionTitle}>Badges</h3>
                    <div className={styles.badges}>
                        {userProfile.badges.length > 0 ? (
                            userProfile.badges.map(badge => <span key={badge} className={styles.badge}>{badge}</span>)
                        ) : (
                            <p>No badges yet.</p>
                        )}
                    </div>
                </div>
            </div>
             {isOwnProfile && (
                <div className={styles.customizationLinkWrapper}>
                    <Link href="/profile/customize" className={styles.btnPrimary}>
                        <i className="fas fa-sliders-h"></i>
                        <span>Customize Profile</span>
                    </Link>
                </div>
             )}
        </div>
    );
}