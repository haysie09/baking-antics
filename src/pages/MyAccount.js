import React, { useState, useEffect } from 'react';
import { updateProfile, updatePassword } from 'firebase/auth';
import { auth } from '../firebase/config';

const MyAccount = ({ user, userProfile, updateUserProfile, onSignOut }) => { // <-- Accept onSignOut prop
    const [displayName, setDisplayName] = useState('');
    const [profileMessage, setProfileMessage] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    useEffect(() => {
        if (userProfile?.displayName) {
            setDisplayName(userProfile.displayName);
        } else if (user?.displayName) {
            setDisplayName(user.displayName);
        }
    }, [userProfile, user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setProfileMessage('');
        if (displayName.trim() === '') {
            setProfileMessage('Name cannot be empty.');
            return;
        }
        try {
            await updateProfile(auth.currentUser, { displayName });
            await updateUserProfile({ displayName });
            setProfileMessage('Name updated successfully!');
            setTimeout(() => setProfileMessage(''), 3000);
        } catch (error) {
            setProfileMessage(`Error: ${error.message}`);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setPasswordMessage('');
        if (newPassword.length < 6) {
            setPasswordMessage('Password must be at least 6 characters long.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordMessage('Passwords do not match.');
            return;
        }
        try {
            await updatePassword(auth.currentUser, newPassword);
            setPasswordMessage('Password changed successfully!');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => setPasswordMessage(''), 3000);
        } catch (error) {
            setPasswordMessage(`Error: ${error.message}. You may need to sign out and sign back in.`);
        }
    };

    return (
        <div className="p-4 bg-[var(--background-color)] min-h-full font-sans">
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">My Account</h1>

            <div className="space-y-8">
                {/* --- Profile Settings Section --- */}
                <section className="bg-white p-4 rounded-xl shadow-sm border border-pink-100">
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Profile Settings</h2>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Login Email</label>
                            <p className="w-full h-12 px-4 flex items-center bg-gray-100 text-gray-500 rounded-full text-base">
                                {user.email}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                            <input 
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full h-12 px-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none"
                            />
                        </div>
                        <button type="submit" className="w-full h-12 flex items-center justify-center rounded-full bg-[var(--primary-color)] text-white font-bold text-base hover:opacity-90">Save Name</button>
                        {profileMessage && <p className="text-center text-sm mt-2 text-gray-600">{profileMessage}</p>}
                    </form>
                </section>

                {/* --- Security Settings Section --- */}
                <section className="bg-white p-4 rounded-xl shadow-sm border border-pink-100">
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Change Password</h2>
                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input 
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full h-12 px-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input 
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full h-12 px-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none"
                            />
                        </div>
                        <button type="submit" className="w-full h-12 flex items-center justify-center rounded-full bg-[var(--primary-color)] text-white font-bold text-base hover:opacity-90">Update Password</button>
                        {passwordMessage && <p className="text-center text-sm mt-2 text-gray-600">{passwordMessage}</p>}
                    </form>
                </section>

                {/* --- NEW SIGN OUT BUTTON --- */}
                <section>
                     <button 
                        onClick={onSignOut} 
                        className="w-full h-12 flex items-center justify-center rounded-full bg-white text-[var(--primary-color)] font-bold text-base border-2 border-[var(--primary-color)] hover:bg-red-50"
                    >
                        Sign Out
                    </button>
                </section>
            </div>
        </div>
    );
};

export default MyAccount;
