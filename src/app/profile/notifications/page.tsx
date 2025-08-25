'use client';
import { useState, useEffect } from 'react';
import styles from './notifications.module.css';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';

type Notification = {
  id: string;
  actor_id: string;
  type: string;
  read: boolean;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  } | null;
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select(`*, profiles!notifications_actor_id_fkey (*)`)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to load notifications.');
        console.error(error);
      } else {
        setNotifications(data as Notification[]);
      }
      setLoading(false);
    };
    fetchNotifications();
  }, [user, supabase]);

  const getNotificationMessage = (notif: Notification) => {
    const actorName = notif.profiles?.full_name || 'Someone';
    switch (notif.type) {
      case 'like':
        return `${actorName} liked your post.`;
      case 'mention':
        return `${actorName} mentioned you in a post.`;
      case 'follow':
        return `${actorName} started following you.`;
      case 'badge':
        return `You've been awarded a new badge!`;
      default:
        return 'You have a new notification.';
    }
  };

  const handleRequestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('This browser does not support desktop notifications.');
      return;
    }
    
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      toast.success('Push notifications enabled!');
      new Notification('ULIC App Notifications', {
        body: 'You will now receive updates here.',
      });
    } else {
      toast.error('Push notifications were denied.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Notifications</h1>
        <button onClick={handleRequestNotificationPermission} className={styles.enableButton}>
          <i className="fas fa-bell"></i> Enable Push Notifications
        </button>
      </div>
      <div className={styles.notificationList}>
        {loading ? (
          <p>Loading...</p>
        ) : notifications.length > 0 ? (
          notifications.map(notif => (
            <div key={notif.id} className={`${styles.notificationItem} ${!notif.read ? styles.unread : ''}`}>
              <Image 
                src={notif.profiles?.avatar_url || '/user-icon.png'} 
                alt="Actor Avatar" 
                width={40} 
                height={40}
              />
              <div className={styles.notificationContent}>
                <p>{getNotificationMessage(notif)}</p>
                <span className={styles.timestamp}>{new Date(notif.created_at).toLocaleString()}</span>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noNotifications}>You have no notifications yet.</p>
        )}
      </div>
    </div>
  );
}