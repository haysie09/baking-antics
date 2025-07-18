import { useState, useEffect, useCallback } from 'react';
import { db, auth } from '../firebase/config';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const appId = 'baking-antics-v1'; // We'll move this to a config file later

export const useJournal = () => {
    const [journal, setJournal] = useState([]);
    const userId = auth.currentUser?.uid;

    const journalCol = useMemo(() => {
        if (!userId) return null;
        return collection(db, 'artifacts', appId, 'users', userId, 'journal');
    }, [userId]);

    useEffect(() => {
        if (!journalCol) return;
        const unsub = onSnapshot(journalCol, snapshot => {
            setJournal(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return () => unsub();
    }, [journalCol]);

    const addJournalEntry = useCallback(async (entry) => {
        if (journalCol) await addDoc(journalCol, entry);
    }, [journalCol]);

    const updateJournalEntry = useCallback(async (id, entry) => {
        if (journalCol) await updateDoc(doc(journalCol, id), entry);
    }, [journalCol]);

    const deleteJournalEntry = useCallback(async (id) => {
        if (journalCol) await deleteDoc(doc(journalCol, id));
    }, [journalCol]);

    return { journal, addJournalEntry, updateJournalEntry, deleteJournalEntry };
};