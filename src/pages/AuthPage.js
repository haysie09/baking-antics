import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/config';

// Reusable SVG icon component for the logo
const LogoIcon = () => (
    <svg className="h-16 w-16 text-[#ff6b6b]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C9.24 2 7 4.24 7 7s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm0 3c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5zm8 6H4v-1.1c.33-1.33 3.42-2.9 8-2.9s7.67 1.57 8 2.9V19z"></path>
    </svg>
);

const AuthPage = () => {
    // New state to manage which view is shown: 'welcome', 'login', or 'signup'
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
            <div className="min-h-screen bg-[#FFFAF8] p-6 font-sans">
                <div className="flex items-center mb-8">
                    <button onClick={() => setView('welcome')} className="text-gray-700">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 mx-auto">Create Account</h1>
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input className="w-full rounded-full border-gray-300 bg-white shadow-sm h-12 px-4 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]" placeholder="Enter your name" type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input className="w-full rounded-full border-gray-300 bg-white shadow-sm h-12 px-4 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]" placeholder="Enter your email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input className="w-full rounded-full border-gray-300 bg-white shadow-sm h-12 px-4 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]" placeholder="Enter your password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                     {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button onClick={handleAuthAction} className="w-full flex justify-center rounded-full h-14 items-center px-5 bg-[#FF6B6B] text-white text-lg font-bold shadow-md hover:bg-[#ff4f4f]">
                        Sign Up
                    </button>
                </div>
                <div className="mt-8 text-center">
                    <button onClick={() => setView('login')} className="text-sm text-[#FF6B6B] hover:text-[#ff4f4f] font-medium">
                        Already have an account? <span className="font-bold">Sign In</span>
                    </button>
                </div>
            </div>
        );
    }
    
    // --- LOGIN VIEW ---
    if (view === 'login') {
         return (
            <div className="min-h-screen bg-[#FFFAF8] p-6 font-sans">
                <div className="flex items-center mb-8">
                    <button onClick={() => setView('welcome')} className="text-gray-700">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 mx-auto">Sign In</h1>
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input className="w-full rounded-full border-gray-300 bg-white shadow-sm h-12 px-4 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]" placeholder="Enter your email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input className="w-full rounded-full border-gray-300 bg-white shadow-sm h-12 px-4 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]" placeholder="Enter your password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                     {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button onClick={handleAuthAction} className="w-full flex justify-center rounded-full h-14 items-center px-5 bg-[#FF6B6B] text-white text-lg font-bold shadow-md hover:bg-[#ff4f4f]">
                        Sign In
                    </button>
                </div>
                <div className="mt-8 text-center">
                    <button onClick={() => setView('signup')} className="text-sm text-[#FF6B6B] hover:text-[#ff4f4f] font-medium">
                        Don't have an account? <span className="font-bold">Create one</span>
                    </button>
                </div>
            </div>
        );
    }

    // --- WELCOME VIEW (Default) ---
    return (
        <div className="min-h-screen bg-[#fff5f5] flex flex-col justify-center items-center p-8 text-center font-sans">
            <LogoIcon />
            <h1 className="text-[#4d3232] tracking-tight text-4xl font-bold mt-4">Baking Antics</h1>
            <p className="text-gray-600 text-lg mt-2">Your personal baking assistant</p>
            <div className="w-full max-w-sm mt-12 space-y-4">
                <button onClick={() => setView('login')} className="w-full flex justify-center rounded-full h-14 items-center px-6 bg-[#ff6b6b] text-white text-lg font-bold shadow-lg hover:bg-[#ff4f4f]">
                    Sign In
                </button>
                <button onClick={() => setView('signup')} className="w-full flex justify-center rounded-full h-14 items-center px-6 bg-white text-[#4d3232] text-lg font-bold border border-gray-200 shadow-md hover:bg-gray-50">
                    Create Account
                </button>
            </div>
        </div>
    );
};

export default AuthPage;