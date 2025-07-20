import React, { useMemo, useState } from 'react';

const BakingCalendar = ({ journal, upcomingBakes, setView, setDateFilter, openAddChoiceModal, onViewBake, onViewUpcomingBake, currentDate, setCurrentDate }) => {
    
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

    // Updated handler to check for combined bakes
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

    // ... (rest of the component logic and JSX remains the same)

    return (
        <div className="bg-info-box p-4 rounded-2xl border border-burnt-orange">
            {/* ... */}
        </div>
    );
};

export default BakingCalendar;
