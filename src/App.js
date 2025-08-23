import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase/config';

// --- Components ---
import LoadingSpinner from './components/LoadingSpinner';
import OnboardingTour from './components/OnboardingTour';

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
import { useCollections } from './hooks/useCollections'; // 1. Import the new hook

// --- Welcome Modal ---
const WelcomeModal = ({ onStartTour, onSkip }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 font-patrick-hand">
        <div className="bg-app-white rounded-2xl p-8 w-full max-w-sm shadow-xl text-center space-y-4">
            <h2 className="text-3xl text-burnt-orange">Welcome to Baking Antics!</h2>
            <p className="font-montserrat text-app-grey/80 text-base">
                Would you like a quick tour to see how everything works?
            </p>
            <div className="flex justify-center space-x-4 pt-2">
                <button onClick={onStartTour} className="bg-add-idea text-white py-3 px-8 rounded-xl text-xl font-montserrat">Take a Tour</button>
                <button onClick={onSkip} className="bg-gray-100 text-app-grey py-3 px-8 rounded-xl text-xl font-montserrat">Skip</button>
            </div>
        </div>
    </div>
);


export default function App() {
    const { user, isAuthReady } = useAuth();
    if (!isAuthReady) return <LoadingSpinner />;
    return <>{user ? <MainApp user={user} /> : <AuthPage />}</>;
}


const MainApp = ({ user }) => {
    const [view, setView] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [dateFilter, setDateFilter] = useState(null);
    const [isAddJournalModalOpen, setIsAddJournalModalOpen] = useState(false);
    const [isAddIdeaModalOpen, setIsAddIdeaModalOpen] = useState(false);
    const { userProfile, updateUserProfile } = useUser();
    const { journal, addJournalEntry, updateJournalEntry, deleteJournalEntry } = useJournal();
    const { ideaPad, addIdea, deleteIdea } = useIdeaPad();
    const { cookbook, addRecipe, updateRecipe, deleteRecipe } = useCookbook();
    const { upcomingBakes, addUpcomingBake, updateUpcomingBake, deleteUpcomingBake } = useUpcomingBakes();
    const { collections, addCollection, updateCollection, deleteCollection } = useCollections(); // 2. Use the new hook
    const [showWelcome, setShowWelcome] = useState(false);
    const [showTour, setShowTour] = useState(false);

    useEffect(() => {
        if (userProfile && userProfile.hasCompletedTour === false) {
            setTimeout(() => setShowWelcome(true), 1000);
        }
    }, [userProfile]);

    const handleFinishTour = () => {
        setShowWelcome(false);
        setShowTour(false);
        updateUserProfile({ hasCompletedTour: true });
    };

    const handleStartTour = () => {
        setShowWelcome(false);
        setShowTour(true);
    };

    const handleSignOut = () => signOut(auth);

    const navigate = (newView) => {
        setView(newView);
        setIsSidebarOpen(false);
    };

    const renderView = () => {
        switch (view) {
            case 'ideapad': return <IdeaPad ideas={ideaPad} addIdea={addIdea} deleteIdea={deleteIdea} addJournalEntry={addJournalEntry} />;
            case 'journal': return <BakingJournal journal={journal} addJournalEntry={addJournalEntry} updateJournalEntry={updateJournalEntry} deleteJournalEntry={deleteJournalEntry} cookbook={cookbook} dateFilter={dateFilter} setDateFilter={setDateFilter} />;
            case 'cookbook': 
                // 3. Pass the new collections data and functions down to the MyCookbook page
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
            {showWelcome && <WelcomeModal onStartTour={handleStartTour} onSkip={handleFinishTour} />}
            {showTour && <OnboardingTour onFinish={handleFinishTour} />}
            <div className="min-h-screen flex flex-col md:items-center md:justify-center md:py-8 bg-gray-100">
                <div className="w-full md:max-w-md md:shadow-2xl md:overflow-hidden bg-app-white flex flex-col flex-grow relative">
                    <div className={`fixed inset-y-0 left-0 w-64 bg-info-box z-50 transform transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-lg`}>
                        <div className="p-4 font-patrick-hand">
                            <h2 className="text-2xl font-bold text-add-idea">My Baking Hub</h2>
                            <div className="text-sm text-app-grey mt-1 mb-4 truncate">{userProfile?.displayName || user.email}</div>
                            <nav className="flex flex-col space-y-2 font-montserrat">
                                <button onClick={() => navigate('dashboard')} className="text-left p-2 rounded-lg hover:bg-light-peach">Dashboard</button>
                                <button onClick={() => navigate('ideapad')} className="text-left p-2 rounded-lg hover:bg-light-peach">Idea Pad</button>
                                <button onClick={() => navigate('journal')} className="text-left p-2 rounded-lg hover:bg-light-peach">My Journal</button>
                                <button onClick={() => navigate('cookbook')} className="text-left p-2 rounded-lg hover:bg-light-peach">My Recipes</button>
                                <button onClick={() => navigate('account')} className="text-left p-2 rounded-lg hover:bg-light-peach">My Account</button>
                            </nav>
                            <div className="absolute bottom-0 left-0 w-full p-4">
                                <button onClick={handleSignOut} className="w-full text-left p-2 rounded-lg hover:bg-light-peach font-montserrat">Sign Out</button>
                            </div>
                        </div>
                    </div>
                    {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>}
                    <header className="bg-app-white shadow-md sticky top-0 z-30 font-patrick-hand">
                        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                            <button onClick={() => setIsSidebarOpen(true)} className="text-add-idea">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                            </button>
                            <button onClick={() => setView('dashboard')} className="text-2xl font-bold text-add-idea">Baking Antics</button>
                            <div className="w-8"></div>
                        </nav>
                    </header>
                    <main className="flex-grow overflow-y-auto bg-app-white">{renderView()}</main>
                    {isAddJournalModalOpen && <JournalEntryForm isNew={true} cookbook={cookbook} onSave={async (data) => { await addJournalEntry(data); setIsAddJournalModalOpen(false); }} onCancel={() => setIsAddJournalModalOpen(false)} />}
                    {isAddIdeaModalOpen && <IdeaForm onSave={async (data) => { await addIdea(data); setIsAddIdeaModalOpen(false); }} onCancel={() => setIsAddIdeaModalOpen(false)} />}
                </div>
            </div>
        </div>
    );
}
