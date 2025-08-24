'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import styles from './settings.module.css';

type Project = {
  id?: string;
  author_id: string;
  title: string;
  description: string;
  status: string;
  tech_stack: string[] | string;
  tags: string[] | string;
  project_link: string;
};
type Profile = { id: string; username: string; };

export default function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState<Project>({ author_id: '', title: '', description: '', status: 'In Progress', tech_stack: [], tags: [], project_link: '' });
  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    const { data: projectsData, error: projError } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    const { data: profilesData, error: profError } = await supabase.from('profiles').select('id, username');
    
    if (projError || profError) toast.error('Failed to fetch data.');
    else {
      setProjects(projectsData);
      setProfiles(profilesData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.author_id) {
        toast.error("Please select an author.");
        return;
    }
    const toastId = toast.loading('Creating project...');
    const projectToInsert = {
      ...newProject,
      tech_stack: typeof newProject.tech_stack === 'string' ? newProject.tech_stack.split(',').map(t => t.trim()) : newProject.tech_stack,
      tags: typeof newProject.tags === 'string' ? newProject.tags.split(',').map(t => t.trim()) : newProject.tags,
    };

    const { error } = await supabase.from('projects').insert([projectToInsert]);

    if (error) {
      toast.error(error.message, { id: toastId });
    } else {
      toast.success('Project created!', { id: toastId });
      await fetchData();
      setShowModal(false);
    }
  };

  return (
    <div className={styles.managementPanel}>
      <button onClick={() => setShowModal(true)} className={styles.btnPrimary}>Create New Project</button>
       <div className={styles.tableContainer}>
        <table className={styles.userTable}>
            <thead>
                <tr><th>Title</th><th>Status</th><th>Link</th><th>Actions</th></tr>
            </thead>
            <tbody>
                {loading ? (
                    <tr><td colSpan={4}>Loading projects...</td></tr>
                ) : (
                    projects.map(project => (
                        <tr key={project.id}>
                            <td>{project.title}</td>
                            <td>{project.status}</td>
                            <td><a href={project.project_link} target="_blank" rel="noopener noreferrer">View</a></td>
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
            <div className={styles.modalHeader}><h2>Create New Project</h2></div>
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}><label>Title</label><input type="text" name="title" onChange={handleInputChange} required /></div>
                <div className={styles.formGroup}><label>Author</label>
                  <select name="author_id" value={newProject.author_id} onChange={handleInputChange} required>
                    <option value="" disabled>Select an author</option>
                    {profiles.map(p => <option key={p.id} value={p.id}>{p.username}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}><label>Status</label>
                  <select name="status" value={newProject.status} onChange={handleInputChange}>
                    <option>In Progress</option>
                    <option>Active</option>
                    <option>Completed</option>
                    <option>On Hold</option>
                  </select>
                </div>
                 <div className={`${styles.formGroup} ${styles.fullWidth}`}><label>Description</label><textarea name="description" onChange={handleInputChange} rows={3}></textarea></div>
                <div className={styles.formGroup}><label>Tech Stack (comma-separated)</label><input type="text" name="tech_stack" onChange={handleInputChange} /></div>
                <div className={styles.formGroup}><label>Project Link</label><input type="url" name="project_link" onChange={handleInputChange} /></div>
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} className={styles.btnSecondary}>Cancel</button>
                <button type="submit" className={styles.btnPrimary}>Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}