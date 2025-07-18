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
    // ADD THIS LINE
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
                // UPDATE THIS COMPONENT'S PROPS
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
                    // ADD THESE PROPS
                    upcomingBakes={upcomingBakes}
                    addUpcomingBake={addUpcomingBake}
                    updateUpcomingBake={updateUpcomingBake}
                    deleteUpcomingBake={deleteUpcomingBake}
                />;
        }
    };

    return (
        // ... the rest of your MainApp JSX remains the same
        <div className="bg-app-white text-app-grey">
            {/*...*/}
        </div>
    );
}