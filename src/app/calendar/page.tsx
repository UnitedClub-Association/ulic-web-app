'use client';
import { useState, useEffect, useMemo } from 'react';
import styles from './calendar.module.css';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

// Define the type for an event to match your Supabase table
type ClubEvent = {
    id: string;
    name: string;
    description: string;
    start_time: string;
    end_time: string;
    location: string;
};

// --- Main Calendar Component ---
export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<ClubEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<ClubEvent | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    // Fetch events from Supabase when the component mounts or the date changes
    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('start_time', { ascending: true });
            
            if (error) {
                toast.error("Could not fetch calendar events.");
                console.error("Calendar fetch error:", error);
            } else {
                setEvents(data);
            }
            setLoading(false);
        };
        fetchEvents();
    }, [supabase]);

    const eventsForCurrentMonth = useMemo(() => {
        return events.filter(event => {
            const eventDate = new Date(event.start_time);
            return eventDate.getFullYear() === currentDate.getFullYear() && eventDate.getMonth() === currentDate.getMonth();
        });
    }, [events, currentDate]);

    const changeMonth = (amount: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + amount);
            return newDate;
        });
    };

    const renderCalendarGrid = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className={`${styles.calendarDay} ${styles.empty}`}></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const eventsOnDay = eventsForCurrentMonth.filter(e => new Date(e.start_time).getDate() === day);

            const dayClasses = `${styles.calendarDay} ${isToday ? styles.today : ''} ${eventsOnDay.length > 0 ? styles.hasEvent : ''}`;
            
            days.push(
                <div key={day} className={dayClasses} onClick={() => eventsOnDay.length > 0 && setSelectedEvent(eventsOnDay[0])}>
                    <span className={styles.dayNumber}>{day}</span>
                </div>
            );
        }
        return days;
    };

    return (
        <>
            <div className={styles.backgroundShapes}>
                <div className={`${styles.shape} ${styles.shape1}`}></div>
                <div className={`${styles.shape} ${styles.shape2}`}></div>
            </div>
            <main className={styles.content}>
                <h1 className={styles.pageTitle}>Event Calendar</h1>
                <p className={styles.pageSubtitle}>An interactive calendar of all club events.</p>

                <div className={styles.calendarMainContainer}>
                    <div className={styles.calendarContainer}>
                        <CalendarHeader currentDate={currentDate} onMonthChange={changeMonth} />
                        <div className={styles.calendarWeekdays}>
                            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                        </div>
                        <div className={styles.calendarGrid}>{loading ? <p>Loading...</p> : renderCalendarGrid()}</div>
                    </div>
                    <UpcomingEvents events={eventsForCurrentMonth} onEventSelect={setSelectedEvent} />
                </div>
            </main>
            {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
        </>
    );
}

// --- Sub-components (Updated to use dynamic data properties) ---
function CalendarHeader({ currentDate, onMonthChange }: { currentDate: Date, onMonthChange: (amount: number) => void }) {
    return (
        <div className={styles.calendarHeader}>
            <button onClick={() => onMonthChange(-1)} className={styles.navBtn}><i className="fas fa-chevron-left"></i></button>
            <h2 className={styles.monthYearDisplay}>
                {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
            </h2>
            <button onClick={() => onMonthChange(1)} className={styles.navBtn}><i className="fas fa-chevron-right"></i></button>
        </div>
    );
}

function UpcomingEvents({ events, onEventSelect }: { events: ClubEvent[], onEventSelect: (event: ClubEvent) => void }) {
    const sortedEvents = [...events].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
    return (
        <div className={styles.upcomingEventsContainer}>
            <h2 className={styles.upcomingEventsTitle}>Events This Month</h2>
            <div className={styles.upcomingEventsList}>
                {sortedEvents.length > 0 ? sortedEvents.map(event => (
                    <div key={event.id} className={styles.eventItem} onClick={() => onEventSelect(event)}>
                        <div className={styles.eventItemDate}>
                            {new Date(event.start_time).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                        </div>
                        <div className={styles.eventItemDetails}>
                            <h3 className={styles.eventItemName}>{event.name}</h3>
                            <p className={styles.eventItemTime}>{new Date(event.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
                        </div>
                    </div>
                )) : (
                    <div className={styles.eventListPlaceholder}><p>No events scheduled for this month.</p></div>
                )}
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
                    <span>{startDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className={styles.modalDetail}>
                    <i className="fas fa-clock"></i>
                    <span>
                        {startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - {endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </span>
                </div>
                <div className={styles.modalDetail}>
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{event.location}</span>
                </div>
                <p className={styles.modalDescription}>{event.description}</p>
                <a href={googleCalendarUrl} target="_blank" rel="noopener noreferrer" className={styles.addToCalendarBtn}>
                    <i className="fab fa-google"></i> Add to Google Calendar
                </a>
            </div>
        </div>
    );
}