// Filename: src/components/ViewUpcomingBakeModal.js

import React from 'react';
import Modal from './Modal';

// ICONS for buttons
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const JournalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;


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
        <Modal onClose={onClose} size="md" showFooter={false}>
            <div className="space-y-4 font-sans text-[#1b0d10]">
                
                <div className="text-center">
                    <p className="text-lg text-gray-700">You plan to bake...</p>
                    <h2 className="text-3xl font-bold mt-1">{bake.bakeName}</h2>
                    <p className="text-base text-gray-500 pt-1">{safeGetDate(bake.bakeDate)}</p>
                </div>

                {bake.personalNotes && (
                    <div className="pt-2 text-left">
                        <label className="block font-semibold text-gray-700 mb-1 text-base">My Notes</label>
                        <p className="w-full p-3 bg-gray-50 rounded-lg text-sm text-gray-800 whitespace-pre-wrap">{bake.personalNotes}</p>
                    </div>
                )}
                    
                <div className="flex justify-between items-center pt-6">
                    {/* Link and "See Recipe" button on the left */}
                    <div className="flex items-center space-x-4">
                        {bake.link && (
                            <a href={bake.link} target="_blank" rel="noopener noreferrer" title="View Source URL" className="text-gray-500 hover:text-[#f0425f]">
                                <LinkIcon />
                            </a>
                        )}
                        {bake.recipeId && (
                            <button onClick={onViewRecipe} className="h-10 px-5 rounded-full bg-pink-100 text-[#1b0d10] font-bold hover:bg-pink-200 text-sm">
                                See Recipe
                            </button>
                        )}
                    </div>
                    
                    {/* --- CHANGE: Simplified Action Buttons --- */}
                    <div className="flex items-center space-x-2">
                        {isPastOrToday ? (
                            // Show 'Move to Journal' for past or today's bakes
                            <button onClick={onMoveToJournal} title="Move to Journal" className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600">
                                <JournalIcon />
                            </button>
                        ) : (
                            // Show 'Edit' for future bakes
                            <button onClick={onEdit} title="Edit Upcoming Bake" className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                                <EditIcon />
                            </button>
                        )}
                        
                        {/* --- CHANGE: Delete button is now always visible --- */}
                        <button onClick={onDelete} title="Delete Bake" className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600">
                            <DeleteIcon />
                        </button>
                        
                         <button onClick={onClose} className="h-10 px-6 rounded-full bg-gray-800 text-white font-bold hover:bg-black text-sm">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ViewUpcomingBakeModal;