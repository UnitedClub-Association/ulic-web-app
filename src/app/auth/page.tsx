'use client';
import { useState } from 'react';
import styles from './auth.module.css';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export default function AuthPage() {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [status, setStatus] = useState('Student');
    const [loading, setLoading] = useState(false);
    const supabase = createClient();
    const router = useRouter();
    const { refreshUser } = useAuth(); // Get the refresh function

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading('Creating your account...');

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        if (error) {
            toast.error(error.message, { id: toastId });
        } else {
            toast.success('Success! Please check your inbox to verify your email.', {
                id: toastId,
                duration: 6000
            });
            setEmail('');
            setPassword('');
            setFullName('');
            setIsLoginView(true);
        }
        setLoading(false);
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading('Signing in...');

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            toast.error(error.message, { id: toastId });
        } else {
            // **CRITICAL FIX**: Refresh user data BEFORE redirecting to prevent login loop
            await refreshUser(); 
            toast.success('Welcome back!', { id: toastId });
            router.push('/profile');
        }
        setLoading(false);
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
                        <button type="submit" className={styles.btnPrimary} disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
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
                        <button type="submit" className={styles.btnPrimary} disabled={loading}>
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}