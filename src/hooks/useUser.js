import { useState, useEffect, useCallback } from 'react';
import { db, auth } from '../firebase/config';
import { doc, onSnapshot, setDoc, updateDoc, getDoc } from 'firebase/firestore';

export const useUser = () => {
    const [userProfile, setUserProfile] = useState(null);
    const userId = auth.currentUser?.uid;

    // Function to create or update the user's profile
    const updateUserProfile = useCallback(async (data) => {
        if (!userId) return;
        const userDocRef = doc(db, 'users', userId);
        try {
            // Use updateDoc if it exists, otherwise setDoc to create it
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
                await updateDoc(userDocRef, data);
            } else {
                await setDoc(userDocRef, { ...data, createdAt: new Date() }, { merge: true });
            }
        } catch (error) {
            console.error("Error updating user profile:", error);
        }
    }, [userId]);

    // Effect to listen for real-time changes to the user's profile
    useEffect(() => {
        if (!userId) {
            setUserProfile(null);
            return;
        }

        const userDocRef = doc(db, 'users', userId);
        const unsub = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
                setUserProfile({ id: doc.id, ...doc.data() });
            } else {
                // If no profile exists, create a default one
                updateUserProfile({ hasCompletedTour: false, displayName: auth.currentUser.displayName || '' });
            }
        });

        return () => unsub();
    }, [userId, updateUserProfile]);

    return { userProfile, updateUserProfile };
};
