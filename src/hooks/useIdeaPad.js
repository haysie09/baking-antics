import { useState, useEffect, useCallback, useMemo } from 'react';
import { db, auth } from '../firebase/config';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';

const appId = 'baking-antics-v1';

export const useIdeaPad = () => {
    const [ideaPad, setIdeaPad] = useState([]);
    const userId = auth.currentUser?.uid;

    const ideaPadCol = useMemo(() => {
        if (!userId) return null;
        return collection(db, 'artifacts', appId, 'users', userId, 'ideapad');
    }, [userId]);

    useEffect(() => {
        if (!ideaPadCol) return;
        const unsub = onSnapshot(ideaPadCol, snapshot => {
            setIdeaPad(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return () => unsub();
    }, [ideaPadCol]);

    const addIdea = useCallback(async (idea) => {
        if (ideaPadCol) await addDoc(ideaPadCol, idea);
    }, [ideaPadCol]);

    const deleteIdea = useCallback(async (id) => {
        if (ideaPadCol) await deleteDoc(doc(ideaPadCol, id));
    }, [ideaPadCol]);

    return { ideaPad, addIdea, deleteIdea };
};