'use client';
import { useState, useEffect, useMemo } from 'react';
import styles from './projects.module.css';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import Link from 'next/link';

// Define the type for a project based on your Supabase table
type Project = {
  id: string;
  author_id: string;
  title: string;
  description: string;
  status: string;
  tech_stack: string[];
  tags: string[];
  project_link: string;
  profiles: { // This comes from the join
    username: string;
    avatar_url: string;
  } | null;
};

export default function ProjectsPage() {
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [allProjects, setAllProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            // Fetch projects and join with profiles to get author info
            const { data, error } = await supabase
                .from('projects')
                .select(`
                    *,
                    profiles (
                        username,
                        avatar_url
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) {
                toast.error("Could not fetch projects.");
                console.error("Project fetch error:", error);
            } else {
                setAllProjects(data as Project[]);
            }
            setLoading(false);
        };
        fetchProjects();
    }, [supabase]);
    
    const filteredProjects = useMemo(() => {
        if (statusFilter === 'all') return allProjects;
        return allProjects.filter(p => p.status && p.status.toLowerCase().replace(' ', '-') === statusFilter);
    }, [statusFilter, allProjects]);

    return (
        <main className={styles.mainContent}>
            <header className={styles.pageHeader}>
                <h1>Our Projects</h1>
                <p>Explore the innovative projects built by ULIC members.</p>
            </header>

            <div className={styles.projectLayout}>
                <aside className={styles.filterSidebar}>
                    <h3>Filter by Status</h3>
                    <button onClick={() => setStatusFilter('all')} className={statusFilter === 'all' ? styles.active : ''}>All</button>
                    <button onClick={() => setStatusFilter('active')} className={statusFilter === 'active' ? styles.active : ''}>Active</button>
                    <button onClick={() => setStatusFilter('in-progress')} className={statusFilter === 'in-progress' ? styles.active : ''}>In Progress</button>
                    <button onClick={() => setStatusFilter('completed')} className={statusFilter === 'completed' ? styles.active : ''}>Completed</button>
                    <button onClick={() => setStatusFilter('on-hold')} className={statusFilter === 'on-hold' ? styles.active : ''}>On Hold</button>
                </aside>

                <div className={styles.cardGrid}>
                    {loading ? (
                        <p className={styles.loadingMessage}>Loading projects...</p>
                    ) : filteredProjects.length > 0 ? (
                        filteredProjects.map(project => <ProjectCard key={project.id} project={project} onSelect={() => setSelectedProject(project)} />)
                    ) : (
                         <p className={styles.loadingMessage}>No projects found for this filter.</p>
                    )}
                </div>
            </div>
            {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
        </main>
    );
}

function ProjectCard({ project, onSelect }: { project: Project, onSelect: () => void }) {
    const authorUsername = project.profiles?.username || 'Unknown';
    return (
        <div className={styles.card} onClick={onSelect}>
            <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                    <h3>{project.title}</h3>
                    <span className={`${styles.statusBadge} ${styles[project.status?.toLowerCase().replace(' ', '-') || '']}`}>
                        {project.status}
                    </span>
                </div>
                <p>{project.description}</p>
                <div className={styles.techStack}>
                    {project.tech_stack?.map(t => <span key={t} className={styles.techTag}>{t}</span>)}
                </div>
                <div className={styles.cardFooter}>
                    <span className={styles.author}>by {authorUsername}</span>
                    {/* Likes functionality to be added later */}
                    <span className={styles.likes}><i className="fas fa-heart"></i> 0</span>
                </div>
            </div>
        </div>
    );
}

function ProjectModal({ project, onClose }: { project: Project, onClose: () => void }) {
    const authorUsername = project.profiles?.username || 'Unknown';
    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button className={styles.modalCloseBtn} onClick={onClose}><i className="fas fa-times"></i></button>
                <h2 className={styles.modalTitle}>{project.title}</h2>
                <div className={styles.modalAuthor}>
                    Created by: 
                    <Link href={`/profile/${authorUsername}`} className={styles.authorLink}>
                        <strong>{authorUsername}</strong>
                    </Link>
                </div>
                <p className={styles.modalDescription}>{project.description}</p>
                <div className={styles.techStack}>
                    <strong>Tech Stack:</strong>
                    {project.tech_stack?.map(t => <span key={t} className={styles.techTag}>{t}</span>)}
                </div>
                <div className={styles.modalFooter}>
                    <a href={project.project_link || '#'} target="_blank" rel="noopener noreferrer" className={styles.projectLinkBtn}><i className="fas fa-link"></i> View Project</a>
                    <button className={styles.likeBtn}><i className="fas fa-heart"></i> Like (0)</button>
                </div>
            </div>
        </div>
    );
}