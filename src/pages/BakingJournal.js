import React, { useState, useMemo, useEffect } from 'react';
import JournalEntryForm from './JournalEntryForm';
import ConfirmationModal from '../components/ConfirmationModal';
import StarRating from '../components/StarRating';
import FilterComponent from '../components/FilterComponent';

const journalCategories = ["Bread", "Cake", "Cupcake", "Cookie", "No-Bake", "Cheesecake", "Pastry", "Slice", "Tart"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const BakingJournal = ({ journal, addJournalEntry, updateJournalEntry, deleteJournalEntry, cookbook, dateFilter, setDateFilter }) => {
    const [editingEntry, setEditingEntry] = useState(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(null);
    const [expandedJournalId, setExpandedJournalId] = useState(null);
    const [activeFilters, setActiveFilters] = useState({
        categories: [],
        month: 'all',
        year: 'all'
    });
    
    // --- NEW: State to manage which months are expanded ---
    const [expandedMonths, setExpandedMonths] = useState({});

    const handleSave = async (entryData) => {
        if (isCreatingNew) await addJournalEntry({ ...entryData, createdAt: new Date() });
        else await updateJournalEntry(editingEntry.id, entryData);
        setEditingEntry(null); setIsCreatingNew(false);
    };

    const handleFilterChange = (filters) => {
        setActiveFilters(filters);
    };

    const filteredJournal = useMemo(() => {
        let entries = journal || [];
        if (dateFilter) {
            return entries.filter(entry => entry.bakingDate === dateFilter);
        }
        if (activeFilters.categories.length > 0) {
            entries = entries.filter(entry => 
                activeFilters.categories.every(filterCat => entry.categories?.includes(filterCat))
            );
        }
        if (activeFilters.month !== 'all') {
            entries = entries.filter(entry => new Date(entry.bakingDate).getMonth() === parseInt(activeFilters.month));
        }
        if (activeFilters.year !== 'all') {
            entries = entries.filter(entry => new Date(entry.bakingDate).getFullYear() === parseInt(activeFilters.year));
        }
        return entries;
    }, [journal, activeFilters, dateFilter]);

    // --- NEW: Group the filtered journal entries by year and month ---
    const groupedJournal = useMemo(() => {
        const groups = {};
        [...filteredJournal].sort((a, b) => new Date(b.bakingDate) - new Date(a.bakingDate))
            .forEach(entry => {
                const date = new Date(entry.bakingDate);
                const year = date.getFullYear();
                const month = date.getMonth();
                if (!groups[year]) {
                    groups[year] = {};
                }
                if (!groups[year][month]) {
                    groups[year][month] = [];
                }
                groups[year][month].push(entry);
            });
        return groups;
    }, [filteredJournal]);

    // --- NEW: Handler to toggle month visibility ---
    const toggleMonth = (year, month) => {
        const key = `${year}-${month}`;
        setExpandedMonths(prev => ({ ...prev, [key]: !prev[key] }));
    };

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

            <FilterComponent 
                categories={journalCategories}
                onFilterChange={handleFilterChange}
            />

            <div className="space-y-4 mt-6">
                {Object.keys(groupedJournal).length === 0 ? (
                    <div className="text-center py-16 bg-info-box rounded-xl border border-burnt-orange">
                        <p className="text-app-grey text-2xl">{journal && journal.length > 0 ? "No entries match filters" : "Start your Baking Journal"}</p>
                    </div>
                ) : (
                    Object.keys(groupedJournal).sort((a, b) => b - a).map(year => (
                        <div key={year}>
                            <h2 className="text-2xl font-bold text-add-idea mb-2">{year}</h2>
                            {Object.keys(groupedJournal[year]).sort((a, b) => b - a).map(month => {
                                const monthKey = `${year}-${month}`;
                                const isMonthExpanded = expandedMonths[monthKey];
                                return (
                                    <div key={monthKey} className="mb-4">
                                        <button onClick={() => toggleMonth(year, month)} className="w-full flex justify-between items-center bg-info-box p-3 rounded-xl border border-burnt-orange">
                                            <h3 className="text-xl font-semibold text-app-grey font-montserrat">{monthNames[month]}</h3>
                                            <span className={`transform transition-transform text-burnt-orange ${isMonthExpanded ? 'rotate-180' : ''}`}>▼</span>
                                        </button>
                                        {isMonthExpanded && (
                                            <div className="space-y-4 mt-2">
                                                {groupedJournal[year][month].map(entry => (
                                                    <div key={entry.id} className="bg-info-box p-4 rounded-xl border border-burnt-orange ml-4">
                                                        <div className="flex justify-between items-start cursor-pointer" onClick={() => setExpandedJournalId(expandedJournalId === entry.id ? null : entry.id)}>
                                                            <div>
                                                                <h3 className="text-2xl font-bold text-burnt-orange">{entry.entryTitle}</h3>
                                                                <p className="text-base text-app-grey/80 font-montserrat">{new Date(entry.bakingDate).toLocaleDateString('en-GB')}</p>
                                                            </div>
                                                            <span className={`transform transition-transform text-burnt-orange ${expandedJournalId === entry.id ? 'rotate-180' : ''}`}>▼</span>
                                                        </div>
                                                        {expandedJournalId === entry.id && (
                                                            <div className="mt-4 pt-4 border-t border-burnt-orange/20">
                                                                {/* ... existing expanded entry details ... */}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    ))
                )}
            </div>
            {(editingEntry || isCreatingNew) && <JournalEntryForm entry={editingEntry} cookbook={cookbook} isNew={isCreatingNew} onSave={handleSave} onCancel={() => { setEditingEntry(null); setIsCreatingNew(false); }} />}
            {showConfirmModal && <ConfirmationModal message="Delete this entry?" onConfirm={() => { deleteJournalEntry(showConfirmModal); setShowConfirmModal(null); }} onCancel={() => setShowConfirmModal(null)} />}
        </div>
    );
};

export default BakingJournal;
