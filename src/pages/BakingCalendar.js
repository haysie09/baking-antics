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

    const handleDayClick = (day) => {
        const fullDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dateString = fullDate.toDateString();
        const pastBake = bakedDaysMap.get(dateString);
        const upcomingBake = upcomingBakeDaysMap.get(dateString);

        if (pastBake) {
            onViewBake({ past: pastBake, upcoming: upcomingBake });
        } else if (upcomingBake) {
            onViewUpcomingBake(upcomingBake);
        }
    };
    
    const firstDayOfMonth = new Date(year, currentDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <section>
            <div className="bg-[var(--progress-card-bg)] p-4 rounded-xl shadow-sm border border-green-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">My Baking Calendar</h2>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-green-100 transition-colors">
                        <svg className="w-6 h-6 text-[var(--progress-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <span className="text-sm font-semibold text-[var(--text-primary)] w-24 text-center uppercase">{monthName} {year}</span>
                    <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-green-100 transition-colors">
                        <svg className="w-6 h-6 text-[var(--progress-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {daysOfWeek.map(day => <div key={day} className="font-bold text-[var(--progress-text)] opacity-70 w-8 h-8 flex items-center justify-center">{day}</div>)}
                    
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
                            dayClass += " bg-[var(--progress-highlight)] text-white";
                        } else if (hasPastBake && !hasUpcomingBake) {
                            dayClass += " bg-green-200 text-[var(--progress-text)] hover:bg-green-300";
                        } else if (hasUpcomingBake) {
                            dayClass += " border-2 border-[var(--progress-highlight)] text-[var(--progress-text)] hover:bg-green-100";
                        } else {
                            dayClass += " text-gray-400";
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
                
                <div className="mt-4 flex items-center justify-center gap-4 text-xs font-semibold text-[var(--progress-text)] opacity-80">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-200"></div><span>Past Bakes</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border-2 border-[var(--progress-highlight)]"></div><span>Scheduled</span></div>
                </div>
            </div>
        </section>
    );
};

export default BakingCalendar;

