import { useState, useEffect, useCallback, useMemo } from 'react';
import { db, auth } from '../firebase/config';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const appId = 'baking-antics-v1';

export const useUpcomingBakes = () => {
    const [upcomingBakes, setUpcomingBakes] = useState([]);
    const userId = auth.currentUser?.uid;

    const upcomingBakesCol = useMemo(() => {
        if (!userId) return null;
        return collection(db, 'artifacts', appId, 'users', userId, 'upcomingBakes');
    }, [userId]);

    useEffect(() => {
        if (!upcomingBakesCol) {
            setUpcomingBakes([]);
            return;
        }
        const unsub = onSnapshot(upcomingBakesCol, s => {
            setUpcomingBakes(s.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return () => unsub();
    }, [upcomingBakesCol]);

    const addUpcomingBake = useCallback(async (bake) => {
        if (upcomingBakesCol) {
            await addDoc(upcomingBakesCol, { ...bake, createdAt: new Date() });
        }
    }, [upcomingBakesCol]);

    const updateUpcomingBake = useCallback(async (id, bake) => {
        if (upcomingBakesCol) {
            await updateDoc(doc(upcomingBakesCol, id), bake);
        }
    }, [upcomingBakesCol]);

    const deleteUpcomingBake = useCallback(async (id) => {
        if (upcomingBakesCol) {
            await deleteDoc(doc(upcomingBakesCol, id));
        }
    }, [upcomingBakesCol]);

    return { upcomingBakes, addUpcomingBake, updateUpcomingBake, deleteUpcomingBake };
};