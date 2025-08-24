'use client';
import { useState, useEffect, useMemo } from 'react';
import styles from './events.module.css';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

// Define the type for an event based on your Supabase table
type ClubEvent = {
    id: string;
    name: string;
    description: string;
    start_time: string;
    end_time: string;
    location: string;
    tags: string[];
    banner_url: string;
};

// --- Main Events Page Component ---
export default function EventsPage() {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'live' | 'all'>('upcoming');
    const [selectedEvent, setSelectedEvent] = useState<ClubEvent | null>(null);
    const [allEvents, setAllEvents] = useState<ClubEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('start_time', { ascending: true });

            if (error) {
                toast.error("Could not fetch events.");
                console.error(error);
            } else {
                setAllEvents(data);
            }
            setLoading(false);
        };
        fetchEvents();
    }, [supabase]);

    const filteredEvents = useMemo(() => {
        const now = new Date();
        switch (activeTab) {
            case 'live':
                return allEvents.filter(e => new Date(e.start_time) <= now && new Date(e.end_time) >= now);
            case 'all':
                return allEvents;
            case 'upcoming':
            default:
                return allEvents.filter(e => new Date(e.start_time) > now);
        }
    }, [activeTab, allEvents]);

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
                {loading ? (
                    <p className={styles.noEventsMessage}>Loading events...</p>
                ) : filteredEvents.length > 0 ? (
                    filteredEvents.map(event => <EventCard key={event.id} event={event} onSelect={() => setSelectedEvent(event)} />)
                ) : (
                    <p className={styles.noEventsMessage}>No events match the current filter.</p>
                )}
            </div>
            
            {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
        </main>
    );
}

// --- Sub-components ---
function EventCard({ event, onSelect }: { event: ClubEvent, onSelect: () => void }) {
    const isLive = new Date(event.start_time) <= new Date() && new Date(event.end_time) >= new Date();
    const eventDate = new Date(event.start_time).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
    });

    return (
        <div className={`${styles.card} ${isLive ? styles.live : ''}`} onClick={onSelect}>
            <Image src={event.banner_url || '/event-placeholder.png'} alt={event.name} width={400} height={180} className={styles.cardImage} />
            <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                    <h3>{event.name}</h3>
                    {/* Assuming tags is an array; displaying the first one */}
                    <span className={styles.cardEventType}>{event.tags?.[0] || 'Event'}</span>
                </div>
                <p>{event.description}</p>
                <div className={styles.cardFooter}>
                    <span className={styles.cardDate}>{eventDate}</span>
                    <span className={styles.cardActionBtn}>View Details</span>
                </div>
            </div>
        </div>
    );
}

function EventModal({ event, onClose }: { event: ClubEvent, onClose: () => void }) {
    const startDate = new Date(event.start_time);
    const endDate = new Date(event.end_time);
    
    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${startDate.toISOString().replace(/-|:|\.\d+/g, '')}/${endDate.toISOString().replace(/-|:|\.\d+/g, '')}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;

    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button className={styles.modalCloseBtn} onClick={onClose}><i className="fas fa-times"></i></button>
                <h2 className={styles.modalTitle}>{event.name}</h2>
                <div className={styles.modalDetail}>
                    <i className="fas fa-calendar-alt"></i>
                    <span>{startDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                </div>
                 <div className={styles.modalDetail}>
                    <i className="fas fa-clock"></i>
                    <span>{startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className={styles.modalDescription}>{event.description}</p>
                {event.tags && (
                    <div className={styles.tagContainer}>
                        {event.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
                    </div>
                )}
                 <a href={googleCalendarUrl} target="_blank" rel="noopener noreferrer" className={styles.addToCalendarBtn}>
                    <i className="fab fa-google"></i> Add to Google Calendar
                </a>
            </div>
        </div>
    );
}