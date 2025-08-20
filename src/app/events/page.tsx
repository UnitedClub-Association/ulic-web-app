'use client';
import { useState, useMemo } from 'react';
import styles from './events.module.css';
import Image from 'next/image';

// --- Mock Event Data ---
const allEvents = [
    { id: 1, name: 'Live Code Review', type: 'Session', startTime: '2025-08-20T00:30:00', endTime: '2025-08-20T02:00:00', imageUrl: '/event-live.jpg', description: 'Join us for a live code review session for the new club website.' },
    { id: 2, name: 'Upcoming: React Workshop', type: 'Event', startTime: '2025-08-22T14:00:00', endTime: '2025-08-22T16:00:00', imageUrl: '/event2.jpg', description: 'Learn the fundamentals of React.' },
    { id: 3, name: 'Featured: AI in Art', type: 'Event', isFeatured: true, startTime: '2025-09-05T19:30:00', endTime: '2025-09-05T21:00:00', imageUrl: '/event3.jpg', description: 'Guest speaker on the intersection of AI and art.' },
    { id: 4, name: 'Past: Code Jam 2024', type: 'Event', startTime: '2024-07-15T10:00:00', endTime: '2024-07-15T18:00:00', imageUrl: '/event1.jpg', description: 'Annual competitive programming contest.' },
];
type ClubEvent = typeof allEvents[0];

// --- Main Events Page Component ---
export default function EventsPage() {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'live' | 'all'>('upcoming');

    const now = new Date();

    const filteredEvents = useMemo(() => {
        switch (activeTab) {
            case 'live':
                return allEvents.filter(e => new Date(e.startTime) <= now && new Date(e.endTime) >= now);
            case 'all':
                return allEvents;
            case 'upcoming':
            default:
                return allEvents.filter(e => new Date(e.startTime) > now);
        }
    }, [activeTab]);

    return (
        <main className={styles.mainContent}>
            <header className={styles.pageHeader}>
                <h1>Community Events</h1>
                <p>Discover workshops, competitions, and sessions.</p>
            </header>

            <div className={styles.tabContainer}>
                <button onClick={() => setActiveTab('upcoming')} className={activeTab === 'upcoming' ? styles.active : ''}>Upcoming</button>
                <button onClick={() => setActiveTab('live')} className={activeTab === 'live' ? styles.active : ''}>Live Now</button>
                <button onClick={() => setActiveTab('all')} className={activeTab === 'all' ? styles.active : ''}>All Events</button>
            </div>

            <div className={styles.cardGrid}>
                {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => <EventCard key={event.id} event={event} />)
                ) : (
                    <p className={styles.noEventsMessage}>No events match the current filter.</p>
                )}
            </div>
        </main>
    );
}

// --- Event Card Sub-component ---
function EventCard({ event }: { event: ClubEvent }) {
    const isLive = new Date(event.startTime) <= new Date() && new Date(event.endTime) >= new Date();
    const eventDate = new Date(event.startTime).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
    });

    return (
        <div className={`${styles.card} ${isLive ? styles.live : ''}`}>
            <Image src={event.imageUrl} alt={event.name} width={400} height={180} className={styles.cardImage} />
            <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                    <h3>{event.name}</h3>
                    <span className={styles.cardEventType}>{event.type}</span>
                </div>
                <p>{event.description}</p>
                <div className={styles.cardFooter}>
                    <span className={styles.cardDate}>{eventDate}</span>
                    <a href="#" className={styles.cardActionBtn}>View Details</a>
                </div>
            </div>
        </div>
    );
}