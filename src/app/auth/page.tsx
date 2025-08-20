'use client';
import { useState } from 'react';
import styles from './auth.module.css';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [status, setStatus] = useState('Student');
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    // Note: We sync status/role via a database trigger after profile creation
                },
            },
        });

        if (error) {
            setError(error.message);
        } else if (data.user) {
            // After signing up, we need to create a corresponding profile
            const { error: profileError } = await supabase.from('profiles').insert({
                id: data.user.id,
                full_name: fullName,
                // A secure way to get a unique username is needed in a real app
                username: `@${fullName.toLowerCase().replace(/\s/g, '')}${Math.floor(Math.random() * 1000)}`,
                status: status,
                // Role will be set by the database trigger
            });

            if (profileError) {
                setError(profileError.message);
            } else {
                alert('Sign up successful! Please check your email to verify.');
                router.push('/');
            }
        }
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            router.push('/profile');
        }
    };

    return (
        <div className={styles.authPage}>
            <div className={styles.authModal}>
                <div className={styles.tabContainer}>
                    <button onClick={() => setIsLoginView(true)} className={isLoginView ? styles.active : ''}>Login</button>
                    <button onClick={() => setIsLoginView(false)} className={!isLoginView ? styles.active : ''}>Sign Up</button>
                </div>

                {isLoginView ? (
                    <form onSubmit={handleSignIn} className={styles.form}>
                        <h2>Welcome Back!</h2>
                        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                        <button type="submit" className={styles.btnPrimary}>Login</button>
                    </form>
                ) : (
                    <form onSubmit={handleSignUp} className={styles.form}>
                        <h2>Create Your Account</h2>
                        <input type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} required />
                        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                        <input type="password" placeholder="Password (min. 6 characters)" value={password} onChange={e => setPassword(e.target.value)} required />
                        <select value={status} onChange={e => setStatus(e.target.value)}>
                            <option value="Student">Student</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Other">Other</option>
                        </select>
                        <button type="submit" className={styles.btnPrimary}>Sign Up</button>
                    </form>
                )}
                {error && <p className={styles.errorMessage}>{error}</p>}
            </div>
        </div>
    );
}