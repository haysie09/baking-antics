import React, { useState, useEffect } from 'react';
import { updateProfile, updatePassword } from 'firebase/auth';
import { auth } from '../firebase/config';

const MyAccount = ({ user, userProfile, updateUserProfile }) => {
    // State for the profile form
    const [displayName, setDisplayName] = useState('');
    const [profileMessage, setProfileMessage] = useState('');

    // State for the password form
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    // Pre-fill the display name field when the component loads or when the profile updates
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
        <div className="p-4 md:p-6 bg-app-white min-h-full font-patrick-hand">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-burnt-orange">My Account</h1>
            </div>

            <div className="space-y-10">
                {/* --- Profile Settings Section --- */}
                <div className="bg-info-box p-6 rounded-2xl border border-burnt-orange">
                    <h2 className="text-2xl font-bold text-add-idea mb-4">Profile Settings</h2>
                    <form onSubmit={handleProfileUpdate} className="space-y-4 font-montserrat">
                        <div>
                            <label className="block text-app-grey font-semibold mb-1 text-lg">Login Email</label>
                            <p className="w-full p-3 bg-gray-200 text-gray-500 rounded-xl text-base">
                                {user.email}
                            </p>
                        </div>
                        <div>
                            <label className="block text-app-grey font-semibold mb-1 text-lg">Display Name</label>
                            <input 
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl text-base"
                            />
                        </div>
                        <button type="submit" className="w-full bg-burnt-orange text-light-peach py-2 px-4 rounded-xl text-base font-semibold hover:opacity-90">Save Name</button>
                        {profileMessage && <p className="text-center text-sm mt-2">{profileMessage}</p>}
                    </form>
                </div>

                {/* --- Security Settings Section --- */}
                <div className="bg-info-box p-6 rounded-2xl border border-burnt-orange">
                    <h2 className="text-2xl font-bold text-add-idea mb-4">Change Password</h2>
                    <form onSubmit={handlePasswordUpdate} className="space-y-4 font-montserrat">
                        <div>
                            <label className="block text-app-grey font-semibold mb-1 text-lg">New Password</label>
                            <input 
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl text-base"
                            />
                        </div>
                         <div>
                            <label className="block text-app-grey font-semibold mb-1 text-lg">Confirm New Password</label>
                            <input 
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl text-base"
                            />
                        </div>
                        <button type="submit" className="w-full bg-burnt-orange text-light-peach py-2 px-4 rounded-xl text-base font-semibold hover:opacity-90">Update Password</button>
                        {passwordMessage && <p className="text-center text-sm mt-2">{passwordMessage}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MyAccount;
