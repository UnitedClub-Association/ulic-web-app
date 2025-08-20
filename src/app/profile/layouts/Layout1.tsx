import Image from 'next/image';
import Link from 'next/link';
import styles from './Layout1.module.css';

// This is a simplified type for props. You can expand it as needed.
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
};

export default function Layout1({ userProfile }: ProfileProps) {
    return (
        <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
                <div className={styles.profilePictureWrapper}>
                    <Image src={userProfile.avatar_url} alt="User Profile" width={150} height={150} className={styles.profilePicture} />
                </div>
                <div className={styles.profileActions}>
                    <div className={styles.socialStats}>
                        <div><strong>{userProfile.followers}</strong> Followers</div>
                        <div><strong>{userProfile.following}</strong> Following</div>
                        <div><strong>{userProfile.likes}</strong> Likes</div>
                    </div>
                    <button className={styles.btnSecondary}>Follow</button>
                </div>
            </div>

            <h2 className={styles.profileName}>{userProfile.userName}</h2>
            <p className={styles.profileUsername}>{userProfile.username}</p>
            <p className={styles.profilePosition}>{userProfile.position}</p>
            <p className={styles.profileBio}>{userProfile.bio}</p>

            <h3 className={styles.profileBadgesTitle}>Badges</h3>
            <div className={styles.badges}>
                {userProfile.badges.map(badge => <span key={badge} className={styles.badge}>{badge}</span>)}
            </div>

            <div className={styles.customizationLinkWrapper}>
                <Link href="/profile/customize" className={styles.btnPrimary}>
                    <i className="fas fa-sliders-h"></i>
                    <span>Customize Profile</span>
                </Link>
            </div>
        </div>
    );
}