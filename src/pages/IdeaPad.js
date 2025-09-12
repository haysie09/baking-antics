import React, { useState, useMemo } from 'react';
import ConfirmationModal from '../components/ConfirmationModal';
import IdeaForm from './IdeaForm';
import IdeaFilterBar from '../components/IdeaFilterBar'; // <-- IMPORT the new filter

const journalCategories = ["Bread", "Cake", "Cupcake", "Cookie", "No-Bake", "Cheesecake", "Pastry", "Slice", "Tart"];

const IdeaPad = ({ ideas, addIdea, deleteIdea, onScheduleBake }) => {
    const [showConfirmModal, setShowConfirmModal] = useState(null);
    const [isAddIdeaModalOpen, setIsAddIdeaModalOpen] = useState(false);
    const [showAddConfirm, setShowAddConfirm] = useState(false);
    
    // --- STATE SIMPLIFIED ---
    const [activeCategory, setActiveCategory] = useState('All');

    const handleAddIdea = async (ideaData) => {
        await addIdea({ ...ideaData, createdAt: new Date() });
        setIsAddIdeaModalOpen(false);
        setShowAddConfirm(true);
        setTimeout(() => setShowAddConfirm(false), 3000);
    };

    const filteredIdeas = useMemo(() => {
        let currentFilteredIdeas = ideas || [];
        if (activeCategory !== 'All') {
            currentFilteredIdeas = currentFilteredIdeas.filter(idea => idea.categories?.includes(activeCategory));
        }
        return currentFilteredIdeas;
    }, [ideas, activeCategory]);

    return (
        <div className="bg-[var(--background-color)] min-h-full font-sans">
            {/* --- NEW HEADER SECTION --- */}
            <div className="bg-[var(--upcoming-bg)]">
                 <div className="p-4 pb-0 flex justify-between items-center">
                    <div className="w-10"></div> {/* Spacer */}
                    <h1 className="text-3xl font-bold text-white text-center">Idea Pad</h1>
                    <button 
                        onClick={() => setIsAddIdeaModalOpen(true)} 
                        className="bg-white/30 text-white p-2 rounded-full hover:bg-white/40 transition-opacity"
                        aria-label="Add new idea"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
                <div className="py-2">
                    <IdeaFilterBar 
                        categories={journalCategories}
                        activeCategory={activeCategory}
                        onCategorySelect={setActiveCategory}
                    />
                </div>
            </div>

            {/* --- MAIN CONTENT SECTION --- */}
            <div className="p-4 space-y-3 bg-[var(--background-color)] -mt-4 rounded-t-2xl">
                {showAddConfirm && <div className="text-center bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-xl text-base" role="alert">New idea added!</div>}
                
                {filteredIdeas.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl border border-pink-100 shadow-sm">
                        <p className="text-gray-500">{ideas && ideas.length > 0 ? "No ideas match your filter" : "Add your baking ideas here!"}</p>
                    </div>
                ) : (
                    [...filteredIdeas].sort((a, b) => (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0)).map(idea => (
                        <div key={idea.id} className="bg-white p-4 rounded-xl border border-pink-100 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-[var(--text-primary)] text-lg font-semibold">{idea.ideaName}</span>
                                <div className="flex items-center space-x-2 text-[var(--text-secondary)]">
                                    {/* --- UPDATED ACTION BUTTON --- */}
                                    <button onClick={() => onScheduleBake(idea)} className="hover:text-[var(--primary-color)]" title="Schedule this Bake">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" /></svg>
                                    </button>
                                    <button onClick={() => setShowConfirmModal(idea.id)} className="hover:text-[var(--primary-color)]" title="Delete Idea">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    </button>
                                </div>
                            </div>
                            {idea.notes && <p className="text-gray-600 mt-2 text-sm">{idea.notes}</p>}
                            {idea.sourceURL && <a href={idea.sourceURL} target="_blank" rel="noopener noreferrer" className="text-[var(--primary-color)] hover:underline text-sm inline-block mt-1">View Source</a>}
                        </div>
                    ))
                )}
            </div>
            
            {isAddIdeaModalOpen && <IdeaForm onSave={handleAddIdea} onCancel={() => setIsAddIdeaModalOpen(false)} />}
            {showConfirmModal && <ConfirmationModal message="Delete this idea?" onConfirm={() => { deleteIdea(showConfirmModal); setShowConfirmModal(null); }} onCancel={() => setShowConfirmModal(null)} />}
        </div>
    );
};

export default IdeaPad;
