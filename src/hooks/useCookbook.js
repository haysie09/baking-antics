import { useState, useEffect, useCallback, useMemo } from 'react';
import { db, auth } from '../firebase/config';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const appId = 'baking-antics-v1';

export const useCookbook = () => {
    const [cookbook, setCookbook] = useState([]);
    const userId = auth.currentUser?.uid;

    const cookbookCol = useMemo(() => {
        if (!userId) return null;
        return collection(db, 'artifacts', appId, 'users', userId, 'cookbook');
    }, [userId]);

    useEffect(() => {
        if (!cookbookCol) {
            setCookbook([]);
            return;
        }
        const unsub = onSnapshot(cookbookCol, s => setCookbook(s.docs.map(d => ({ id: d.id, ...d.data() }))));
        return () => unsub();
    }, [cookbookCol]);

    // <-- UPDATED THIS FUNCTION -->
    const addRecipe = useCallback(async (recipe) => {
        if (cookbookCol) {
            // Get the reference to the new document from the database
            const docRef = await addDoc(cookbookCol, recipe);
            // Create the full recipe object, including the new ID
            const newRecipe = { id: docRef.id, ...recipe };
            // Return the new recipe so App.js can use it
            return newRecipe;
        }
        return null; // Return null if the operation fails
    }, [cookbookCol]);

    const updateRecipe = useCallback(async (id, recipe) => {
        if (cookbookCol) await updateDoc(doc(cookbookCol, id), recipe);
    }, [cookbookCol]);

    const deleteRecipe = useCallback(async (id) => {
        if (cookbookCol) await deleteDoc(doc(cookbookCol, id));
    }, [cookbookCol]);

    return { cookbook, addRecipe, updateRecipe, deleteRecipe };
};