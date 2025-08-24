'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import styles from './settings.module.css';
import Image from 'next/image';

type Profile = {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string;
  role: string;
  status: string;
  position: string; // Added position
};

export default function UserManagement() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const supabase = createClient();

  // Abstracted fetch logic to be reusable
  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('profiles').select('*').order('full_name');
    if (error) {
      toast.error('Failed to fetch user profiles.');
    } else {
      setProfiles(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleSave = async () => {
    if (!editingProfile) return;
    const { id, role, status, position } = editingProfile; // Include position in update
    const toastId = toast.loading('Saving changes...');

    const { error } = await supabase
      .from('profiles')
      .update({ role, status, position }) // Add position to the update query
      .eq('id', id);
      
    if (error) {
      toast.error(error.message, { id: toastId });
    } else {
      toast.success('Profile updated successfully!', { id: toastId });
      // Refetch profiles to get the latest data
      await fetchProfiles(); 
      setEditingProfile(null);
    }
  };

  const filteredProfiles = profiles.filter(p => 
    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.managementPanel}>
      <input 
        type="text"
        placeholder="Search users by name or username..."
        className={styles.searchInput}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className={styles.tableContainer}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Position</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center' }}>Loading users...</td></tr>
            ) : (
              filteredProfiles.map(profile => (
                <tr key={profile.id}>
                  <td>
                    <div className={styles.userCell}>
                      <Image src={profile.avatar_url || '/user-icon.png'} alt={profile.full_name} width={40} height={40} />
                      <div>
                        <strong>{profile.full_name}</strong>
                        <span>{profile.username}</span>
                      </div>
                    </div>
                  </td>
                  <td>{profile.role}</td>
                  <td>{profile.position}</td>
                  <td>{profile.status}</td>
                  <td><button onClick={() => setEditingProfile(profile)} className={styles.actionButton}>Edit</button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingProfile && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
                <h2>Edit {editingProfile.full_name}</h2>
                <p>{editingProfile.username}</p>
            </div>
            <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Role</label>
                  <select value={editingProfile.role} onChange={e => setEditingProfile({...editingProfile, role: e.target.value})}>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                 <div className={styles.formGroup}>
                    <label>Position</label>
                    <input type="text" value={editingProfile.position} onChange={e => setEditingProfile({...editingProfile, position: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label>Status</label>
                  <select value={editingProfile.status} onChange={e => setEditingProfile({...editingProfile, status: e.target.value})}>
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
            </div>
            <div className={styles.modalActions}>
              <button onClick={() => setEditingProfile(null)} className={styles.btnSecondary}>Cancel</button>
              <button onClick={handleSave} className={styles.btnPrimary}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}