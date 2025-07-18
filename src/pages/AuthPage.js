import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/config'; // Corrected import

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');

    const handleAuthAction = async () => {
        setError('');
        if (isLogin) {
            try {
                await signInWithEmailAndPassword(auth, email, password);
            } catch (err) {
                setError(err.message);
            }
        } else {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                if (nickname) {
                    await updateProfile(userCredential.user, { displayName: nickname });
                }
            } catch (err) {
                setError(err.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-app-white flex items-center justify-center p-4 font-patrick-hand">
            <div className="w-full max-w-sm mx-auto">
                <h1 className="text-5xl font-bold text-add-idea text-center mb-8">Baking Antics</h1>
                <div className="bg-info-box p-8 rounded-2xl border border-burnt-orange space-y-6">
                    <h2 className="text-3xl text-burnt-orange text-center">{isLogin ? 'Log In' : 'Sign Up'}</h2>
                    {!isLogin && (
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="Name / Nickname (Optional)"
                            className="w-full p-3 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-burnt-orange focus:outline-none font-montserrat"
                        />
                    )}
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full p-3 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-burnt-orange focus:outline-none font-montserrat"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full p-3 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-burnt-orange focus:outline-none font-montserrat"
                    />
                    {error && <p className="text-red-500 text-sm text-center font-montserrat">{error}</p>}
                    <button onClick={handleAuthAction} className="w-full bg-burnt-orange text-light-peach py-3 px-6 rounded-xl text-xl hover:opacity-90 transition-opacity font-montserrat">
                        {isLogin ? 'Log In' : 'Sign Up'}
                    </button>
                    <button onClick={() => setIsLogin(!isLogin)} className="w-full text-center text-app-grey hover:text-burnt-orange text-lg">
                        {isLogin ? 'Need an account? Sign Up' : 'Have an account? Log In'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;