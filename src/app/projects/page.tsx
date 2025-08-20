'use client';
import { useState } from 'react';
import styles from './projects.module.css';
import Image from 'next/image';

const allProjects = [
    { id: 1, title: 'ULIC Club Website', status: 'Active', tech: ['Next.js', 'TypeScript', 'CSS'], description: 'The official website for the club, built collaboratively by our members.', author: '@sazidur62', likes: 128, link: 'https://github.com/sazidur-r/ulic-website' },
    { id: 2, title: 'Discord Bot Assistant', status: 'In Progress', tech: ['Python', 'Discord.py'], description: 'A custom bot to manage roles, events, and announcements on our server.', author: '@janedoe_dev', likes: 75, link: '#' },
    { id: 3, title: 'Open Source Weather App', status: 'Completed', tech: ['React', 'API'], description: 'A community-driven project to build a beautiful and accurate weather application.', author: '@prof_turing', likes: 350, link: '#' },
    { id: 4, title: 'Hardware: LED Matrix Display', status: 'On Hold', tech: ['Arduino', 'C++'], description: 'A custom programmable LED matrix for displaying club announcements.', author: '@sazidur62', likes: 45, link: '#' },
];
type Project = typeof allProjects[0];

export default function ProjectsPage() {
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    
    const filteredProjects = allProjects.filter(p => statusFilter === 'all' || p.status.toLowerCase().replace(' ', '-') === statusFilter);

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
                    {filteredProjects.map(project => <ProjectCard key={project.id} project={project} onSelect={() => setSelectedProject(project)} />)}
                </div>
            </div>
            {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
        </main>
    );
}

function ProjectCard({ project, onSelect }: { project: Project, onSelect: () => void }) {
    return (
        <div className={styles.card} onClick={onSelect}>
            <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                    <h3>{project.title}</h3>
                    <span className={`${styles.statusBadge} ${styles[project.status.toLowerCase().replace(' ', '-')]} `}>
                        {project.status}
                    </span>
                </div>
                <p>{project.description}</p>
                <div className={styles.techStack}>
                    {project.tech.map(t => <span key={t} className={styles.techTag}>{t}</span>)}
                </div>
                <div className={styles.cardFooter}>
                    <span className={styles.author}>by {project.author}</span>
                    <span className={styles.likes}><i className="fas fa-heart"></i> {project.likes}</span>
                </div>
            </div>
        </div>
    );
}

function ProjectModal({ project, onClose }: { project: Project, onClose: () => void }) {
    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button className={styles.modalCloseBtn} onClick={onClose}><i className="fas fa-times"></i></button>
                <h2 className={styles.modalTitle}>{project.title}</h2>
                <div className={styles.modalAuthor}>
                    Created by: <strong>{project.author}</strong>
                    <button className={styles.followBtn}>Follow</button>
                </div>
                <p className={styles.modalDescription}>{project.description}</p>
                <div className={styles.techStack}>
                    <strong>Tech Stack:</strong>
                    {project.tech.map(t => <span key={t} className={styles.techTag}>{t}</span>)}
                </div>
                <div className={styles.modalFooter}>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className={styles.projectLinkBtn}><i className="fas fa-link"></i> View Project</a>
                    <button className={styles.likeBtn}><i className="fas fa-heart"></i> Like ({project.likes})</button>
                </div>
            </div>
        </div>
    );
}