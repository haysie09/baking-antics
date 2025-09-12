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
                    <circle className="text-[var(--progress-bg)]" strokeWidth="10" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                    {/* Progress circle */}
                    <circle
                        className="text-[var(--progress-highlight)]"
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
                <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-[var(--progress-highlight)]">
                    {value}
                </span>
            </div>
            <p className="mt-2 text-sm font-bold text-[var(--progress-text)]">{label}</p>
            <p className="text-xs text-[var(--progress-text)] opacity-70">{subLabel}</p>
        </div>
    );
};

const DashboardStats = ({ journal, currentCalendarDate }) => {
    const [filter, setFilter] = useState('month');

    useEffect(() => {
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
        
        switch (filter) {
            case 'week': {
                // ... (logic is unchanged)
                break;
            }
            case 'last-week': {
                // ... (logic is unchanged)
                break;
            }
            case 'all':
                // ... (logic is unchanged)
                break;
            case 'month':
            default: {
                // ... (logic is unchanged)
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
        <div className="bg-[var(--progress-card-bg)] p-4 rounded-xl shadow-sm border border-green-200">
            <div className="text-center mb-4 relative">
                <select 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)}
                    className="appearance-none bg-white border border-green-200 text-[var(--progress-text)] text-xs font-semibold px-4 py-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--progress-highlight)]"
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
