import React from 'react';
import Modal from './Modal';
import StarRating from './StarRating';

const ViewBakeModal = ({ bake, upcomingBake, onEdit, onClose }) => {
    if (!bake && !upcomingBake) return null;

    const safeGetDate = (entryDate) => {
        if (!entryDate) return '';
        const date = new Date(entryDate.toDate ? entryDate.toDate() : entryDate);
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <Modal onClose={onClose} size="md">
            <div className="space-y-4 font-sans text-[#1b0d10]">
                
                {/* Past Bake Section */}
                {bake && (
                    <div>
                        <div className="flex justify-between items-start">
                            <h2 className="text-2xl font-bold">{bake.entryTitle}</h2>
                            <button onClick={() => onEdit(bake, false)} title="Edit Entry" className="text-gray-500 hover:text-[#f0425f]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 -mt-1">{safeGetDate(bake.bakingDate)}</p>
                        
                        <div className="mt-4 space-y-4">
                            <div className="flex justify-between items-center py-1">
                                <label className="font-semibold text-gray-700">Taste</label>
                                <StarRating rating={bake.tasteRating} isEditable={false} />
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <label className="font-semibold text-gray-700">Difficulty</label>
                                <StarRating rating={bake.difficultyRating} isEditable={false} />
                            </div>
                            {bake.categories && bake.categories.length > 0 && (
                                <div>
                                    <label className="block font-semibold text-gray-700 mb-1 text-base">Categories</label>
                                    <div className="flex flex-wrap gap-2">
                                        {bake.categories.map(c => <span key={c} className="py-1 px-3 rounded-full text-xs bg-gray-100 border border-gray-200 text-gray-600">{c}</span>)}
                                    </div>
                                </div>
                            )}
                            {bake.personalNotes && (
                                <div>
                                    <label className="block font-semibold text-gray-700 mb-1 text-base">Personal Notes</label>
                                    <p className="w-full p-3 bg-gray-50 rounded-lg text-sm text-gray-800">{bake.personalNotes}</p>
                                </div>
                            )}
                            {bake.sourceURL && (
                               <div>
                                   <label className="block font-semibold text-gray-700 mb-1 text-base">Recipe Link</label>
                                   <a href={bake.sourceURL} target="_blank" rel="noopener noreferrer" className="text-[#f0425f] hover:underline break-all text-sm">
                                       View original recipe
                                   </a>
                               </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Upcoming Bake Section */}
                {upcomingBake && (
                    <div className={bake ? "mt-6 pt-4 border-t-2 border-dashed border-pink-200" : ""}>
                        <div className="flex justify-between items-start">
                            <div>
                                {bake && <p className="text-sm font-semibold text-gray-500 mb-1">Also planned for this day:</p>}
                                <h3 className="text-2xl font-bold">{upcomingBake.bakeName}</h3>
                                {!bake && <p className="text-sm text-gray-500">{safeGetDate(upcomingBake.bakeDate)}</p>}
                            </div>
                            <button onClick={() => onEdit(upcomingBake, true)} title="Edit Upcoming Bake" className="text-gray-500 hover:text-[#f0425f]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
                            </button>
                        </div>
                         {upcomingBake.notes && (
                            <div className="mt-2">
                                <label className="block font-semibold text-gray-700 mb-1 text-base">Notes</label>
                                <p className="w-full p-3 bg-gray-50 rounded-lg text-sm text-gray-800">{upcomingBake.notes}</p>
                            </div>
                         )}
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ViewBakeModal;