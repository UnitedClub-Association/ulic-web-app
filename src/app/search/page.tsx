'use client';
import { useState, useEffect } from 'react';
import styles from './search.module.css';
import { useRouter } from 'next/navigation';

// --- MOCK DATA ---
const trendingItems = [
  { type: 'tag', value: 'Web Dev' },
  { type: 'user', value: '@sazidur62' },
  { type: 'project', value: 'ULIC Club Website' },
  { type: 'event', value: 'React Workshop' },
  { type: 'tag', value: 'Competition' },
  { type: 'user', value: '@janedoe_dev' },
];

const MAX_RECENT_SEARCHES = 7;

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const router = useRouter();

    // Load recent searches from localStorage on initial render
    useEffect(() => {
        const savedSearches = localStorage.getItem('ulic-recent-searches');
        if (savedSearches) {
            setRecentSearches(JSON.parse(savedSearches));
        }
    }, []);

    const handleSearch = (query: string) => {
        if (!query.trim()) return;

        // Update recent searches
        const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, MAX_RECENT_SEARCHES);
        setRecentSearches(updatedSearches);
        localStorage.setItem('ulic-recent-searches', JSON.stringify(updatedSearches));

        // For now, let's just log it. Later, this can navigate to a results page.
        console.log(`Searching for: ${query}`);
        // Example navigation: router.push(`/search/results?q=${encodeURIComponent(query)}`);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(searchTerm);
    };
    
    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('ulic-recent-searches');
    };

    return (
        <main className={styles.mainContent}>
            <form onSubmit={handleFormSubmit} className={styles.searchContainer}>
                <i className="fas fa-search"></i>
                <input 
                    type="text" 
                    placeholder="Search by tag, name, or @username..." 
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </form>

            {/* --- Trending Section --- */}
            <section className={styles.discoverySection}>
                <h2 className={styles.sectionTitle}>Trending Now</h2>
                <div className={styles.itemGrid}>
                    {trendingItems.map((item, index) => (
                        <button key={index} className={styles.itemPill} onClick={() => handleSearch(item.value)}>
                            {item.type === 'tag' && <i className="fas fa-hashtag"></i>}
                            {item.type === 'user' && <i className="fas fa-user"></i>}
                            {item.type === 'project' && <i className="fas fa-project-diagram"></i>}
                            {item.type === 'event' && <i className="fas fa-bell"></i>}
                            <span>{item.value}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* --- Recent Searches Section --- */}
            {recentSearches.length > 0 && (
                <section className={styles.discoverySection}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Recent Searches</h2>
                        <button onClick={clearRecentSearches} className={styles.clearButton}>Clear</button>
                    </div>
                    <div className={styles.itemGrid}>
                        {recentSearches.map((item, index) => (
                            <button key={index} className={styles.itemPill} onClick={() => handleSearch(item)}>
                                <i className="fas fa-history"></i>
                                <span>{item}</span>
                            </button>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}