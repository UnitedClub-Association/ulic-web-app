'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { uploadToImageKit } from '@/lib/imagekit/client';
import toast from 'react-hot-toast';
import styles from './settings.module.css';
import Image from 'next/image';

type Badge = { id?: string; name: string; description: string; icon_url: string; };
type Profile = { id: string; username: string; };
type UserBadge = { user_id: string; badge_id: string; };

export default function BadgeManagement() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [newBadge, setNewBadge] = useState<Badge>({ name: '', description: '', icon_url: '' });
  const [assignment, setAssignment] = useState<UserBadge>({ user_id: '', badge_id: '' });
  const [iconFile, setIconFile] = useState<File | null>(null);
  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    const { data: badgesData, error: badgeError } = await supabase.from('badges').select('*');
    const { data: profilesData, error: profError } = await supabase.from('profiles').select('id, username');
    
    if (badgeError || profError) toast.error('Failed to fetch initial data.');
    else {
      setBadges(badgesData);
      setProfiles(profilesData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading('Creating badge...');
    let iconUrl = '';

    if (iconFile) {
      try {
        const uploadResult = await uploadToImageKit(iconFile, `badge_${Date.now()}`);
        iconUrl = uploadResult.url;
      } catch (error) {
        toast.error('Icon upload failed.', { id: toastId });
        return;
      }
    }

    const { error } = await supabase.from('badges').insert([{ ...newBadge, icon_url: iconUrl }]);
    if (error) toast.error(error.message, { id: toastId });
    else {
      toast.success('Badge created!', { id: toastId });
      await fetchData();
      setShowCreateModal(false);
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignment.user_id || !assignment.badge_id) {
        toast.error("Please select a user and a badge.");
        return;
    }
    const toastId = toast.loading('Assigning badge...');
    const { error } = await supabase.from('user_badges').insert([assignment]);
    if (error) toast.error(error.message, { id: toastId });
    else {
        toast.success('Badge assigned!', { id: toastId });
        setShowAssignModal(false);
    }
  };

  return (
    <div className={styles.managementPanel}>
      <div className={styles.buttonGroup}>
        <button onClick={() => setShowCreateModal(true)} className={styles.btnPrimary}>Create New Badge</button>
        <button onClick={() => setShowAssignModal(true)} className={styles.btnSecondary}>Assign Badge</button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.userTable}>
            <thead>
                <tr><th>Icon</th><th>Name</th><th>Description</th></tr>
            </thead>
            <tbody>
                {loading ? (
                    <tr><td colSpan={3}>Loading badges...</td></tr>
                ) : (
                    badges.map(badge => (
                        <tr key={badge.id}>
                            <td><Image src={badge.icon_url} alt={badge.name} width={40} height={40}/></td>
                            <td>{badge.name}</td>
                            <td>{badge.description}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
      </div>

      {/* Create Badge Modal */}
      {showCreateModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}><h2>Create New Badge</h2></div>
            <form onSubmit={handleCreateSubmit} className={styles.modalForm}>
                <div className={styles.formGroup}><label>Badge Name</label><input type="text" onChange={e => setNewBadge({...newBadge, name: e.target.value})} required /></div>
                <div className={styles.formGroup}><label>Description</label><input type="text" onChange={e => setNewBadge({...newBadge, description: e.target.value})} /></div>
                <div className={styles.formGroup}><label>Icon</label><input type="file" accept="image/*" onChange={e => setIconFile(e.target.files ? e.target.files[0] : null)} required /></div>
                <div className={styles.modalActions}>
                    <button type="button" onClick={() => setShowCreateModal(false)} className={styles.btnSecondary}>Cancel</button>
                    <button type="submit" className={styles.btnPrimary}>Create</button>
                </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Badge Modal */}
      {showAssignModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
             <div className={styles.modalHeader}><h2>Assign Badge to User</h2></div>
             <form onSubmit={handleAssignSubmit} className={styles.modalForm}>
                <div className={styles.formGroup}><label>Select User</label>
                    <select onChange={e => setAssignment({...assignment, user_id: e.target.value})} required>
                        <option value="">-- Select a User --</option>
                        {profiles.map(p => <option key={p.id} value={p.id}>{p.username}</option>)}
                    </select>
                </div>
                 <div className={styles.formGroup}><label>Select Badge</label>
                    <select onChange={e => setAssignment({...assignment, badge_id: e.target.value})} required>
                        <option value="">-- Select a Badge --</option>
                        {badges.map(b => <option key={b.id} value={b.id!}>{b.name}</option>)}
                    </select>
                </div>
                <div className={styles.modalActions}>
                    <button type="button" onClick={() => setShowAssignModal(false)} className={styles.btnSecondary}>Cancel</button>
                    <button type="submit" className={styles.btnPrimary}>Assign</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}