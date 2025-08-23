import { useState, useEffect, useCallback, useMemo } from 'react';
import { db, auth } from '../firebase/config';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, query, where, getDocs, writeBatch } from 'firebase/firestore';

const appId = 'baking-antics-v1';

export const useCollections = () => {
    const [collections, setCollections] = useState([]);
    const userId = auth.currentUser?.uid;

    const collectionsCol = useMemo(() => {
        if (!userId) return null;
        return collection(db, 'users', userId, 'recipeCollections');
    }, [userId]);

    const cookbookCol = useMemo(() => {
        if (!userId) return null;
        return collection(db, 'artifacts', appId, 'users', userId, 'cookbook');
    }, [userId]);

    useEffect(() => {
        if (!collectionsCol) {
            setCollections([]);
            return;
        };
        const unsub = onSnapshot(collectionsCol, snapshot => {
            const fetchedCollections = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setCollections(fetchedCollections);
        });
        return () => unsub();
    }, [collectionsCol]);

    const addCollection = useCallback(async (collectionName) => {
        if (collectionsCol) {
            await addDoc(collectionsCol, { 
                name: collectionName,
                createdAt: new Date()
            });
        }
    }, [collectionsCol]);

    // --- NEW: Function to update a collection's name ---
    const updateCollection = useCallback(async (collectionId, newName) => {
        if (collectionsCol) {
            const docRef = doc(collectionsCol, collectionId);
            await updateDoc(docRef, { name: newName });
        }
    }, [collectionsCol]);

    // --- NEW: Function to delete a collection and unassign its recipes ---
    const deleteCollection = useCallback(async (collectionId) => {
        if (!collectionsCol || !cookbookCol) return;

        try {
            // 1. Find all recipes in the collection to be deleted
            const q = query(cookbookCol, where("collectionId", "==", collectionId));
            const querySnapshot = await getDocs(q);

            // 2. Create a batch write to unassign all found recipes
            const batch = writeBatch(db);
            querySnapshot.forEach((doc) => {
                batch.update(doc.ref, { collectionId: null }); // Set collectionId to null
            });

            // 3. Delete the collection document itself
            const collectionDocRef = doc(collectionsCol, collectionId);
            batch.delete(collectionDocRef);

            // 4. Commit all the changes at once
            await batch.commit();

        } catch (error) {
            console.error("Error deleting collection:", error);
        }
    }, [collectionsCol, cookbookCol, db]);

    // Return the new functions so our components can use them
    return { collections, addCollection, updateCollection, deleteCollection };
};
