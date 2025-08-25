import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase/config';

// --- Components ---
import LoadingSpinner from './components/LoadingSpinner';
import BottomNav from './components/BottomNav';

// --- Pages ---
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import IdeaPad from './pages/IdeaPad';
import BakingJournal from './pages/BakingJournal';
import MyCookbook from './pages/MyCookbook';
import MyAccount from './pages/MyAccount';
import JournalEntryForm from './pages/JournalEntryForm';
import IdeaForm from './pages/IdeaForm';

// --- Hooks ---
import { useAuth } from './hooks/useAuth';
import { useUser } from './hooks/useUser';
import { useJournal } from './hooks/useJournal';
import { useIdeaPad } from './hooks/useIdeaPad';
import { useCookbook } from './hooks/useCookbook';
import { useUpcomingBakes } from './hooks/useUpcomingBakes';
import { useCollections } from './hooks/useCollections';

// REMOVED: The WelcomeModal component is no longer needed

export default function App() {
    const { user, isAuthReady } = useAuth();
    if (!isAuthReady) return <LoadingSpinner />;
    return <>{user ? <MainApp user={user} /> : <AuthPage />}</>;
}


const MainApp = ({ user }) => {
    const [view, setView] = useState('dashboard');
    const [dateFilter, setDateFilter] = useState(null);
    const [isAddJournalModalOpen, setIsAddJournalModalOpen] = useState(false);
    const [isAddIdeaModalOpen, setIsAddIdeaModalOpen] = useState(false);
    const { userProfile, updateUserProfile } = useUser();
    const { journal, addJournalEntry, updateJournalEntry, deleteJournalEntry } = useJournal();
    const { ideaPad, addIdea, deleteIdea } = useIdeaPad();
    const { cookbook, addRecipe, updateRecipe, deleteRecipe } = useCookbook();
    const { upcomingBakes, addUpcomingBake, updateUpcomingBake, deleteUpcomingBake } = useUpcomingBakes();
    const { collections, addCollection, updateCollection, deleteCollection } = useCollections();
    
    // REMOVED: showWelcome and showTour states

    // REMOVED: useEffect for the tour
    // REMOVED: handleFinishTour and handleStartTour functions

    const handleSignOut = () => signOut(auth);

    const navigate = (newView) => {
        setView(newView);
    };

    const renderView = () => {
        switch (view) {
            case 'ideapad': return <IdeaPad ideas={ideaPad} addIdea={addIdea} deleteIdea={deleteIdea} addJournalEntry={addJournalEntry} />;
            case 'journal': return <BakingJournal journal={journal} addJournalEntry={addJournalEntry} updateJournalEntry={updateJournalEntry} deleteJournalEntry={deleteJournalEntry} cookbook={cookbook} dateFilter={dateFilter} setDateFilter={setDateFilter} />;
            case 'cookbook': 
                return <MyCookbook 
                    cookbook={cookbook} 
                    addRecipe={addRecipe} 
                    updateRecipe={updateRecipe} 
                    deleteRecipe={deleteRecipe}
                    collections={collections}
                    addCollection={addCollection}
                    updateCollection={updateCollection}
                    deleteCollection={deleteCollection}
                />;
            case 'account': return <MyAccount user={user} userProfile={userProfile} updateUserProfile={updateUserProfile} />;
            default:
                return <Dashboard 
                    setView={setView} ideaPad={ideaPad} addIdea={addIdea} deleteIdea={deleteIdea} userId={user.uid} journal={journal} 
                    addJournalEntry={addJournalEntry} updateJournalEntry={updateJournalEntry} setDateFilter={setDateFilter} 
                    openAddJournalModal={() => setIsAddJournalModalOpen(true)} openAddIdeaModal={() => setIsAddIdeaModalOpen(true)}
                    upcomingBakes={upcomingBakes} addUpcomingBake={addUpcomingBake} updateUpcomingBake={updateUpcomingBake} 
                    deleteUpcomingBake={deleteUpcomingBake} cookbook={cookbook} addRecipe={addRecipe} updateRecipe={updateRecipe} deleteRecipe={deleteRecipe}
                />;
        }
    };

    return (
        <div className="bg-app-white text-app-grey">
            {/* REMOVED: WelcomeModal and OnboardingTour components */}
            <div className="min-h-screen flex flex-col md:items-center md:justify-center md:py-8 bg-gray-100">
                <div className="w-full md:max-w-md md:shadow-2xl md:overflow-hidden bg-app-white flex flex-col flex-grow relative">
                    
                    <header className="bg-app-white shadow-md sticky top-0 z-30 font-patrick-hand">
                        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                            <button onClick={() => navigate('account')} className="text-add-idea">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </button>
                            <button onClick={() => setView('dashboard')} className="text-2xl font-bold text-add-idea">Baking Antics</button>
                            <div className="w-8"></div>
                        </nav>
                    </header>
                    
                    <main className="flex-grow overflow-y-auto bg-app-white pb-16">{renderView()}</main>
                    
                    {isAddJournalModalOpen && <JournalEntryForm isNew={true} cookbook={cookbook} onSave={async (data) => { await addJournalEntry(data); setIsAddJournalModalOpen(false); }} onCancel={() => setIsAddJournalModalOpen(false)} />}
                    {isAddIdeaModalOpen && <IdeaForm onSave={async (data) => { await addIdea(data); setIsAddIdeaModalOpen(false); }} onCancel={() => setIsAddIdeaModalOpen(false)} />}
                    
                    <BottomNav currentView={view} navigate={navigate} />
                </div>
            </div>
        </div>
    );
}