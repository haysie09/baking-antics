import React, { useMemo } from 'react';

const BakingCalendar = ({ 
    journal, 
    upcomingBakes, 
    setView, 
    setDateFilter,
    openAddChoiceModal,
    onViewBake,
    onViewUpcomingBake,
    currentDate,
    setCurrentDate
}) => {

    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    // --- LOGIC FROM YOUR ORIGINAL FILE (PRESERVED) ---

    const bakedDaysMap = useMemo(() => {
        const map = new Map();
        if (journal) {
            journal.forEach(entry => {
                const date = entry.bakingDate.toDate ? entry.bakingDate.toDate() : new Date(entry.bakingDate);
                map.set(date.toDateString(), entry);
            });
        }
        return map;
    }, [journal]);

    const upcomingBakeDaysMap = useMemo(() => {
        const map = new Map();
        if (upcomingBakes) {
            upcomingBakes.forEach(bake => {
                const date = bake.bakeDate.toDate ? bake.bakeDate.toDate() : new Date(bake.bakeDate);
                map.set(date.toDateString(), bake);
            });
        }
        return map;
    }, [upcomingBakes]);

    const handlePrevMonth = () => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
    };

    // THE FIX: This function now has the correct logic
    const handleDayClick = (day) => {
        const fullDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dateString = fullDate.toDateString();
        const pastBake = bakedDaysMap.get(dateString);
        const upcomingBake = upcomingBakeDaysMap.get(dateString);

        if (pastBake && upcomingBake) {
            // If both exist, show the combined modal
            onViewBake({ past: pastBake, upcoming: upcomingBake });
        } else if (pastBake) {
            // If only a past bake exists, navigate to the journal
            setDateFilter(pastBake.bakingDate);
            setView('journal');
        } else if (upcomingBake) {
            // If only an upcoming bake exists, show the upcoming bake modal
            onViewUpcomingBake(upcomingBake);
        }
    };
    
    // --- CALENDAR GRID GENERATION (ADAPTED FOR NEW STYLING) ---

    const firstDayOfMonth = new Date(year, currentDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <section>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-pink-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-[#1b0d10]">My Baking Calendar</h2>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-[#f3e7e9] transition-colors">
                        <svg className="w-6 h-6 text-[#9a4c59]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <span className="text-sm font-semibold text-[#1b0d10] w-24 text-center uppercase">{monthName} {year}</span>
                    <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-[#f3e7e9] transition-colors">
                        <svg className="w-6 h-6 text-[#9a4c59]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {daysOfWeek.map(day => <div key={day} className="font-bold text-[#9a4c59] w-8 h-8 flex items-center justify-center">{day}</div>)}
                    
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}

                    {Array.from({ length: daysInMonth }).map((_, day) => {
                        const dateNum = day + 1;
                        const dateObj = new Date(year, currentDate.getMonth(), dateNum);
                        const dateKey = dateObj.toDateString();
                        const hasPastBake = bakedDaysMap.has(dateKey);
                        const hasUpcomingBake = upcomingBakeDaysMap.has(dateKey);
                        const isToday = dateObj.toDateString() === today.toDateString();

                        let dayClass = "relative w-8 h-8 flex items-center justify-center rounded-full transition-colors";
                        if (hasPastBake || hasUpcomingBake) {
                            dayClass += " cursor-pointer";
                        }
                        
                        if (isToday) {
                            dayClass += " bg-[#f0425f] text-white";
                        } else if (hasPastBake && !hasUpcomingBake) {
                            dayClass += " bg-pink-100 text-[#1b0d10] hover:bg-pink-200";
                        } else if (hasUpcomingBake) {
                            dayClass += " border-2 border-[#f0425f] text-[#1b0d10] hover:bg-pink-50";
                        } else {
                            dayClass += " text-gray-400"; // Day with no bakes
                        }

                        return (
                            <div key={dateNum} className="flex justify-center">
                                <button className={dayClass} onClick={() => handleDayClick(dateNum)} disabled={!hasPastBake && !hasUpcomingBake}>
                                    {dateNum}
                                </button>
                            </div>
                        );
                    })}
                </div>
                
                <div className="mt-4 flex items-center justify-center gap-4 text-xs font-semibold text-[#9a4c59]">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-pink-100"></div><span>Past Bakes</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border-2 border-[#f0425f]"></div><span>Scheduled</span></div>
                </div>
            </div>
        </section>
    );
};

export default BakingCalendar;