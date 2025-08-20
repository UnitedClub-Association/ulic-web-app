'use client';
import { useState, useEffect, useMemo } from 'react';
import styles from './calendar.module.css';

// --- MOCK EVENT DATA WITH END DATES ---
const mockEvents = [
    { id: 1, name: 'Code Jam Kick-off', date: '2025-08-01T18:00:00', endDate: '2025-08-01T20:00:00', location: 'Main Auditorium', description: 'Opening ceremony for the biggest coding competition!' },
    { id: 2, name: 'React Workshop', date: '2025-08-12T14:00:00', endDate: '2025-08-12T17:00:00', location: 'Room 404', description: 'Learn the fundamentals of React.' },
    { id: 3, name: 'Guest Speaker: AI in Art', date: '2025-08-22T19:30:00', endDate: '2025-08-22T21:00:00', location: 'Online Stream', description: 'Explore the creative frontier where artificial intelligence meets artistic expression.' },
    { id: 4, name: 'Project Showcase Deadline', date: '2025-08-30T23:59:00', endDate: '2025-08-31T00:00:00', location: 'Online Submission', description: 'Final submissions for the summer projects are due.' },
    { id: 5, name: 'September Planning Meeting', date: '2025-09-05T17:00:00', endDate: '2025-09-05T18:30:00', location: 'Club Room', description: 'Planning meeting for all upcoming events in September.' },
];

type ClubEvent = typeof mockEvents[0];

// --- Main Calendar Component ---
export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<ClubEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<ClubEvent | null>(null);

    const eventsForCurrentMonth = useMemo(() => {
        return events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getFullYear() === currentDate.getFullYear() && eventDate.getMonth() === currentDate.getMonth();
        });
    }, [events, currentDate]);

    useEffect(() => {
        setEvents(mockEvents);
    }, [currentDate]);

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
            const eventsOnDay = eventsForCurrentMonth.filter(e => new Date(e.date).getDate() === day);

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
                        <div className={styles.calendarGrid}>{renderCalendarGrid()}</div>
                    </div>
                    <UpcomingEvents events={eventsForCurrentMonth} onEventSelect={setSelectedEvent} />
                </div>
            </main>
            {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
        </>
    );
}

// --- Sub-components ---
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
    const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return (
        <div className={styles.upcomingEventsContainer}>
            <h2 className={styles.upcomingEventsTitle}>Events This Month</h2>
            <div className={styles.upcomingEventsList}>
                {sortedEvents.length > 0 ? sortedEvents.map(event => (
                    <div key={event.id} className={styles.eventItem} onClick={() => onEventSelect(event)}>
                        <div className={styles.eventItemDate}>
                            {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                        </div>
                        <div className={styles.eventItemDetails}>
                            <h3 className={styles.eventItemName}>{event.name}</h3>
                            <p className={styles.eventItemTime}>{new Date(event.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
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
    const startDate = new Date(event.date);
    const endDate = new Date(event.endDate);
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