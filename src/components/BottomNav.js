import React from 'react';

// A helper component for the regular navigation buttons
const NavButton = ({ onClick, label, icon, isActive }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center gap-1 w-full transition-colors duration-200 ${
            isActive ? 'text-[#f0425f]' : 'text-gray-500 hover:text-[#f0425f]'
        }`}
    >
        {icon}
        <span className="text-xs font-medium">{label}</span>
    </button>
);

// The main BottomNav component
const BottomNav = ({ currentView, navigate, onOpenCreateModal }) => {
    const icons = {
        home: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
        discover: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
        add: <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
        saved: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>,
        profile: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40">
            <div className="bg-white border-t border-gray-200 px-4 pb-3 pt-2 font-sans">
                <div className="flex justify-around items-center">
                    <NavButton
                        label="Home"
                        onClick={() => navigate('dashboard')}
                        icon={icons.home}
                        isActive={currentView === 'dashboard'}
                    />
                    <NavButton
                        label="Discover"
                        onClick={() => navigate('dashboard')} // Placeholder
                        icon={icons.discover}
                        isActive={currentView === 'discover'}
                    />
                    {/* Central Action Button */}
                    <button onClick={onOpenCreateModal} className="bg-[#f0425f] rounded-full p-3 -mt-8 border-4 border-white shadow-lg">
                        {icons.add}
                    </button>
                    <NavButton
                        label="Saved"
                        onClick={() => navigate('cookbook')}
                        icon={icons.saved}
                        isActive={currentView === 'cookbook'}
                    />
                    <NavButton
                        label="Profile"
                        onClick={() => navigate('account')}
                        icon={icons.profile}
                        isActive={currentView === 'account'}
                    />
                </div>
            </div>
        </div>
    );
};

export default BottomNav;