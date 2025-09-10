import React from 'react';

// Helper function to calculate days until a bake
const getDaysUntil = (date) => {
    if (!date) return '';
    // Handle Firestore Timestamp objects or date strings
    const bakeDate = new Date(date.toDate ? date.toDate() : date);
    const today = new Date();
    bakeDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = bakeDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `in ${diffDays} days`;
};

const UpcomingBakes = ({ upcomingBakes, openScheduleModal, onViewDetails }) => {
    
    // Safely sort bakes only if the array exists
    const sortedBakes = upcomingBakes && upcomingBakes.length > 0
        ? [...upcomingBakes].sort((a, b) => 
            // THE FIX: Changed a.date and b.date to a.bakeDate and b.bakeDate
            new Date(a.bakeDate.toDate ? a.bakeDate.toDate() : a.bakeDate) - 
            new Date(b.bakeDate.toDate ? b.bakeDate.toDate() : b.bakeDate)
          )
        : [];

    const nextBake = sortedBakes.length > 0 ? sortedBakes[0] : null;

    return (
        <section>
            <h2 className="text-[#1b0d10] text-2xl font-bold mb-4">What's Next?</h2>
            <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-pink-200 px-6 py-10 bg-white shadow-sm">
                {/* THE FIX: Changed nextBake.date to nextBake.bakeDate */}
                {nextBake && nextBake.bakeDate ? (
                    <>
                        <p className="text-[#f0425f] text-sm font-bold tracking-wide uppercase">Up Next ({getDaysUntil(nextBake.bakeDate)})</p>
                        <p className="text-[#1b0d10] text-xl font-bold text-center">{nextBake.bakeName}</p>
                        {/* THE FIX: Changed nextBake.date to nextBake.bakeDate */}
                        <p className="text-[#9a4c59] text-sm">{new Date(nextBake.bakeDate.toDate ? nextBake.bakeDate.toDate() : nextBake.bakeDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                        
                        <button 
                            onClick={() => onViewDetails(nextBake)}
                            className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-full h-10 px-6 bg-[#f0425f] text-white text-sm font-bold shadow-md hover:bg-opacity-90 mt-2"
                        >
                            View Details
                        </button>
                    </>
                ) : (
                    <>
                        <p className="text-[#1b0d10] text-lg font-bold">No upcoming bakes</p>
                        <p className="text-[#9a4c59] text-sm font-normal">Schedule your next bake to see it here.</p>
                        <button 
                            onClick={openScheduleModal}
                            className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-full h-10 px-6 bg-[#f0425f] text-white text-sm font-bold shadow-md hover:bg-opacity-90"
                        >
                            Schedule Bake
                        </button>
                    </>
                )}
            </div>
        </section>
    );
};

export default UpcomingBakes;