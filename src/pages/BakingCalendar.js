import React, { useState, useMemo } from 'react';

const BakingCalendar = ({ journal, setView, setDateFilter, openAddJournalModal }) => {
    const [currentDate] = useState(new Date());

    const bakedDays = useMemo(() => {
        const dates = new Set();
        journal.forEach(entry => {
            dates.add(new Date(entry.bakingDate).toDateString());
        });
        return dates;
    }, [journal]);

    const handleDayClick = (day) => {
        const fullDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        if (bakedDays.has(fullDate.toDateString())) {
            setDateFilter(fullDate.toISOString().split('T')[0]);
            setView('journal');
        } else {
            alert("No baking activity on this day.");
        }
    };

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(<div key={`empty-${i}`}></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
        const isBaked = bakedDays.has(dayDate.toDateString());
        calendarDays.push(
            <div key={i} onClick={() => handleDayClick(i)} className="text-center p-1 cursor-pointer relative">
                {i}
                {isBaked && <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-burnt-orange rounded-full"></div>}
            </div>
        );
    }

    return (
        <div className="bg-info-box p-4 rounded-2xl border border-burnt-orange">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-burnt-orange">My Baking Calendar</h3>
                <button onClick={openAddJournalModal} className="text-burnt-orange" title="Add New Bake">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
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