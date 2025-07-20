import React, { useMemo } from 'react';

// Accept the new `onViewUpcomingBake` prop
const BakingCalendar = ({ journal, upcomingBakes, setView, setDateFilter, openAddChoiceModal, onViewBake, onViewUpcomingBake, currentDate, setCurrentDate }) => {
    
    // --- Create maps for quick lookup of bakes by date string ---
    const bakedDaysMap = useMemo(() => {
        const map = new Map();
        if (journal) {
            journal.forEach(entry => {
                const bakeDate = new Date(entry.bakingDate);
                const utcDate = new Date(Date.UTC(bakeDate.getFullYear(), bakeDate.getMonth(), bakeDate.getDate()));
                if (!map.has(utcDate.toDateString())) {
                    map.set(utcDate.toDateString(), entry);
                }
            });
        }
        return map;
    }, [journal]);

    const upcomingBakeDaysMap = useMemo(() => {
        const map = new Map();
        if (upcomingBakes) {
            upcomingBakes.forEach(bake => {
                const bakeDate = new Date(bake.bakeDate);
                const utcDate = new Date(Date.UTC(bakeDate.getFullYear(), bakeDate.getMonth(), bakeDate.getDate()));
                if (!map.has(utcDate.toDateString())) {
                    map.set(utcDate.toDateString(), bake);
                }
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

    // --- Updated handler to check for combined bakes ---
    const handleDayClick = (day) => {
        const fullDate = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), day));
        const dateString = fullDate.toDateString();

        const pastBake = bakedDaysMap.get(dateString);
        const upcomingBake = upcomingBakeDaysMap.get(dateString);

        if (pastBake) {
            // If there's a past bake, always use the main viewer,
            // and pass the upcoming bake if it also exists.
            onViewBake(pastBake, upcomingBake);
        } else if (upcomingBake) {
            // If there's only an upcoming bake, use its dedicated viewer.
            onViewUpcomingBake(upcomingBake);
        } else {
            alert("No bakes on this day. Use the '+' to add one.");
        }
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();
    const todayDateString = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())).toDateString();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (new Date(year, month, 1).getUTCDay() + 6) % 7;

    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(<div key={`empty-${i}`}></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        const dayDate = new Date(Date.UTC(year, month, i));
        const dayDateString = dayDate.toDateString();
        
        const isBaked = bakedDaysMap.has(dayDateString);
        const isUpcoming = upcomingBakeDaysMap.has(dayDateString);
        const isToday = dayDateString === todayDateString;

        calendarDays.push(
            <div key={i} onClick={() => handleDayClick(i)} className="text-center cursor-pointer h-10 flex flex-col items-center justify-start pt-1">
                <div className={`w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'border-2 border-add-idea' : ''}`}>
                    {i}
                </div>
                <div className="h-2 flex justify-center items-center space-x-1 mt-1">
                    {isBaked && <div className="w-2 h-2 bg-burnt-orange rounded-full"></div>}
                    {isUpcoming && <div className="w-2 h-2 bg-gray-400 rounded-full"></div>}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-info-box p-4 rounded-2xl border border-burnt-orange">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-burnt-orange">My Baking Calendar</h3>
                <button onClick={openAddChoiceModal} className="text-add-idea" title="Add Bake">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </button>
            </div>

            <div className="flex justify-between items-center mb-3 px-2">
                <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-light-peach transition-colors">
                    <svg className="w-6 h-6 text-burnt-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h4 className="font-montserrat font-bold text-lg text-add-idea">
                    {currentDate.toLocaleString('default', { month: 'long' }).toUpperCase()} {year}
                </h4>
                <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-light-peach transition-colors">
                    <svg className="w-6 h-6 text-burnt-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-sm text-center text-app-grey font-montserrat font-bold">
                <div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div><div>S</div>
            </div>
            <div className="grid grid-cols-7 gap-1 mt-2 font-montserrat text-app-grey">
                {calendarDays}
            </div>
        </div>
    );
};

export default BakingCalendar;
