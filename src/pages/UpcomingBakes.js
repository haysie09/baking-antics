import React, { useState } from 'react';
import UpcomingBakeForm from './UpcomingBakeForm';

// --- Helper function to calculate the days until the bake date ---
const calculateDaysUntil = (bakeDateStr) => {
    // Set 'today' to the start of the day to avoid timezone issues
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bakeDate = new Date(bakeDateStr);
    // The date from the input is already a string like "YYYY-MM-DD"
    // We add a day because the input is inclusive of the bake date
    bakeDate.setDate(bakeDate.getDate() + 1);
    bakeDate.setHours(0, 0, 0, 0);

    const diffTime = bakeDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: "Overdue", count: diffDays };
    if (diffDays === 0) return { text: "Today", count: diffDays };
    if (diffDays === 1) return { text: "Tomorrow", count: diffDays };
    return { text: `in ${diffDays} days`, count: diffDays };
};


const UpcomingBakes = ({ upcomingBakes, addUpcomingBake, updateUpcomingBake, deleteUpcomingBake }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    
    // --- New state to track which item is expanded ---
    const [expandedId, setExpandedId] = useState(null);

    const handleSaveBake = async (bakeData) => {
        await addUpcomingBake(bakeData);
        setIsFormOpen(false);
    };

    const handleToggleExpand = (bakeId) => {
        setExpandedId(prevId => (prevId === bakeId ? null : bakeId));
    };

    // --- Sort bakes by the soonest date first ---
    const sortedBakes = [...upcomingBakes].sort((a, b) => new Date(a.bakeDate) - new Date(b.bakeDate));

    return (
        <div className="bg-info-box p-4 rounded-2xl border border-burnt-orange">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-burnt-orange">Upcoming Bakes</h3>
                <button onClick={() => setIsFormOpen(true)} className="text-add-idea" title="Add Upcoming Bake">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
            </div>
            <div className="space-y-3">
                {sortedBakes && sortedBakes.length > 0 ? (
                    sortedBakes.map(bake => {
                        const countdown = calculateDaysUntil(bake.bakeDate);
                        const isExpanded = expandedId === bake.id;

                        return (
                            // --- New, more detailed list item ---
                            <div key={bake.id} className="p-3 bg-app-white rounded-lg shadow-sm">
                                <div className="flex justify-between items-center cursor-pointer" onClick={() => handleToggleExpand(bake.id)}>
                                    <p className="text-app-grey text-xl">{bake.title}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="font-montserrat text-lg text-burnt-orange font-bold text-right">{countdown.text}</span>
                                        <svg className={`w-5 h-5 text-burnt-orange transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                                
                                {/* --- Conditionally rendered details section --- */}
                                {isExpanded && (
                                    <div className="mt-3 pt-3 border-t border-gray-200 space-y-2 font-montserrat text-base text-app-grey">
                                        {bake.notes && <p>{bake.notes}</p>}
                                        {bake.link && (
                                            <a href={bake.link} target="_blank" rel="noopener noreferrer" className="text-burnt-orange hover:underline break-all">
                                                View Recipe Link
                                            </a>
                                        )}
                                        {!bake.notes && !bake.link && <p className="italic">No details added.</p>}
                                    </div>
                                )}
                            </div>
                        )
                    })
                ) : (
                    <p className="text-center text-app-grey/70 py-4">No upcoming bakes scheduled.</p>
                )}
            </div>

            {isFormOpen && (
                <UpcomingBakeForm 
                    onSave={handleSaveBake}
                    onCancel={() => setIsFormOpen(false)}
                />
            )}
        </div>
    );
};

export default UpcomingBakes;