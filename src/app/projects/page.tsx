'use client';
import { useState } from 'react';
import styles from './projects.module.css';

const allProjects = [
    { id: 1, title: 'ULIC Club Website', status: 'Active', tech: ['Next.js', 'TypeScript', 'CSS Modules'], description: 'The official website for the club, built collaboratively by our members.' },
    { id: 2, title: 'Discord Bot Assistant', status: 'In Progress', tech: ['Python', 'Discord.py'], description: 'A custom bot to manage roles, events, and announcements on our server.' },
    { id: 3, title: 'Open Source Weather App', status: 'Completed', tech: ['React', 'API', 'Supabase'], description: 'A community-driven project to build a beautiful and accurate weather application.' },
    { id: 4, title: 'Hardware: LED Matrix Display', status: 'On Hold', tech: ['Arduino', 'C++'], description: 'A custom programmable LED matrix for displaying club announcements.' },
];
type Project = typeof allProjects[0];

export default function ProjectsPage() {
    const [statusFilter, setStatusFilter] = useState('all');
    
    const filteredProjects = allProjects.filter(p => statusFilter === 'all' || p.status.toLowerCase().replace(' ', '-') === statusFilter);

    return (
        <main className={styles.mainContent}>
            <header className={styles.pageHeader}>
                <h1>Our Projects</h1>
                <p>Explore the innovative projects built by ULIC members.</p>
            </header>

            <div className={styles.filterControls}>
                <label>Filter by Status:</label>
                <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                </select>
            </div>

            <div className={styles.cardGrid}>
                {filteredProjects.map(project => <ProjectCard key={project.id} project={project} />)}
            </div>
        </main>
    );
}

function ProjectCard({ project }: { project: Project }) {
    return (
        <div className={styles.card}>
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
                    <a href="#" className={styles.cardActionBtn}>View Details</a>
                </div>
            </div>
        </div>
    );
}