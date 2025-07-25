import React, { useState, useMemo, useEffect } from 'react';
import JournalEntryForm from './JournalEntryForm';
import ConfirmationModal from '../components/ConfirmationModal';
import StarRating from '../components/StarRating';
import FilterComponent from '../components/FilterComponent'; // 1. Import the new filter component

// This constant will be moved to a central config file later
const journalCategories = ["Bread", "Cake", "Cupcake", "Cookie", "No-Bake", "Cheesecake", "Pastry", "Slice", "Tart"];

const BakingJournal = ({ journal, addJournalEntry, updateJournalEntry, deleteJournalEntry, cookbook, dateFilter, setDateFilter }) => {
    const [editingEntry, setEditingEntry] = useState(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(null);
    const [expandedJournalId, setExpandedJournalId] = useState(null);
    
    // 2. New state to hold all active filters
    const [activeFilters, setActiveFilters] = useState({
        categories: [],
        month: 'all',
        year: 'all'
    });

    const handleSave = async (entryData) => {
        if (isCreatingNew) await addJournalEntry({ ...entryData, createdAt: new Date() });
        else await updateJournalEntry(editingEntry.id, entryData);
        setEditingEntry(null); setIsCreatingNew(false);
    };

    // 3. Handler to receive filter changes from the new component
    const handleFilterChange = (filters) => {
        setActiveFilters(filters);
    };

    // 4. `useMemo` is updated with the new advanced filtering logic
    const filteredJournal = useMemo(() => {
        let entries = journal || [];

        // Apply date filter from calendar first, if it exists
        if (dateFilter) {
            return entries.filter(entry => entry.bakingDate === dateFilter);
        }

        // Apply category filter
        if (activeFilters.categories.length > 0) {
            entries = entries.filter(entry => 
                activeFilters.categories.every(filterCat => entry.categories?.includes(filterCat))
            );
        }

        // Apply month filter
        if (activeFilters.month !== 'all') {
            entries = entries.filter(entry => new Date(entry.bakingDate).getMonth() === parseInt(activeFilters.month));
        }

        // Apply year filter
        if (activeFilters.year !== 'all') {
            entries = entries.filter(entry => new Date(entry.bakingDate).getFullYear() === parseInt(activeFilters.year));
        }

        return entries;
    }, [journal, activeFilters, dateFilter]);

    useEffect(() => {
        return () => {
            setDateFilter(null);
        }
    }, [setDateFilter]);

    return (
        <div className="p-4 md:p-6 bg-app-white min-h-full font-patrick-hand">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-4xl font-bold text-burnt-orange">Baking Journal</h1>
                <button onClick={() => setIsCreatingNew(true)} className="bg-add-idea text-white py-2 px-4 rounded-xl text-sm font-normal font-montserrat hover:opacity-90 transition-opacity">Add Bake</button>
            </div>

            {/* 5. Old filter UI is replaced with the new component */}
            <FilterComponent 
                categories={journalCategories}
                onFilterChange={handleFilterChange}
            />

            <div className="space-y-4">
                {filteredJournal.length === 0 ? <div className="text-center py-16 bg-info-box rounded-xl border border-burnt-orange"><p className="text-app-grey text-2xl">{journal && journal.length > 0 ? "No entries match filters" : "Start your Baking Journal"}</p></div> : [...filteredJournal].sort((a, b) => new Date(b.bakingDate) - new Date(a.bakingDate)).map(entry => (
                    <div key={entry.id} className="bg-info-box p-4 rounded-xl border border-burnt-orange">
                        <div className="flex justify-between items-start cursor-pointer" onClick={() => setExpandedJournalId(expandedJournalId === entry.id ? null : entry.id)}>
                            <div>
                                <h3 className="text-2xl font-bold text-burnt-orange">{entry.entryTitle}</h3>
                                <p className="text-base text-app-grey/80 font-montserrat">{new Date(entry.bakingDate).toLocaleDateString('en-GB')}</p>
                            </div>
                            <span className={`transform transition-transform text-burnt-orange ${expandedJournalId === entry.id ? 'rotate-180' : ''}`}>▼</span>
                        </div>
                        {expandedJournalId === entry.id && (
                            <div className="mt-4 pt-4 border-t border-burnt-orange/20">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-lg"><div><span className="font-semibold text-app-grey mr-2">Taste:</span><StarRating rating={entry.tasteRating} isEditable={false} /></div><div><span className="font-semibold text-app-grey mr-2">Difficulty:</span><StarRating rating={entry.difficultyRating} isEditable={false} /></div></div>
                                    <div className="flex space-x-2 text-burnt-orange">
                                        {entry.sourceURL && <a href={entry.sourceURL} target="_blank" rel="noopener noreferrer" className="hover:opacity-70"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0-0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg></a>}
                                        <button onClick={(e) => { e.stopPropagation(); setEditingEntry(entry) }} className="hover:opacity-70"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0-0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg></button>
                                        <button onClick={(e) => { e.stopPropagation(); setShowConfirmModal(entry.id) }} className="hover:opacity-70"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0-0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                    </div>
                                </div>
                                {entry.categories && entry.categories.length > 0 && <div className="mt-2 flex flex-wrap gap-2">{entry.categories.map(c => <span key={c} className="py-1 px-3 rounded-full text-sm bg-app-white border border-gray-200 text-app-grey font-montserrat">{c}</span>)}</div>}
                                {entry.personalNotes && <p className="mt-4 text-app-grey bg-app-white p-3 rounded-lg text-lg font-montserrat">{entry.personalNotes}</p>}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {(editingEntry || isCreatingNew) && <JournalEntryForm entry={editingEntry} cookbook={cookbook} isNew={isCreatingNew} onSave={handleSave} onCancel={() => { setEditingEntry(null); setIsCreatingNew(false); }} />}
            {showConfirmModal && <ConfirmationModal message="Delete this entry?" onConfirm={() => { deleteJournalEntry(showConfirmModal); setShowConfirmModal(null); }} onCancel={() => setShowConfirmModal(null)} />}
        </div>
    );
};

export default BakingJournal;
