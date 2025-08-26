import React, { useState, useMemo } from 'react';
import ConfirmationModal from '../components/ConfirmationModal';
import IdeaForm from './IdeaForm';
import FilterComponent from '../components/FilterComponent';

const journalCategories = ["Bread", "Cake", "Cupcake", "Cookie", "No-Bake", "Cheesecake", "Pastry", "Slice", "Tart"];

const IdeaPad = ({ ideas, addIdea, deleteIdea, addJournalEntry }) => {
    const [showConfirmModal, setShowConfirmModal] = useState(null);
    const [showMoveConfirm, setShowMoveConfirm] = useState(false);
    const [isAddIdeaModalOpen, setIsAddIdeaModalOpen] = useState(false);
    const [showAddConfirm, setShowAddConfirm] = useState(false);

    const [activeFilters, setActiveFilters] = useState({
        categories: [],
        month: 'all',
        year: 'all'
    });

    const handleAddIdea = async (ideaData) => {
        await addIdea({ ...ideaData, createdAt: new Date() });
        setIsAddIdeaModalOpen(false);
        setShowAddConfirm(true);
        setTimeout(() => setShowAddConfirm(false), 3000);
    };

    const moveToJournal = async (idea) => {
        const newEntry = {
            entryTitle: idea.ideaName,
            bakingDate: new Date().toISOString().split('T')[0],
            tasteRating: 0, difficultyRating: 0,
            personalNotes: idea.notes || '',
            photoURLs: [], categories: idea.categories || [],
            sourceURL: idea.sourceURL || '',
            createdAt: new Date(),
        };
        await addJournalEntry(newEntry);
        await deleteIdea(idea.id);
        setShowMoveConfirm(true);
        setTimeout(() => setShowMoveConfirm(false), 3000);
    };

    const handleFilterChange = (filters) => {
        setActiveFilters(filters);
    };

    const filteredIdeas = useMemo(() => {
        let currentFilteredIdeas = ideas || [];
        if (activeFilters.categories.length > 0) {
            currentFilteredIdeas = currentFilteredIdeas.filter(idea =>
                activeFilters.categories.every(filterCat => idea.categories?.includes(filterCat))
            );
        }
        if (activeFilters.month !== 'all') {
            currentFilteredIdeas = currentFilteredIdeas.filter(idea =>
                idea.createdAt && new Date(idea.createdAt.toDate()).getMonth() === parseInt(activeFilters.month)
            );
        }
        if (activeFilters.year !== 'all') {
            currentFilteredIdeas = currentFilteredIdeas.filter(idea =>
                idea.createdAt && new Date(idea.createdAt.toDate()).getFullYear() === parseInt(activeFilters.year)
            );
        }
        return currentFilteredIdeas;
    }, [ideas, activeFilters]);

    return (
        <div className="p-4 md:p-6 bg-app-white h-full font-patrick-hand">
            
            {/* UPDATED: Header section to center title */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-burnt-orange">Idea Pad</h1>
                <button 
                    onClick={() => setIsAddIdeaModalOpen(true)} 
                    className="bg-burnt-orange text-white p-2 rounded-xl hover:opacity-90 transition-opacity"
                    aria-label="Add new idea"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>

            {isAddIdeaModalOpen && <IdeaForm onSave={handleAddIdea} onCancel={() => setIsAddIdeaModalOpen(false)} />}
            {showAddConfirm && <div className="text-center bg-confirm-bg border border-confirm-text text-confirm-text px-4 py-2 rounded-xl text-base mb-4" role="alert"><span className="font-montserrat">New idea added!</span></div>}

            <FilterComponent
                categories={journalCategories}
                onFilterChange={handleFilterChange}
            />

            {showMoveConfirm && <div className="text-center bg-confirm-bg border border-confirm-text text-confirm-text px-4 py-2 rounded-xl text-base mb-4" role="alert"><span className="font-montserrat">Idea added to your journal!</span></div>}

            <div className="space-y-3 mt-6 max-h-96 overflow-y-auto p-1">
                {filteredIdeas.length === 0 ? <p className="text-center text-app-grey py-8 text-2xl">{ideas && ideas.length > 0 ? "No ideas match filters" : "Add Baking Notes & Ideas"}</p> : [...filteredIdeas].sort((a, b) => (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0)).map(idea => (
                    <div key={idea.id} className="bg-info-box p-3 rounded-xl border border-burnt-orange">
                        <div className="flex items-center justify-between">
                            <span className="text-burnt-orange text-xl font-semibold">{idea.ideaName}</span>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => moveToJournal(idea)} className="text-burnt-orange hover:opacity-70" title="Move to Journal"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" /></svg></button>
                                <button onClick={() => setShowConfirmModal(idea.id)} className="text-burnt-orange hover:opacity-70" title="Delete Idea"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                            </div>
                        </div>
                        {idea.notes && <p className="text-app-grey/80 mt-1 text-base font-montserrat">{idea.notes}</p>}
                        {idea.sourceURL && <a href={idea.sourceURL} target="_blank" rel="noopener noreferrer" className="text-burnt-orange hover:underline text-lg"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg></a>}
                    </div>
                ))}
            </div>
            {showConfirmModal && <ConfirmationModal message="Delete this idea?" onConfirm={() => { deleteIdea(showConfirmModal); setShowConfirmModal(null); }} onCancel={() => setShowConfirmModal(null)} />}
        </div>
    );
};

export default IdeaPad;