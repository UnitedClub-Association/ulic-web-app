'use client';
import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import styles from '../profile.module.css';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext'; // Import useAuth to identify the current user

// Import all layout components
import Classic from '../layouts/Classic';
import ModernBanner from '../layouts/ModernBanner';
import MinimalistCard from '../layouts/MinimalistCard';
import SidebarFocus from '../layouts/SidebarFocus';
import DynamicGrid from '../layouts/DynamicGrid';
import ContentFirst from '../layouts/ContentFirst';

type Profile = {
  id: string; 
  full_name: string;
  username: string;
  position: string;
  bio: string;
  avatar_url: string;
  profile_layout: string;
};

type Badge = {
    name: string;
    icon_url: string;
    description: string;
};


export default function UserProfilePage({ params }: { params: { username: string } }) {
  const { user: currentUser } = useAuth(); // Get the currently logged-in user
  const decodedUsername = decodeURIComponent(params.username);
  const supabase = createClient();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState({ followers: 0, following: 0, likes: '0' });
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!decodedUsername) return;

      setLoading(true);
      const { data, error } = await supabase.from('profiles').select('*').eq('username', decodedUsername).single();

      if (error || !data) {
        toast.error(`Profile for "${decodedUsername}" not found.`);
        setLoading(false);
        return;
      }
      
      setProfile(data);
      // **FIX**: Check if the viewed profile belongs to the logged-in user
      setIsOwnProfile(currentUser?.id === data.id);

      // Fetch stats and badges concurrently
      const [followersRes, followingRes, badgesRes] = await Promise.all([
          supabase.from('followers').select('*', { count: 'exact', head: true }).eq('user_id', data.id),
          supabase.from('followers').select('*', { count: 'exact', head: true }).eq('followed_by_id', data.id),
          supabase.from('user_badges').select('badges(name, icon_url, description)').eq('user_id', data.id)
      ]);

      setStats({ followers: followersRes.count ?? 0, following: followingRes.count ?? 0, likes: '0' });
      setBadges(badgesRes.data?.map(b => b.badges) as Badge[] || []);
      setLoading(false);
    };
    
    // We need currentUser to be loaded before we can check if it's our own profile
    if(currentUser !== undefined) {
        fetchProfileData();
    }
  }, [decodedUsername, supabase, currentUser]);
  
  const renderLayout = () => {
    if (!profile) return <p>This user's profile could not be loaded.</p>;

    const userProfileForLayout = {
      ...stats,
      userName: profile.full_name,
      username: profile.username,
      position: profile.position || 'Club Member',
      bio: profile.bio,
      avatar_url: profile.avatar_url,
      badges: badges.map(b => b.name),
    };
    
    const layoutProps = { userProfile: userProfileForLayout, isOwnProfile };

    switch(profile.profile_layout) {
      case 'layout1': return <Classic {...layoutProps} />;
      case 'layout2': return <ModernBanner {...layoutProps} />;
      case 'layout3': return <MinimalistCard {...layoutProps} />;
      case 'layout4': return <SidebarFocus {...layoutProps} />;
      case 'layout5': return <DynamicGrid {...layoutProps} />;
      case 'layout6': return <ContentFirst {...layoutProps} />;
      default: return <Classic {...layoutProps} />;
    }
  };

  if (loading) {
    return <div className={styles.content}><p>Loading profile for {decodedUsername}...</p></div>;
  }

  return (
    <div className={styles.content}>
      {renderLayout()}
    </div>
  );
}