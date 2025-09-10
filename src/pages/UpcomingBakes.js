import React, { useState } from 'react';

// Helper function to calculate days until a bake
const getDaysUntil = (date) => {
    if (!date) return '';
    const bakeDate = new Date(date.toDate ? date.toDate() : date);
    const today = new Date();
    bakeDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = bakeDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today!'; // Added exclamation for emphasis
    if (diffDays === 1) return 'Tomorrow!'; // Added exclamation for emphasis
    return `in ${diffDays} days`;
};

// A new component for individual bake items
const BakeItem = ({ bake, onViewDetails }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-pink-100">
        <div className="flex justify-between items-center mb-2">
            {/* FIX: Added bake.bakeName here and adjusted styling */}
            <p className="text-[#1b0d10] text-lg font-semibold truncate pr-2">{bake.bakeName}</p>
            {/* FIX: Made 'in X days' bigger and bolder */}
            <p className="text-[#f0425f] text-base font-bold flex-shrink-0">{getDaysUntil(bake.bakeDate)}</p>
        </div>
        <div>
            <button 
                onClick={() => onViewDetails(bake)}
                className="text-xs font-bold text-white bg-[#f8a5b3] hover:bg-[#f0425f] py-1 px-3 rounded-full transition-colors"
            >
                View Details
            </button>
        </div>
    </div>
);


const UpcomingBakes = ({ upcomingBakes, openScheduleModal, onViewDetails }) => {
    
    const [isListExpanded, setIsListExpanded] = useState(false);

    const sortedBakes = upcomingBakes && upcomingBakes.length > 0
        ? [...upcomingBakes].sort((a, b) => 
            new Date(a.bakeDate.toDate ? a.bakeDate.toDate() : a.bakeDate) - 
            new Date(b.bakeDate.toDate ? b.bakeDate.toDate() : b.bakeDate)
          )
        : [];

    const displayedBakes = isListExpanded ? sortedBakes : sortedBakes.slice(0, 1);

    return (
        <section>
            <h2 className="text-[#1b0d10] text-2xl font-bold mb-4">What's Next?</h2>
            
            {sortedBakes.length > 0 ? (
                <div className="space-y-3">
                    {displayedBakes.map(bake => (
                        <BakeItem key={bake.id} bake={bake} onViewDetails={onViewDetails} />
                    ))}

                    {sortedBakes.length > 1 && (
                        <div className="text-center pt-2">
                            <button onClick={() => setIsListExpanded(!isListExpanded)} className="text-sm text-[#9a4c59] hover:text-[#f0425f] font-semibold">
                                {isListExpanded ? 'Show less' : `Show all ${sortedBakes.length} scheduled bakes...`}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-pink-200 px-6 py-10 bg-white shadow-sm">
                    <p className="text-[#1b0d10] text-lg font-bold">No upcoming bakes</p>
                    <p className="text-[#9a4c59] text-sm font-normal">Schedule your next bake to see it here.</p>
                    <button 
                        onClick={openScheduleModal}
                        className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-full h-10 px-6 bg-[#f0425f] text-white text-sm font-bold shadow-md hover:bg-opacity-90"
                    >
                        Schedule Bake
                    </button>
                </div>
            )}
        </section>
    );
};

export default UpcomingBakes;