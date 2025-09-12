import React, { useState } from 'react';

const getDaysUntil = (date) => {
    if (!date) return '';
    const bakeDate = new Date(date.toDate ? date.toDate() : date);
    const today = new Date();
    bakeDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = bakeDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today!';
    if (diffDays === 1) return 'Tomorrow!';
    return `in ${diffDays} days`;
};

const BakeItem = ({ bake, onViewDetails }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-pink-100">
        <div className="flex justify-between items-center mb-2">
            <p className="text-text-primary text-lg font-semibold truncate pr-4">{bake.bakeName}</p>
            <p className="text-primary-color text-base font-bold flex-shrink-0">{getDaysUntil(bake.bakeDate)}</p>
        </div>
        <div>
            <button 
                onClick={() => onViewDetails(bake)}
                className="text-xs font-bold text-white bg-[#f8a5b3] hover:bg-primary-color py-1 px-3 rounded-full transition-colors"
            >
                View Details
            </button>
        </div>
    </div>
);


const UpcomingBakes = ({ upcomingBakes, openScheduleModal, onViewDetails }) => {
    
    const [isListExpanded, setIsListExpanded] = useState(false);

    const sortedBakes = upcomingBakes?.length > 0
        ? [...upcomingBakes].sort((a, b) => 
            new Date(a.bakeDate.toDate ? a.bakeDate.toDate() : a.bakeDate) - 
            new Date(b.bakeDate.toDate ? b.bakeDate.toDate() : b.bakeDate)
          )
        : [];

    const displayedBakes = isListExpanded ? sortedBakes : sortedBakes.slice(0, 3);

    return (
        <section className="bg-[var(--upcoming-bg)] p-4 pt-0 pb-8 relative">
            {/* --- HEADER UPDATED --- */}
            <div className="flex justify-between items-start">
                <h2 className="text-white text-2xl font-bold">Upcoming Bakes</h2>
                <img src="/icon-brand.png" alt="Baking Antics Icon" className="w-20 h-20 -mt-6 z-20" />
            </div>
            
            <div className="mt-4">
                {sortedBakes.length > 0 ? (
                    <div className="space-y-3">
                        {displayedBakes.map(bake => (
                            <BakeItem key={bake.id} bake={bake} onViewDetails={onViewDetails} />
                        ))}

                        {sortedBakes.length > 3 && (
                            <div className="text-center pt-2">
                                <button onClick={() => setIsListExpanded(!isListExpanded)} className="text-sm text-white/80 hover:text-white font-semibold">
                                    {isListExpanded ? 'Show less' : `Show all ${sortedBakes.length} scheduled bakes...`}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-pink-200 px-6 py-14 bg-upcoming-card-bg shadow-sm">
                        <p className="text-text-primary text-lg font-bold">No upcoming bakes</p>
                        <p className="text-text-secondary text-sm font-normal">Schedule your next bake to see it here.</p>
                        <button 
                            onClick={openScheduleModal}
                            className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-full h-10 px-6 bg-primary-color text-white text-sm font-bold shadow-md hover:bg-opacity-90 transition-all"
                        >
                            Schedule Bake
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default UpcomingBakes;

