import React from 'react';

const ViewUpcomingBakeModal = ({ bake, onEdit, onClose }) => {
    if (!bake) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 font-patrick-hand">
            <div className="bg-app-white rounded-2xl p-8 w-full max-w-sm shadow-xl">
                <div className="flex justify-between items-start">
                    <div className="text-center w-full">
                        <p className="text-app-grey text-2xl">
                            You plan to make a <span className="font-bold text-burnt-orange">{bake.title}</span>.
                        </p>
                    </div>
                    {/* --- BUTTON UPDATED TO PENCIL ICON --- */}
                    <button onClick={onEdit} title="Edit Upcoming Bake" className="text-add-idea hover:opacity-70 -mt-2 -mr-2 p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
                        </svg>
                    </button>
                </div>
                <div className="flex justify-center pt-6">
                     <button 
                        onClick={onClose} 
                        className="bg-gray-100 text-app-grey py-3 px-8 rounded-xl hover:bg-gray-200 transition-colors text-xl font-montserrat"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewUpcomingBakeModal;
