import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase/config';

// --- Helper Components ---
import LoadingSpinner from './components/LoadingSpinner';

// --- Page Components ---
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import IdeaPad from './pages/IdeaPad';
import BakingJournal from './pages/BakingJournal';
import MyCookbook from './pages/MyCookbook';
import JournalEntryForm from './pages/JournalEntryForm';
import IdeaForm from './pages/IdeaForm';

// --- Custom Hooks ---
import { useAuth } from './hooks/useAuth';
import { useJournal } from './hooks/useJournal';
import { useIdeaPad } from './hooks/useIdeaPad';
import { useCookbook } from './hooks/useCookbook';
import { useUpcomingBakes } from './hooks/useUpcomingBakes'; // This import was likely missing

// --- Main App Component ---
export default function App() {
    const { user, isAuthReady } = useAuth();

    if (!isAuthReady) {
        return <LoadingSpinner />;
    }

    return (
        <>
            {user ? <MainApp user={user} /> : <AuthPage />}
        </>
    );
}


const MainApp = ({ user }) => {
    // --- UI State ---
    const [view, setView] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [dateFilter, setDateFilter] = useState(null);
    const [isAddJournalModalOpen, setIsAddJournalModalOpen] = useState(false);
    const [isAddIdeaModalOpen, setIsAddIdeaModalOpen] = useState(false);

    // --- Data from Custom Hooks ---
    const { journal, addJournalEntry, updateJournalEntry, deleteJournalEntry } = useJournal();
    const { ideaPad, addIdea, deleteIdea } = useIdeaPad();
    const { cookbook, addRecipe, updateRecipe, deleteRecipe } = useCookbook();
    const { upcomingBakes, addUpcomingBake, updateUpcomingBake, deleteUpcomingBake } = useUpcomingBakes();

    // --- Navigation and Actions ---
    const handleSignOut = () => {
        signOut(auth);
    };

    const navigate = (newView) => {
        setView(newView);
        setIsSidebarOpen(false);
    };

    const renderView = () => {
        switch (view) {
            case 'ideapad':
                return <IdeaPad ideas={ideaPad} addIdea={addIdea} deleteIdea={deleteIdea} addJournalEntry={addJournalEntry} />;
            case 'journal':
                return <BakingJournal journal={journal} addJournalEntry={addJournalEntry} updateJournalEntry={updateJournalEntry} deleteJournalEntry={deleteJournalEntry} cookbook={cookbook} dateFilter={dateFilter} setDateFilter={setDateFilter} />;
            case 'cookbook':
                return <MyCookbook cookbook={cookbook} addRecipe={addRecipe} updateRecipe={updateRecipe} deleteRecipe={deleteRecipe} />;
            default: // 'dashboard'
                return <Dashboard 
                    setView={setView} 
                    ideaPad={ideaPad} 
                    addIdea={addIdea} 
                    deleteIdea={deleteIdea} 
                    userId={user.uid} 
                    journal={journal} 
                    addJournalEntry={addJournalEntry}
                    setDateFilter={setDateFilter} 
                    openAddJournalModal={() => setIsAddJournalModalOpen(true)} 
                    openAddIdeaModal={() => setIsAddIdeaModalOpen(true)}
                    upcomingBakes={upcomingBakes}
                    addUpcomingBake={addUpcomingBake}
                    updateUpcomingBake={updateUpcomingBake}
                    deleteUpcomingBake={deleteUpcomingBake}
                />;
        }
    };

    return (
        <div className="bg-app-white text-app-grey">
            <div className="min-h-screen flex flex-col md:items-center md:justify-center md:py-8 bg-gray-100">
                <div className="w-full md:max-w-md md:shadow-2xl md:overflow-hidden bg-app-white flex flex-col flex-grow relative">
                    {/* Sidebar */}
                    <div className={`fixed inset-y-0 left-0 w-64 bg-info-box z-50 transform transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-lg`}>
                        <div className="p-4 font-patrick-hand">
                            <h2 className="text-2xl font-bold text-add-idea">My Baking Hub</h2>
                            <div className="text-sm text-app-grey mt-1 mb-4 truncate">{user.displayName || user.email}</div>
                            <nav className="flex flex-col space-y-2 font-montserrat">
                                <button onClick={() => navigate('dashboard')} className="text-left p-2 rounded-lg hover:bg-light-peach">Dashboard</button>
                                <button onClick={() => navigate('ideapad')} className="text-left p-2 rounded-lg hover:bg-light-peach">Idea Pad</button>
                                <button onClick={() => navigate('journal')} className="text-left p-2 rounded-lg hover:bg-light-peach">My Journal</button>
                                <button onClick={() => navigate('cookbook')} className="text-left p-2 rounded-lg hover:bg-light-peach">My Cookbook</button>
                            </nav>
                            <div className="absolute bottom-0 left-0 w-full p-4">
                                <button onClick={handleSignOut} className="w-full text-left p-2 rounded-lg hover:bg-light-peach font-montserrat">Sign Out</button>
                            </div>
                        </div>
                    </div>
                    {/* Overlay */}
                    {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>}

                    <header className="bg-app-white shadow-md sticky top-0 z-30 font-patrick-hand">
                        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                            <button onClick={() => setIsSidebarOpen(true)} className="text-add-idea">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                            </button>
                            <button onClick={() => setView('dashboard')} className="text-2xl font-bold text-add-idea">Baking Antics</button>
                            <div className="w-8"></div> {/* Placeholder for alignment */}
                        </nav>
                    </header>
                    <main className="flex-grow overflow-y-auto bg-app-white">{renderView()}</main>
                    
                    {/* Modals triggered from Dashboard */}
                    {isAddJournalModalOpen && <JournalEntryForm isNew={true} cookbook={cookbook} onSave={async (data) => { await addJournalEntry(data); setIsAddJournalModalOpen(false); }} onCancel={() => setIsAddJournalModalOpen(false)} />}
                    {isAddIdeaModalOpen && <IdeaForm onSave={async (data) => { await addIdea(data); setIsAddIdeaModalOpen(false); }} onCancel={() => setIsAddIdeaModalOpen(false)} />}
                </div>
            </div>
        </div>
    );
}
