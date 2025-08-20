import Image from 'next/image';
import Link from 'next/link';
import styles from './homepage.module.css';

// Mock data for homepage cards - replace with actual data fetching later
const featuredEvents = [
  { id: 1, title: 'Code Jam 2024 Kick-off', description: 'Join us for the opening ceremony of the biggest coding competition of the year!', imageUrl: '/event1.jpg' },
  { id: 2, title: 'Workshop: Intro to React', description: 'Learn the fundamentals of React and start building your own web apps.', imageUrl: '/event2.jpg' },
  { id: 3, title: 'Guest Speaker: AI in Art', description: 'Explore the creative frontier where artificial intelligence meets artistic expression.', imageUrl: '/event3.jpg' },
];

const featuredProjects = [
  { id: 1, title: 'ULIC Club Website', description: 'The official website for the club, built collaboratively by our members using Next.js.' },
  { id: 2, title: 'Discord Bot Assistant', description: 'A custom bot to manage roles, events, and announcements on our Discord server.' },
  { id: 3, title: 'Open Source Weather App', description: 'A community-driven project to build a beautiful and accurate weather application.' },
];


export default function HomePage() {
  return (
    <>
      {/* Animated background shapes from the original design */}
      <div className={styles.backgroundShapes}>
        <div className={`${styles.shape} ${styles.shape1}`}></div>
        <div className={`${styles.shape} ${styles.shape2}`}></div>
        <div className={`${styles.shape} ${styles.shape3}`}></div>
      </div>

      <main className={styles.mainContent}>
        {/* --- HERO SECTION --- */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>Welcome to ULIC!</h1>
            <p>Join the University Laboratory ICT Club and dive into the world of tech with coding, projects, and events!</p>
            <div className={styles.heroCta}>
              <Link href="/events" className={styles.btnPrimary}>Explore Events</Link>
              <Link href="/projects" className={styles.btnSecondary}>See Projects</Link>
            </div>
          </div>
        </section>

        {/* --- LIVE & UPCOMING EVENTS --- */}
        <section className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <h2>Live & Upcoming Events</h2>
            <Link href="/events" className={styles.viewAllBtn}>View All <i className="fas fa-arrow-right"></i></Link>
          </div>
          <div className={styles.cardGrid}>
            {featuredEvents.map(event => (
              <div key={event.id} className={styles.card}>
                <Image src={event.imageUrl} alt={event.title} width={400} height={200} className={styles.cardImage} />
                <div className={styles.cardContent}>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- FEATURED PROJECTS --- */}
        <section className={styles.contentSection}>
          <div className={styles.sectionHeader}>
            <h2>Featured Projects</h2>
            <Link href="/projects" className={styles.viewAllBtn}>View All <i className="fas fa-arrow-right"></i></Link>
          </div>
          <div className={styles.cardGrid}>
            {featuredProjects.map(project => (
              <div key={project.id} className={styles.card}>
                <div className={styles.cardContent}>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}