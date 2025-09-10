import React, { useState, useMemo, useEffect } from 'react';

// A reusable component for the circular stat display
const StatCircle = ({ value, label, subLabel, percentage }) => {
    const circumference = 2 * Math.PI * 40; // a circle with radius 40
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center text-center">
            <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle className="text-pink-100" strokeWidth="10" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                    {/* Progress circle */}
                    <circle
                        className="text-[#f0425f]"
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                        transform="rotate(-90 50 50)"
                    />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-[#f0425f]">
                    {value}
                </span>
            </div>
            <p className="mt-2 text-sm font-bold text-[#1b0d10]">{label}</p>
            <p className="text-xs text-[#9a4c59]">{subLabel}</p>
        </div>
    );
};

const DashboardStats = ({ journal, currentCalendarDate }) => {
    const [filter, setFilter] = useState('month');

    useEffect(() => {
        // Reset to month view if the calendar date changes
        setFilter('month');
    }, [currentCalendarDate]);

    const stats = useMemo(() => {
        const now = new Date();
        let filteredEntries = [];
        let dateLabel = '';
        let dateSubLabel = '';

        if (!journal) {
            return { totalBakes: 0, totalHours: 0, dateLabel: 'This Month', dateSubLabel: '' };
        }
        
        // --- YOUR ORIGINAL CALCULATION LOGIC ---
        switch (filter) {
            case 'week': {
                const startOfWeek = new Date(now);
                const day = startOfWeek.getDay();
                const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
                startOfWeek.setDate(diff);
                startOfWeek.setHours(0, 0, 0, 0);
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                endOfWeek.setHours(23, 59, 59, 999);
                dateLabel = 'This Week';
                dateSubLabel = `(${startOfWeek.getDate()}/${startOfWeek.getMonth() + 1} - ${endOfWeek.getDate()}/${endOfWeek.getMonth() + 1})`;
                filteredEntries = journal.filter(entry => {
                    const entryDate = entry.bakingDate.toDate ? entry.bakingDate.toDate() : new Date(entry.bakingDate);
                    return entryDate >= startOfWeek && entryDate <= endOfWeek;
                });
                break;
            }
            case 'last-week': {
                const startOfThisWeek = new Date();
                const day = startOfThisWeek.getDay();
                const diffToMonday = startOfThisWeek.getDate() - day + (day === 0 ? -6 : 1);
                startOfThisWeek.setDate(diffToMonday);
                startOfThisWeek.setHours(0, 0, 0, 0);
                const endOfLastWeek = new Date(startOfThisWeek.getTime() - 1);
                const startOfLastWeek = new Date(endOfLastWeek);
                startOfLastWeek.setDate(endOfLastWeek.getDate() - 6);
                dateLabel = 'Last Week';
                dateSubLabel = `(${startOfLastWeek.getDate()}/${startOfLastWeek.getMonth() + 1} - ${endOfLastWeek.getDate()}/${endOfLastWeek.getMonth() + 1})`;
                filteredEntries = journal.filter(entry => {
                    const entryDate = entry.bakingDate.toDate ? entry.bakingDate.toDate() : new Date(entry.bakingDate);
                    return entryDate >= startOfLastWeek && entryDate <= endOfLastWeek;
                });
                break;
            }
            case 'all':
                dateLabel = 'All Time';
                filteredEntries = journal;
                break;
            case 'month':
            default: {
                const displayDate = currentCalendarDate || new Date();
                const month = displayDate.getMonth();
                const year = displayDate.getFullYear();
                dateLabel = displayDate.toLocaleString('default', { month: 'long' });
                filteredEntries = journal.filter(entry => {
                    const entryDate = entry.bakingDate.toDate ? entry.bakingDate.toDate() : new Date(entry.bakingDate);
                    return entryDate.getMonth() === month && entryDate.getFullYear() === year;
                });
                break;
            }
        }

        const totalBakes = filteredEntries.length;
        const totalMinutes = filteredEntries.reduce((acc, entry) => {
            const hours = entry.timeHours || 0;
            const minutes = entry.timeMinutes || 0;
            return acc + (hours * 60) + minutes;
        }, 0);
        const totalHours = Math.floor(totalMinutes / 60);

        return { totalBakes, totalHours, dateLabel, dateSubLabel };
    }, [journal, filter, currentCalendarDate]);

    return (
        // The <section> and <h2> wrapper were removed from here.
        // The parent Dashboard.js now provides the title.
        <div className="bg-white p-4 rounded-xl shadow-sm border border-pink-100">
            <div className="text-center mb-4 relative">
                <select 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)}
                    className="appearance-none bg-white border border-pink-200 text-pink-500 text-xs font-semibold px-4 py-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                    <option value="month">{currentCalendarDate.toLocaleString('default', { month: 'long' })}</option>
                    <option value="week">This Week</option>
                    <option value="last-week">Last Week</option>
                    <option value="all">All Time</option>
                </select>
            </div>
            <div className="flex justify-around items-center">
                <StatCircle 
                    value={stats.totalBakes} 
                    label="Bakes" 
                    subLabel={stats.dateSubLabel || stats.dateLabel}
                    percentage={(stats.totalBakes / 10) * 100} // Example goal: 10 bakes
                />
                <StatCircle 
                    value={stats.totalHours} 
                    label="Hours Spent" 
                    subLabel={stats.dateSubLabel || stats.dateLabel}
                    percentage={(stats.totalHours / 20) * 100} // Example goal: 20 hours
                />
            </div>
        </div>
    );
};

export default DashboardStats;