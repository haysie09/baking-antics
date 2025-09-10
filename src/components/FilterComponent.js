import React, { useState } from 'react';

const FilterComponent = ({ categories, onFilterChange }) => {
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('all');
    const [selectedYear, setSelectedYear] = useState('all');

    // All logic for generating years and months is preserved
    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = currentYear; i >= currentYear - 5; i--) {
            years.push(i);
        }
        return years;
    };
    const yearOptions = generateYearOptions();
    const monthOptions = [
        { value: 'all', label: 'All Months' },
        { value: 0, label: 'January' }, { value: 1, label: 'February' },
        { value: 2, label: 'March' }, { value: 3, label: 'April' },
        { value: 4, label: 'May' }, { value: 5, label: 'June' },
        { value: 6, label: 'July' }, { value: 7, label: 'August' },
        { value: 8, label: 'September' }, { value: 9, label: 'October' },
        { value: 10, label: 'November' }, { value: 11, label: 'December' },
    ];

    // All handler functions are preserved
    const triggerFilterChange = (filters) => {
        onFilterChange(filters);
    };
    const handleCategoryToggle = (cat) => {
        const newCategories = selectedCategories.includes(cat)
            ? selectedCategories.filter(c => c !== cat)
            : [...selectedCategories, cat];
        setSelectedCategories(newCategories);
        triggerFilterChange({ categories: newCategories, month: selectedMonth, year: selectedYear });
    };
    const handleMonthChange = (e) => {
        const month = e.target.value;
        setSelectedMonth(month);
        triggerFilterChange({ categories: selectedCategories, month: month, year: selectedYear });
    };
    const handleYearChange = (e) => {
        const year = e.target.value;
        setSelectedYear(year);
        triggerFilterChange({ categories: selectedCategories, month: selectedMonth, year: year });
    };

    return (
        // UPDATED: Main container with new styling
        <div className="bg-white p-3 rounded-xl mb-4 border border-pink-100 shadow-sm font-sans">
            <button onClick={() => setShowFilters(!showFilters)} className="w-full flex justify-between items-center">
                <h3 className="text-base font-semibold text-[#1b0d10]">Filter</h3>
                <span className={`transform transition-transform text-[#f0425f] ${showFilters ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {showFilters && (
                <div className="mt-4 pt-4 border-t border-pink-100 space-y-4">
                    {/* Date Filters */}
                    <div>
                        <label className="block text-[#1b0d10] font-semibold mb-2 text-base">Filter by Date</label>
                        <div className="flex gap-2">
                            <select value={selectedMonth} onChange={handleMonthChange} className="w-1/2 p-2 border border-gray-300 rounded-full text-sm bg-white focus:ring-2 focus:ring-[#f0425f] focus:outline-none">
                                {monthOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                            <select value={selectedYear} onChange={handleYearChange} className="w-1/2 p-2 border border-gray-300 rounded-full text-sm bg-white focus:ring-2 focus:ring-[#f0425f] focus:outline-none">
                                <option value="all">All Years</option>
                                {yearOptions.map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Category Filters */}
                    <div>
                        <label className="block text-[#1b0d10] font-semibold mb-2 text-base">Filter by Category</label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button 
                                    key={cat} 
                                    onClick={() => handleCategoryToggle(cat)} 
                                    className={`py-1 px-3 rounded-full border text-sm ${selectedCategories.includes(cat) ? 'bg-[#f0425f] text-white border-[#f0425f]' : 'bg-white text-gray-700 border-gray-300'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterComponent;