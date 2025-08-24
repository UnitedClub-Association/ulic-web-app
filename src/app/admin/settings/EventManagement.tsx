'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { uploadToImageKit } from '@/lib/imagekit/client';
import toast from 'react-hot-toast';
import styles from './settings.module.css';

type ClubEvent = {
  id?: string;
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  tags: string[] | string; // Accept both array and string for input
  banner_url: string;
};

export default function EventManagement() {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState<ClubEvent>({ name: '', description: '', start_time: '', end_time: '', location: '', tags: [], banner_url: '' });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const supabase = createClient();

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('events').select('*').order('start_time', { ascending: false });
    if (error) toast.error('Failed to fetch events.');
    else setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBannerFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading('Creating event...');
    let bannerUrl = '';

    if (bannerFile) {
      try {
        const fileName = `event_${Date.now()}_${bannerFile.name}`;
        const uploadResult = await uploadToImageKit(bannerFile, fileName);
        bannerUrl = uploadResult.url;
      } catch (error) {
        toast.error('Banner upload failed.', { id: toastId });
        return;
      }
    }

    const eventToInsert = { 
      ...newEvent, 
      banner_url: bannerUrl, 
      tags: typeof newEvent.tags === 'string' ? newEvent.tags.split(',').map(t => t.trim()) : newEvent.tags 
    };
    
    const { error } = await supabase.from('events').insert([eventToInsert]);
    
    if (error) {
      toast.error(error.message, { id: toastId });
    } else {
      toast.success('Event created successfully!', { id: toastId });
      await fetchEvents();
      setShowModal(false);
      setNewEvent({ name: '', description: '', start_time: '', end_time: '', location: '', tags: [], banner_url: '' });
      setBannerFile(null);
    }
  };

  return (
    <div className={styles.managementPanel}>
      <button onClick={() => setShowModal(true)} className={styles.btnPrimary}>Create New Event</button>
      <div className={styles.tableContainer}>
        <table className={styles.userTable}>
            <thead>
                <tr><th>Name</th><th>Date</th><th>Location</th><th>Actions</th></tr>
            </thead>
            <tbody>
                {loading ? (
                    <tr><td colSpan={4}>Loading events...</td></tr>
                ) : (
                    events.map(event => (
                        <tr key={event.id}>
                            <td>{event.name}</td>
                            <td>{new Date(event.start_time).toLocaleDateString()}</td>
                            <td>{event.location}</td>
                            <td><button className={styles.actionButton}>Edit</button></td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
      </div>

      {showModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}><h2>Create New Event</h2></div>
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}><label>Event Name</label><input type="text" name="name" onChange={handleInputChange} required /></div>
                <div className={styles.formGroup}><label>Location</label><input type="text" name="location" onChange={handleInputChange} /></div>
                <div className={styles.formGroup}><label>Start Time</label><input type="datetime-local" name="start_time" onChange={handleInputChange} required /></div>
                <div className={styles.formGroup}><label>End Time</label><input type="datetime-local" name="end_time" onChange={handleInputChange} required /></div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}><label>Description</label><textarea name="description" onChange={handleInputChange} rows={4}></textarea></div>
                <div className={styles.formGroup}><label>Tags (comma-separated)</label><input type="text" name="tags" onChange={handleInputChange} /></div>
                <div className={styles.formGroup}><label>Banner Image</label><input type="file" accept="image/*" onChange={handleFileChange} /></div>
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} className={styles.btnSecondary}>Cancel</button>
                <button type="submit" className={styles.btnPrimary}>Create Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}