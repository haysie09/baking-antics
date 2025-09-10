import React from 'react';
import Modal from './Modal';

const ViewUpcomingBakeModal = ({ bake, onEdit, onClose }) => {
    if (!bake) return null;

    const safeGetDate = (entryDate) => {
        if (!entryDate) return '';
        const date = new Date(entryDate.toDate ? entryDate.toDate() : entryDate);
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <Modal onClose={onClose} size="md">
            {/* UPDATED: Main container with new font and styling */}
            <div className="space-y-4 font-sans text-[#1b0d10]">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold">{bake.bakeName}</h2>
                        <p className="text-sm text-gray-500 mt-1">{safeGetDate(bake.bakeDate)}</p>
                    </div>
                    <button onClick={onEdit} title="Edit Upcoming Bake" className="text-gray-500 hover:text-[#f0425f]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
                        </svg>
                    </button>
                </div>

                {bake.notes && (
                    <div className="pt-2">
                        <label className="block font-semibold text-gray-700 mb-1 text-base">Notes</label>
                        <p className="w-full p-3 bg-gray-50 rounded-lg text-sm text-gray-800">{bake.notes}</p>
                    </div>
                )}
                 
                <div className="flex justify-center pt-4">
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