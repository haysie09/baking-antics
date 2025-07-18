import React, { useState } from 'react';
import UpcomingBakeForm from './UpcomingBakeForm';
import ConfirmationModal from '../components/ConfirmationModal';

// Helper function to calculate the days until the bake date
const calculateDaysUntil = (bakeDateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bakeDate = new Date(bakeDateStr);
    // Adjust for timezone by getting the date parts and creating a UTC date
    const utcBakeDate = new Date(Date.UTC(bakeDate.getFullYear(), bakeDate.getMonth(), bakeDate.getDate()));
    const diffTime = utcBakeDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: "Overdue", count: diffDays };
    if (diffDays === 0) return { text: "Today", count: diffDays };
    if (diffDays === 1) return { text: "Tomorrow", count: diffDays };
    return { text: `in ${diffDays} days`, count: diffDays };
};


const UpcomingBakes = ({ upcomingBakes, addUpcomingBake, updateUpcomingBake, deleteUpcomingBake, addJournalEntry }) => {
    // --- STATE FOR MODALS ---
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [bakeToEdit, setBakeToEdit] = useState(null); // Holds the bake object for editing
    const [bakeToDelete, setBakeToDelete] = useState(null); // Holds the bake ID for deletion confirmation

    const [expandedId, setExpandedId] = useState(null);

    // --- HANDLER FUNCTIONS ---
    const handleSaveNewBake = async (bakeData) => {
        await addUpcomingBake(bakeData);
        setIsAddFormOpen(false);
    };

    const handleUpdateBake = async (bakeData) => {
        if (bakeToEdit) {
            await updateUpcomingBake(bakeToEdit.id, bakeData);
        }
        setBakeToEdit(null);
    };

    const handleConfirmDelete = async () => {
        if (bakeToDelete) {
            await deleteUpcomingBake(bakeToDelete.id);
        }
        setBakeToDelete(null);
    };
    
    const handleMoveToJournal = async (bake) => {
        const newJournalEntry = {
            entryTitle: bake.title,
            bakingDate: new Date().toISOString().split('T')[0], // Set to today
            sourceURL: bake.link || '',
            personalNotes: bake.notes || '',
            tasteRating: 0,
            difficultyRating: 0,
            categories: [],
            photoURLs: [],
            createdAt: new Date(),
        };
        await addJournalEntry(newJournalEntry);
        await deleteUpcomingBake(bake.id);
        // Optionally, add a success notification here
    };

    const handleToggleExpand = (bakeId) => {
        setExpandedId(prevId => (prevId === bakeId ? null : bakeId));
    };

    const sortedBakes = [...upcomingBakes].sort((a, b) => new Date(a.bakeDate) - new Date(b.bakeDate));

    return (
        <div className="bg-info-box p-4 rounded-2xl border border-burnt-orange">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-burnt-orange">Upcoming Bakes</h3>
                <button onClick={() => setIsAddFormOpen(true)} className="text-add-idea" title="Add Upcoming Bake">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
            </div>
            <div className="space-y-3">
                {sortedBakes && sortedBakes.length > 0 ? (
                    sortedBakes.map(bake => {
                        const countdown = calculateDaysUntil(bake.bakeDate);
                        const isExpanded = expandedId === bake.id;

                        return (
                            <div key={bake.id} className="p-3 bg-app-white rounded-lg shadow-sm">
                                <div className="flex justify-between items-center cursor-pointer" onClick={() => handleToggleExpand(bake.id)}>
                                    <p className="text-app-grey text-xl">{bake.title}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="font-montserrat text-lg text-burnt-orange font-bold text-right">{countdown.text}</span>
                                        <svg className={`w-5 h-5 text-burnt-orange transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                                
                                {isExpanded && (
                                    <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                                        <div className="font-montserrat text-base text-app-grey">
                                            {bake.notes && <p>{bake.notes}</p>}
                                            {bake.link && <a href={bake.link} target="_blank" rel="noopener noreferrer" className="text-burnt-orange hover:underline break-all">View Recipe Link</a>}
                                            {!bake.notes && !bake.link && <p className="italic">No details added.</p>}
                                        </div>
                                        {/* --- ACTION BUTTONS --- */}
                                        <div className="flex items-center justify-end space-x-3 pt-2 text-burnt-orange">
                                            {countdown.count <= 0 ? (
                                                // --- Past-Due Actions ---
                                                <>
                                                    <button onClick={() => handleMoveToJournal(bake)} title="Add to Journal" className="hover:opacity-70"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg></button>
                                                    <button onClick={() => setBakeToDelete(bake)} title="Delete" className="hover:opacity-70"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                                                    <button onClick={() => setBakeToEdit(bake)} title="Reschedule" className="hover:opacity-70"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg></button>
                                                </>
                                            ) : (
                                                // --- Standard Actions ---
                                                <>
                                                    <button onClick={() => setBakeToEdit(bake)} title="Edit" className="hover:opacity-70"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg></button>
                                                    <button onClick={() => setBakeToDelete(bake)} title="Delete" className="hover:opacity-70"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })
                ) : (
                    <p className="text-center text-app-grey/70 py-4">No upcoming bakes scheduled.</p>
                )}
            </div>

            {/* --- MODALS --- */}
            {isAddFormOpen && (
                <UpcomingBakeForm 
                    onSave={handleSaveNewBake}
                    onCancel={() => setIsAddFormOpen(false)}
                />
            )}
            {bakeToEdit && (
                <UpcomingBakeForm 
                    bakeToEdit={bakeToEdit}
                    onSave={handleUpdateBake}
                    onCancel={() => setBakeToEdit(null)}
                />
            )}
            {bakeToDelete && (
                <ConfirmationModal 
                    message="Are you sure you want to delete this upcoming bake?"
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setBakeToDelete(null)}
                />
            )}
        </div>
    );
};

export default UpcomingBakes;
