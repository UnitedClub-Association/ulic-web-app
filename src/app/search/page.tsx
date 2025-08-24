'use client';
import { useState, useEffect } from 'react';
import styles from './search.module.css';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import toast from 'react-hot-toast';

const MAX_RECENT_SEARCHES = 7;

type SearchResult = {
    id: string;
    type: 'profile';
    full_name: string;
    username: string;
    avatar_url: string;
};

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false); // Track if a search has been performed
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const savedSearches = localStorage.getItem('ulic-recent-searches');
        if (savedSearches) {
            setRecentSearches(JSON.parse(savedSearches));
        }
    }, []);

    const handleSearch = async (query: string) => {
        setHasSearched(true); // Mark that a search has occurred
        if (!query.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, username, avatar_url')
            .or(`full_name.ilike.%${query}%,username.ilike.%${query}%`)
            .limit(10);

        if (error) {
            console.error("Search error:", error);
            toast.error("Failed to perform search.");
        } else {
            const formattedResults = data.map(profile => ({ ...profile, type: 'profile' as const }));
            setResults(formattedResults);
        }
        setLoading(false);
    };
    
    const updateRecentSearches = (query: string) => {
        const updatedSearches = [query, ...recentSearches.filter(s => s.toLowerCase() !== query.toLowerCase())].slice(0, MAX_RECENT_SEARCHES);
        setRecentSearches(updatedSearches);
        localStorage.setItem('ulic-recent-searches', JSON.stringify(updatedSearches));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedSearch = searchTerm.trim();
        if (!trimmedSearch) return;
        updateRecentSearches(trimmedSearch);
        handleSearch(trimmedSearch);
    };
    
    const handleRecentSearchClick = (query: string) => {
        setSearchTerm(query);
        handleSearch(query);
    };
    
    const handleResultClick = (username: string) => {
        router.push(`/profile/${username}`);
    };

    return (
        <main className={styles.mainContent}>
            <form onSubmit={handleFormSubmit} className={styles.searchContainer}>
                <i className="fas fa-search"></i>
                <input 
                    type="text" 
                    placeholder="Search for users by name or @username..." 
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </form>

            {/* --- NEW: Enhanced Results Container --- */}
            <div className={styles.resultsContainer}>
                {loading ? (
                    <div className={styles.stateMessage}>
                        <div className={styles.spinner}></div>
                        <p>Searching...</p>
                    </div>
                ) : hasSearched ? (
                    results.length > 0 ? (
                        results.map(result => (
                            <div key={result.id} className={styles.resultItem} onClick={() => handleResultClick(result.username)}>
                                <Image src={result.avatar_url || '/user-icon.png'} alt={result.full_name} width={50} height={50} />
                                <div className={styles.resultInfo}>
                                    <h4>{result.full_name}</h4>
                                    <p>{result.username}</p>
                                </div>
                                <div className={styles.viewProfile}>
                                    View Profile <i className="fas fa-arrow-right"></i>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.stateMessage}>
                             <p>No results found for "{searchTerm}"</p>
                        </div>
                    )
                ) : (
                     <section className={styles.discoverySection}>
                        {recentSearches.length > 0 && (
                            <>
                                <div className={styles.sectionHeader}>
                                    <h3 className={styles.sectionTitle}>Recent Searches</h3>
                                    <button onClick={() => { setRecentSearches([]); localStorage.removeItem('ulic-recent-searches'); }} className={styles.clearButton}>Clear</button>
                                </div>
                                <div className={styles.itemGrid}>
                                    {recentSearches.map(term => (
                                        <div key={term} className={styles.itemPill} onClick={() => handleRecentSearchClick(term)}>
                                            <i className="fas fa-history"></i>
                                            <span>{term}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </section>
                )}
            </div>
        </main>
    );
}