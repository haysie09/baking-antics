import React from 'react';

const RecipeFilterBar = ({ categories, activeCategory, onCategorySelect }) => {
    // We add "All" to the beginning of the categories list
    const filterCategories = ['All', ...categories];

    return (
        // This container allows for horizontal scrolling on small screens without showing a scrollbar
        <div className="flex gap-2 p-4 pt-2 overflow-x-auto whitespace-nowrap [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filterCategories.map(category => (
                <button
                    key={category}
                    onClick={() => onCategorySelect(category)}
                    // This dynamically changes the style based on whether the button is active
                    className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 text-sm transition-colors
                        ${activeCategory === category 
                            ? 'bg-[var(--primary-color)] text-white font-semibold' 
                            : 'bg-white/30 text-white hover:bg-white/50 font-medium'
                        }`
                    }
                >
                    {category}
                </button>
            ))}
        </div>
    );
};

export default RecipeFilterBar;
