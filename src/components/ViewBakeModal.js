import React from 'react';
import Modal from './Modal';
import StarRating from './StarRating';

// The component now accepts an `upcomingBake` prop
const ViewBakeModal = ({ bake, upcomingBake, onEdit, onClose }) => {
    if (!bake) return null;

    return (
        <Modal onClose={onClose} size="md">
            <div className="space-y-4 text-xl font-patrick-hand">
                {/* --- Past Bake Section (Existing) --- */}
                <div className="flex justify-between items-start">
                    <h2 className="text-4xl font-bold text-burnt-orange">{bake.entryTitle}</h2>
                    <button onClick={() => onEdit(bake)} title="Edit Entry" className="text-burnt-orange hover:opacity-70">
                        <svg xmlns="http://www.w.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
                        </svg>
                    </button>
                </div>
                <p className="font-montserrat text-base text-app-grey/80 -mt-2">
                    {new Date(bake.bakingDate).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <div className="flex justify-between items-center py-1">
                    <label className="text-app-grey font-semibold">Taste</label>
                    <StarRating rating={bake.tasteRating} isEditable={false} />
                </div>
                <div className="flex justify-between items-center py-1">
                    <label className="text-app-grey font-semibold">Difficulty</label>
                    <StarRating rating={bake.difficultyRating} isEditable={false} />
                </div>
                {bake.categories && bake.categories.length > 0 && (
                    <div>
                        <label className="block text-app-grey font-semibold mb-1">Categories</label>
                        <div className="flex flex-wrap gap-2">
                            {bake.categories.map(c => <span key={c} className="py-1 px-3 rounded-full text-sm bg-app-white border border-gray-200 text-app-grey font-montserrat">{c}</span>)}
                        </div>
                    </div>
                )}
                {bake.personalNotes && (
                    <div>
                        <label className="block text-app-grey font-semibold mb-1">Personal Notes</label>
                        <p className="w-full p-3 bg-gray-50 rounded-lg text-lg font-montserrat">{bake.personalNotes}</p>
                    </div>
                )}
                {bake.sourceURL && (
                     <div>
                        <label className="block text-app-grey font-semibold mb-1">Recipe Link</label>
                        <a href={bake.sourceURL} target="_blank" rel="noopener noreferrer" className="text-burnt-orange hover:underline break-all font-montserrat text-lg">
                            View original recipe
                        </a>
                    </div>
                )}

                {/* --- NEW: Upcoming Bake Section --- */}
                {upcomingBake && (
                    <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-300">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-app-grey font-semibold">Also planned for this day:</p>
                                <h3 className="text-2xl font-bold text-add-idea">{upcomingBake.title}</h3>
                            </div>
                            <button onClick={() => onEdit(upcomingBake, true)} title="Edit Upcoming Bake" className="text-add-idea hover:opacity-70">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ViewBakeModal;
