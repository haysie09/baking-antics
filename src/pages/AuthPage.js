import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthPage = () => {
    const [view, setView] = useState('welcome'); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');

    const handleAuthAction = async () => {
        setError('');
        if (view === 'login') {
            try {
                await signInWithEmailAndPassword(auth, email, password);
            } catch (err) {
                setError("Invalid email or password. Please try again.");
            }
        } else if (view === 'signup') {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                if (nickname.trim()) {
                    await updateProfile(userCredential.user, { displayName: nickname.trim() });
                }
            } catch (err) {
                if (err.code === 'auth/email-already-in-use') {
                    setError("This email is already in use. Please log in.");
                } else {
                    setError("Could not create account. Please try again.");
                }
            }
        }
    };
    
    // --- SIGN UP VIEW ---
    if (view === 'signup') {
        return (
            <div className="min-h-screen bg-[var(--upcoming-bg)] flex flex-col justify-center p-6 font-sans">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Create Account</h1>
                </div>
                <div className="space-y-4">
                    <div>
                        <input className="w-full rounded-full border-gray-300 bg-white/80 shadow-sm h-12 px-5 focus:outline-none focus:ring-2 focus:ring-white placeholder:text-gray-500" placeholder="Your Name" type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                    </div>
                    <div>
                        <input className="w-full rounded-full border-gray-300 bg-white/80 shadow-sm h-12 px-5 focus:outline-none focus:ring-2 focus:ring-white placeholder:text-gray-500" placeholder="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <input className="w-full rounded-full border-gray-300 bg-white/80 shadow-sm h-12 px-5 focus:outline-none focus:ring-2 focus:ring-white placeholder:text-gray-500" placeholder="Password (min. 6 characters)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {error && <p className="text-white bg-red-500/50 p-2 rounded-lg text-sm text-center">{error}</p>}
                    <button onClick={handleAuthAction} className="w-full flex justify-center rounded-full h-14 items-center px-5 bg-[var(--primary-color)] text-white text-lg font-bold shadow-md hover:opacity-90">
                        Sign Up
                    </button>
                </div>
                <div className="mt-8 text-center">
                    <button onClick={() => setView('login')} className="text-sm text-white/80 hover:text-white font-medium">
                        Already have an account? <span className="font-bold underline">Sign In</span>
                    </button>
                </div>
            </div>
        );
    }
    
    // --- LOGIN VIEW ---
    if (view === 'login') {
         return (
            <div className="min-h-screen bg-[var(--upcoming-bg)] flex flex-col justify-center p-6 font-sans">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Welcome Back!</h1>
                </div>
                <div className="space-y-4">
                    <div>
                        <input className="w-full rounded-full border-gray-300 bg-white/80 shadow-sm h-12 px-5 focus:outline-none focus:ring-2 focus:ring-white placeholder:text-gray-500" placeholder="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <input className="w-full rounded-full border-gray-300 bg-white/80 shadow-sm h-12 px-5 focus:outline-none focus:ring-2 focus:ring-white placeholder:text-gray-500" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {error && <p className="text-white bg-red-500/50 p-2 rounded-lg text-sm text-center">{error}</p>}
                    <button onClick={handleAuthAction} className="w-full flex justify-center rounded-full h-14 items-center px-5 bg-[var(--primary-color)] text-white text-lg font-bold shadow-md hover:opacity-90">
                        Sign In
                    </button>
                </div>
                <div className="mt-8 text-center">
                    <button onClick={() => setView('signup')} className="text-sm text-white/80 hover:text-white font-medium">
                        Don't have an account? <span className="font-bold underline">Create one</span>
                    </button>
                </div>
            </div>
        );
    }

    // --- WELCOME VIEW (Default) ---
    return (
        <div className="min-h-screen bg-[var(--upcoming-bg)] flex flex-col justify-center items-center p-8 text-center font-sans">
            <img src="/icon-brand.png" alt="Baking Antics Icon" className="w-32 h-32" />
            <h1 className="text-white tracking-tight text-4xl font-bold mt-4">Baking Antics</h1>
            <p className="text-white/80 text-lg mt-2">Your personal baking assistant</p>
            <div className="w-full max-w-sm mt-12 space-y-4">
                <button onClick={() => setView('login')} className="w-full flex justify-center rounded-full h-14 items-center px-6 bg-[var(--primary-color)] text-white text-lg font-bold shadow-lg hover:opacity-90">
                    Sign In
                </button>
                <button onClick={() => setView('signup')} className="w-full flex justify-center rounded-full h-14 items-center px-6 bg-white/30 text-white text-lg font-bold shadow-md hover:bg-white/40">
                    Create Account
                </button>
            </div>
        </div>
    );
};

export default AuthPage;
