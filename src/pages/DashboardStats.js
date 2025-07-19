import React, { useState, useMemo } from 'react';

const DashboardStats = ({ journal }) => {
    // State to manage the current filter view
    const [filter, setFilter] = useState('month'); // 'month', 'week', 'all'

    const stats = useMemo(() => {
        const now = new Date();
        let filteredEntries = [];
        let dateLabel = '';

        switch (filter) {
            case 'week':
                const startOfWeek = new Date(now);
                const dayOfWeek = now.getDay();
                const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to start on Monday
                startOfWeek.setDate(diff);
                startOfWeek.setHours(0, 0, 0, 0);

                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                endOfWeek.setHours(23, 59, 59, 999);
                
                dateLabel = `${startOfWeek.getDate()}/${startOfWeek.getMonth() + 1} - ${endOfWeek.getDate()}/${endOfWeek.getMonth() + 1}`;

                filteredEntries = journal.filter(entry => {
                    const entryDate = new Date(entry.bakingDate);
                    return entryDate >= startOfWeek && entryDate <= endOfWeek;
                });
                break;
            
            case 'all':
                dateLabel = 'All Time';
                filteredEntries = journal;
                break;

            case 'month':
            default:
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();
                dateLabel = now.toLocaleString('default', { month: 'long' });
                filteredEntries = journal.filter(entry => {
                    const entryDate = new Date(entry.bakingDate);
                    return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
                });
                break;
        }

        const totalBakes = filteredEntries.length;
        const totalMinutes = filteredEntries.reduce((acc, entry) => {
            const hours = entry.timeHours || 0;
            const minutes = entry.timeMinutes || 0;
            return acc + (hours * 60) + minutes;
        }, 0);

        const totalHours = Math.floor(totalMinutes / 60);

        return { totalBakes, totalHours, dateLabel };
    }, [journal, filter]);

    return (
        <div className="bg-info-box p-4 rounded-2xl border border-burnt-orange">
            <div className="flex justify-end items-center mb-2 -mt-2 -mr-2">
                <div className="relative">
                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                        className="text-xs font-montserrat bg-white border border-gray-300 rounded-lg py-1 pl-2 pr-6 appearance-none focus:outline-none focus:ring-2 focus:ring-burnt-orange"
                    >
                        <option value="month">This Month</option>
                        <option value="week">This Week</option>
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
                    {/* Text is now lighter and includes the dynamic date label */}
                    <p className="mt-2 text-sm font-semibold text-app-grey/50 font-montserrat">
                        bakes <span className="block text-xs">{stats.dateLabel}</span>
                    </p>
                </div>
                <div>
                    <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-4 border-light-peach"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-add-idea" style={{ clipPath: 'inset(0 0 50% 0)' }}></div>
                        <span className="text-4xl font-bold text-burnt-orange font-montserrat">{stats.totalHours}</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-app-grey/50 font-montserrat">
                        hours spent <span className="block text-xs">{stats.dateLabel}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;
