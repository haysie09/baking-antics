import React, { useState, useMemo, useEffect } from 'react';

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

        switch (filter) {
            case 'week': {
                const startOfWeek = new Date(now);
                const day = startOfWeek.getUTCDay();
                const diff = startOfWeek.getUTCDate() - day + (day === 0 ? -6 : 1); // Adjust to start on Monday
                startOfWeek.setUTCDate(diff);
                startOfWeek.setUTCHours(0, 0, 0, 0);

                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
                endOfWeek.setUTCHours(23, 59, 59, 999);
                
                dateLabel = 'This Week';
                dateSubLabel = `(${startOfWeek.getDate()}/${startOfWeek.getMonth() + 1} - ${endOfWeek.getDate()}/${endOfWeek.getMonth() + 1})`;

                filteredEntries = journal.filter(entry => {
                    const entryDate = new Date(entry.bakingDate);
                    return entryDate >= startOfWeek && entryDate <= endOfWeek;
                });
                break;
            }
            case 'last-week': {
                // Corrected and robust logic for "Last Week"
                const startOfThisWeek = new Date();
                const day = startOfThisWeek.getUTCDay();
                const diffToMonday = startOfThisWeek.getUTCDate() - day + (day === 0 ? -6 : 1);
                startOfThisWeek.setUTCDate(diffToMonday);
                startOfThisWeek.setUTCHours(0, 0, 0, 0);

                const endOfLastWeek = new Date(startOfThisWeek.getTime() - 1); // This is last Sunday
                const startOfLastWeek = new Date(endOfLastWeek);
                startOfLastWeek.setUTCDate(endOfLastWeek.getUTCDate() - 6); // This is last Monday

                dateLabel = 'Last Week';
                dateSubLabel = `(${startOfLastWeek.getDate()}/${startOfLastWeek.getMonth() + 1} - ${endOfLastWeek.getDate()}/${endOfLastWeek.getMonth() + 1})`;

                filteredEntries = journal.filter(entry => {
                    const entryDate = new Date(entry.bakingDate);
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
                    const entryDate = new Date(entry.bakingDate);
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
        <div className="bg-info-box p-4 rounded-2xl border border-burnt-orange">
            <div className="flex justify-center items-center mb-3">
                <div className="relative">
                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                        className="text-xs font-montserrat bg-white border border-gray-300 rounded-lg py-1 pl-2 pr-6 appearance-none focus:outline-none focus:ring-2 focus:ring-burnt-orange"
                    >
                        <option value="month">{stats.dateLabel}</option>
                        <option value="week">This Week</option>
                        <option value="last-week">Last Week</option>
                        <option value="all">All Time</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                    <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-4 border-light-peach"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-add-idea" style={{ clipPath: 'inset(0 50% 0 0)' }}></div>
                        <span className="text-4xl font-bold text-burnt-orange font-montserrat">{stats.totalBakes}</span>
                    </div>
                    <p className="mt-2 text-sm font-bold text-app-grey font-montserrat">Bakes</p>
                    <p className="text-xs italic text-app-grey/75 font-montserrat">
                        {stats.dateSubLabel ? stats.dateSubLabel : stats.dateLabel}
                    </p>
                </div>
                <div>
                    <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-4 border-light-peach"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-add-idea" style={{ clipPath: 'inset(0 0 50% 0)' }}></div>
                        <span className="text-4xl font-bold text-burnt-orange font-montserrat">{stats.totalHours}</span>
                    </div>
                    <p className="mt-2 text-sm font-bold text-app-grey font-montserrat">Hours Spent</p>
                    <p className="text-xs italic text-app-grey/75 font-montserrat">
                        {stats.dateSubLabel ? stats.dateSubLabel : stats.dateLabel}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;
