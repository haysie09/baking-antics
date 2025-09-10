import React from 'react';
import Modal from './Modal';
import StarRating from './StarRating';

const ViewBakeModal = ({ bake, upcomingBake, onEdit, onClose }) => {
    // This modal can be opened with only a past bake, only an upcoming bake, or both.
    if (!bake && !upcomingBake) return null;

    const safeGetDate = (entryDate) => {
        if (!entryDate) return '';
        const date = new Date(entryDate.toDate ? entryDate.toDate() : entryDate);
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    // Determine if the upcoming bake is in the past or today
    const isUpcomingPastOrToday = upcomingBake && new Date(upcomingBake.bakeDate.toDate ? upcomingBake.bakeDate.toDate() : upcomingBake.bakeDate) <= new Date();

    return (
        <Modal onClose={onClose} size="md">
            <div className="space-y-4 font-sans text-[#1b0d10]">
                
                {/* Past Bake (Journal Entry) Section */}
                {bake && (
                    <div>
                        <div className="flex justify-between items-start">
                            <h2 className="text-2xl font-bold">{bake.entryTitle}</h2>
                            <button onClick={() => onEdit(bake, false)} title="Edit Journal Entry" className="text-gray-500 hover:text-[#f0425f]">
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
                            {/* You can add more details here if needed */}
                        </div>
                    </div>
                )}

                {/* Upcoming Bake Section */}
                {upcomingBake && (
                    <div className={bake ? "mt-6 pt-4 border-t-2 border-dashed border-pink-200" : ""}>
                        <div className="flex justify-between items-start">
                            <div>
                                {bake && <p className="text-sm font-semibold text-gray-500 mb-1">Also planned for this day:</p>}
                                <h2 className="text-2xl font-bold">{upcomingBake.bakeName}</h2>
                                {!bake && <p className="text-sm text-gray-500 mt-1">{safeGetDate(upcomingBake.bakeDate)}</p>}
                            </div>
                            {/* Only show the edit icon if the bake is in the future */}
                            {!isUpcomingPastOrToday && (
                                <button onClick={() => onEdit(upcomingBake, true)} title="Edit Upcoming Bake" className="text-gray-500 hover:text-[#f0425f]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
                                </button>
                            )}
                        </div>
                         {upcomingBake.notes && (
                            <div className="mt-2">
                                <label className="block font-semibold text-gray-700 mb-1 text-base">Notes</label>
                                <p className="w-full p-3 bg-gray-50 rounded-lg text-sm text-gray-800">{upcomingBake.notes}</p>
                            </div>
                         )}
                    </div>
                )}
                 <div className="flex justify-center pt-4">
                    {isUpcomingPastOrToday ? (
                        <div className="flex justify-center space-x-2">
                             <button onClick={() => onEdit(upcomingBake, true)} className="h-12 px-6 rounded-full bg-gray-100 text-gray-700 font-bold hover:bg-gray-200">Delete</button>
                             <button onClick={onClose} className="h-12 px-6 rounded-full bg-[#f0425f] text-white font-bold hover:opacity-90">Move to Journal</button>
                        </div>
                    ) : (
                        <button onClick={onClose} className="h-12 px-8 rounded-full bg-gray-100 text-gray-700 font-bold hover:bg-gray-200">
                            Close
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ViewBakeModal;