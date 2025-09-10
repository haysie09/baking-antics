import React from 'react';
import Modal from './Modal';

const ViewUpcomingBakeModal = ({ bake, onEdit, onClose, onDelete, onMoveToJournal, onViewRecipe }) => {
    if (!bake) return null;

    const safeGetDate = (entryDate) => {
        if (!entryDate) return '';
        const date = new Date(entryDate.toDate ? entryDate.toDate() : entryDate);
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    const bakeDate = new Date(bake.bakeDate.toDate ? bake.bakeDate.toDate() : bake.bakeDate);
    bakeDate.setHours(0,0,0,0);
    const today = new Date();
    today.setHours(0,0,0,0);
    const isPastOrToday = bakeDate <= today;

    return (
        <Modal onClose={onClose} size="md">
            <div className="space-y-4 font-sans text-[#1b0d10]">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold">{bake.bakeName}</h2>
                        <p className="text-sm text-gray-500 mt-1">{safeGetDate(bake.bakeDate)}</p>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-500">
                        {bake.link && (
                            <a href={bake.link} target="_blank" rel="noopener noreferrer" title="View Source URL" className="hover:text-[#f0425f]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                            </a>
                        )}
                        {!isPastOrToday && (
                             <button onClick={onEdit} title="Edit Upcoming Bake" className="hover:text-[#f0425f]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
                            </button>
                        )}
                        {isPastOrToday && (
                             <button onClick={onMoveToJournal} title="Move to Journal" className="hover:text-[#f0425f]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </button>
                        )}
                        <button onClick={onDelete} title="Delete Bake" className="hover:text-[#f0425f]">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                </div>

                {bake.notes && (
                    <div className="pt-2">
                        <label className="block font-semibold text-gray-700 mb-1 text-base">Notes</label>
                        <p className="w-full p-3 bg-gray-50 rounded-lg text-sm text-gray-800">{bake.notes}</p>
                    </div>
                )}
                 
                <div className="flex justify-between items-center pt-4">
                    <div>
                        {bake.recipeId && (
                            <button onClick={onViewRecipe} className="h-12 px-6 rounded-full bg-pink-100 text-[#1b0d10] font-bold hover:bg-pink-200 text-sm">
                                View Recipe
                            </button>
                        )}
                    </div>
                    <button 
                        onClick={onClose} 
                        className="h-12 px-8 rounded-full bg-gray-100 text-gray-700 font-bold hover:bg-gray-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ViewUpcomingBakeModal;