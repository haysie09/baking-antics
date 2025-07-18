import React, { useState, useMemo } from 'react';

const BakingCalendar = ({ journal, upcomingBakes, setView, setDateFilter, openAddJournalModal }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // --- Memoized sets for baked days and upcoming bakes ---
    const bakedDays = useMemo(() => {
        const dates = new Set();
        if (journal) {
            journal.forEach(entry => {
                const bakeDate = new Date(entry.bakingDate);
                const utcDate = new Date(Date.UTC(bakeDate.getFullYear(), bakeDate.getMonth(), bakeDate.getDate()));
                dates.add(utcDate.toDateString());
            });
        }
        return dates;
    }, [journal]);

    const upcomingBakeDays = useMemo(() => {
        const dates = new Set();
        if (upcomingBakes) {
            upcomingBakes.forEach(bake => {
                const bakeDate = new Date(bake.bakeDate);
                const utcDate = new Date(Date.UTC(bakeDate.getFullYear(), bakeDate.getMonth(), bakeDate.getDate()));
                dates.add(utcDate.toDateString());
            });
        }
        return dates;
    }, [upcomingBakes]);

    // --- Handlers ---
    const handlePrevMonth = () => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
    };

    const handleDayClick = (day) => {
        const fullDate = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), day));
        if (bakedDays.has(fullDate.toDateString())) {
            setDateFilter(fullDate.toISOString().split('T')[0]);
            setView('journal');
        } else if (upcomingBakeDays.has(fullDate.toDateString())) {
            alert("This is an upcoming bake! You can edit it from the list below.");
        } else {
            alert("No past bake on this day. Use the '+' to add one.");
        }
    };

    // --- Calendar Grid Logic ---
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();
    const todayDateString = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())).toDateString();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getUTCDay();

    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(<div key={`empty-${i}`}></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        const dayDate = new Date(Date.UTC(year, month, i));
        const dayDateString = dayDate.toDateString();
        
        const isBaked = bakedDays.has(dayDateString);
        const isUpcoming = upcomingBakeDays.has(dayDateString);
        const isToday = dayDateString === todayDateString;

        calendarDays.push(
            <div key={i} onClick={() => handleDayClick(i)} className="text-center p-1 cursor-pointer relative h-8 flex items-center justify-center">
                {/* Today's date indicator is now a red-pink outline */}
                <div className={`w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'border-2 border-add-idea' : ''}`}>
                    {i}
                </div>
                
                {/* Container for dots, only rendered if there's at least one dot to show */}
                {(isBaked || isUpcoming) && (
                    <div className="absolute bottom-1 left-0 right-0 flex justify-center items-center space-x-1">
                        {/* Past bake dot (orange) */}
                        {isBaked && <div className="w-2 h-2 bg-burnt-orange rounded-full"></div>}
                        {/* Upcoming bake dot (grey) */}
                        {isUpcoming && <div className="w-2 h-2 bg-gray-400 rounded-full"></div>}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-info-box p-4 rounded-2xl border border-burnt-orange">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-burnt-orange">My Baking Calendar</h3>
                <button onClick={openAddJournalModal} className="text-add-idea" title="Add Bake">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </button>
            </div>

            <div className="flex justify-between items-center mb-3 px-2">
                <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-light-peach transition-colors">
                    <svg className="w-6 h-6 text-burnt-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h4 className="font-montserrat font-bold text-xl text-add-idea">
                    {currentDate.toLocaleString('default', { month: 'long' }).toUpperCase()} {year}
                </h4>
                <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-light-peach transition-colors">
                    <svg className="w-6 h-6 text-burnt-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-sm text-center text-app-grey font-montserrat font-bold">
                <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
            </div>
            <div className="grid grid-cols-7 gap-1 mt-2 font-montserrat text-app-grey">
                {calendarDays}
            </div>
        </div>
    );
};

export default BakingCalendar;
