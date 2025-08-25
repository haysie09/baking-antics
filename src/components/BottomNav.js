// Filename: src/components/BottomNav.js

import React from 'react';

// A helper component for the navigation buttons
const NavButton = ({ onClick, label, icon, isActive }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-1/4 pt-2 pb-1 text-xs transition-colors duration-200 ${
            isActive ? 'text-burnt-orange' : 'text-app-grey/70'
        }`}
    >
        {icon}
        <span className="mt-1">{label}</span>
    </button>
);

// The main BottomNav component
const BottomNav = ({ currentView, navigate }) => {
    // Icons for the buttons (using SVG for simplicity)
    const icons = {
        dashboard: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
        ),
        cookbook: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        ),
        journal: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
        ),
        ideapad: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
        ),
    };

    return (
        <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 font-montserrat">
            <div className="flex h-full max-w-lg mx-auto">
                <NavButton
                    label="Dashboard"
                    onClick={() => navigate('dashboard')}
                    icon={icons.dashboard}
                    isActive={currentView === 'dashboard'}
                />
                <NavButton
                    label="Recipes"
                    onClick={() => navigate('cookbook')}
                    icon={icons.cookbook}
                    isActive={currentView === 'cookbook'}
                />
                <NavButton
                    label="Journal"
                    onClick={() => navigate('journal')}
                    icon={icons.journal}
                    isActive={currentView === 'journal'}
                />
                <NavButton
                    label="Ideas"
                    onClick={() => navigate('ideapad')}
                    icon={icons.ideapad}
                    isActive={currentView === 'ideapad'}
                />
            </div>
        </div>
    );
};

export default BottomNav;