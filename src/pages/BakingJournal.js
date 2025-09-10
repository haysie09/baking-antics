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
    
    const [expandedMonths, setExpandedMonths] = useState({});

    const handleSave = async (entryData) => { if (isCreatingNew) await addJournalEntry({ ...entryData, createdAt: new Date() }); else await updateJournalEntry(editingEntry.id, entryData); setEditingEntry(null); setIsCreatingNew(false); };
    const handleFilterChange = (filters) => { setActiveFilters(filters); };
    const toggleMonth = (year, month) => { const key = `${year}-${month}`; setExpandedMonths(prev => ({ ...prev, [key]: !prev[key] })); };
    
    useEffect(() => { return () => { setDateFilter(null); } }, [setDateFilter]);

    const safeGetDate = (entryDate) => {
        return new Date(entryDate.toDate ? entryDate.toDate() : entryDate);
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
        // FIX: Used safeGetDate to handle Firestore Timestamps
        if (activeFilters.month !== 'all') {
            entries = entries.filter(entry => safeGetDate(entry.bakingDate).getMonth() === parseInt(activeFilters.month));
        }
        if (activeFilters.year !== 'all') {
            entries = entries.filter(entry => safeGetDate(entry.bakingDate).getFullYear() === parseInt(activeFilters.year));
        }
        return entries;
    }, [journal, activeFilters, dateFilter]);

    const groupedJournal = useMemo(() => {
        const groups = {};
        // FIX: Used safeGetDate to handle Firestore Timestamps
        [...filteredJournal].sort((a, b) => safeGetDate(b.bakingDate) - safeGetDate(a.bakingDate))
            .forEach(entry => {
                const date = safeGetDate(entry.bakingDate);
                const year = date.getFullYear();
                const month = date.getMonth();
                if (!groups[year]) groups[year] = {};
                if (!groups[year][month]) groups[year][month] = [];
                groups[year][month].push(entry);
            });
        return groups;
    }, [filteredJournal]);

    return (
        <div className="p-4 bg-[#fcf8f9] min-h-full font-sans">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-[#1b0d10]">Journal</h1>
                <button 
                    onClick={() => setIsCreatingNew(true)} 
                    className="bg-[#f0425f] text-white p-2 rounded-xl hover:opacity-90 transition-opacity"
                    aria-label="Add new bake"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>

            <FilterComponent 
                categories={journalCategories}
                onFilterChange={handleFilterChange}
            />

            <div className="space-y-4 mt-6">
                {Object.keys(groupedJournal).length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-pink-100 shadow-sm">
                        <p className="text-gray-500">{journal && journal.length > 0 ? "No entries match filters" : "Start your Baking Journal"}</p>
                    </div>
                ) : (
                    Object.keys(groupedJournal).sort((a, b) => b - a).map(year => (
                        <div key={year}>
                            <h2 className="text-2xl font-bold text-[#1b0d10] mb-2">{year}</h2>
                            {Object.keys(groupedJournal[year]).sort((a, b) => b - a).map(month => {
                                const monthKey = `${year}-${month}`;
                                const isMonthExpanded = expandedMonths[monthKey];
                                return (
                                    <div key={monthKey} className="mb-4">
                                        <button onClick={() => toggleMonth(year, month)} className="w-full flex justify-between items-center bg-white p-4 rounded-xl border border-pink-100 shadow-sm">
                                            <h3 className="text-lg font-semibold text-[#1b0d10]">{monthNames[month]}</h3>
                                            <span className={`transform transition-transform text-[#f0425f] ${isMonthExpanded ? 'rotate-180' : ''}`}>▼</span>
                                        </button>
                                        {isMonthExpanded && (
                                            <div className="space-y-3 mt-3">
                                                {groupedJournal[year][month].map(entry => (
                                                    <div key={entry.id} className="bg-white p-4 rounded-xl border border-pink-100 shadow-sm ml-4">
                                                        <div className="flex justify-between items-start cursor-pointer" onClick={() => setExpandedJournalId(expandedJournalId === entry.id ? null : entry.id)}>
                                                            <div>
                                                                <h3 className="text-lg font-bold text-[#1b0d10]">{entry.entryTitle}</h3>
                                                                {/* FIX: Used safeGetDate to handle Firestore Timestamps */}
                                                                <p className="text-sm text-gray-500">{safeGetDate(entry.bakingDate).toLocaleDateString('en-GB')}</p>
                                                            </div>
                                                            <span className={`transform transition-transform text-[#f0425f] ${expandedJournalId === entry.id ? 'rotate-180' : ''}`}>▼</span>
                                                        </div>
                                                        {expandedJournalId === entry.id && (
                                                            <div className="mt-4 pt-4 border-t border-pink-100">
                                                                <div className="flex justify-between items-start">
                                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
                                                                        <div><span className="font-semibold text-gray-700 mr-2">Taste:</span><StarRating rating={entry.tasteRating} isEditable={false} /></div>
                                                                        <div><span className="font-semibold text-gray-700 mr-2">Difficulty:</span><StarRating rating={entry.difficultyRating} isEditable={false} /></div>
                                                                    </div>
                                                                    <div className="flex space-x-3 text-[#9a4c59]">
                                                                        {entry.sourceURL && <a href={entry.sourceURL} target="_blank" rel="noopener noreferrer" className="hover:text-[#f0425f]"><svg className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg></a>}
                                                                        <button onClick={(e) => { e.stopPropagation(); setEditingEntry(entry) }} className="hover:text-[#f0425f]"><svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg></button>
                                                                        <button onClick={(e) => { e.stopPropagation(); setShowConfirmModal(entry.id) }} className="hover:text-[#f0425f]"><svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg></button>
                                                                    </div>
                                                                </div>
                                                                {entry.categories && entry.categories.length > 0 && <div className="mt-2 flex flex-wrap gap-2">{entry.categories.map(c => <span key={c} className="py-1 px-3 rounded-full text-xs bg-white border border-gray-200 text-gray-600">{c}</span>)}</div>}
                                                                {entry.personalNotes && <p className="mt-4 text-gray-700 bg-gray-50 p-3 rounded-lg text-sm">{entry.personalNotes}</p>}
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