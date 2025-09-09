import React from 'react';

// A helper component for the regular navigation buttons
const NavButton = ({ onClick, label, icon, isActive, className = '' }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors duration-200 ${
            isActive ? 'text-[#f0425f]' : 'text-gray-500 hover:text-[#f0425f]'
        } ${className}`}
    >
        {icon}
        {/* The label is now conditional */}
        {label && <span className="text-xs font-medium">{label}</span>}
    </button>
);

// The main BottomNav component
const BottomNav = ({ currentView, navigate, onOpenCreateModal }) => {
    const icons = {
        dashboard: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
        recipes: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
        add: <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
        journal: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
        ideas: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
    };

    // Helper component for the separator line
    const Separator = () => <div className="h-8 w-px bg-gray-200"></div>;

    return (
        // UPDATED: Increased bottom padding from pb-3 to pb-4
        <div className="fixed bottom-0 left-0 right-0 z-40">
            <div className="bg-white border-t border-gray-200 px-2 pb-4 pt-2 font-sans">
                <div className="flex justify-around items-center h-full max-w-lg mx-auto">
                    {/* UPDATED: "Dashboard" label is removed */}
                    <NavButton
                        label="" 
                        onClick={() => navigate('dashboard')}
                        icon={icons.dashboard}
                        isActive={currentView === 'dashboard'}
                    />
                    <Separator />
                    <NavButton
                        label="Recipes"
                        onClick={() => navigate('cookbook')}
                        icon={icons.recipes}
                        isActive={currentView === 'cookbook'}
                    />
                    
                    {/* The central button does not get separators */}
                    <button onClick={onOpenCreateModal} className="bg-[#f0425f] rounded-full p-3 -mt-8 border-4 border-white shadow-lg mx-2">
                        {icons.add}
                    </button>
                    
                    <NavButton
                        label="Journal"
                        onClick={() => navigate('journal')}
                        icon={icons.journal}
                        isActive={currentView === 'journal'}
                    />
                    <Separator />
                    <NavButton
                        label="Ideas"
                        onClick={() => navigate('ideapad')}
                        icon={icons.ideas}
                        isActive={currentView === 'ideapad'}
                    />
                </div>
            </div>
        </div>
    );
};

export default BottomNav;