import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase/config';

// --- Components ---
import LoadingSpinner from './components/LoadingSpinner';
import BottomNav from './components/BottomNav';
import CreateNewModal from './components/CreateNewModal';
import MoveToJournalModal from './components/MoveToJournalModal'; // Import new modal

// --- Pages ---
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import IdeaPad from './pages/IdeaPad';
import BakingJournal from './pages/BakingJournal';
import MyCookbook from './pages/MyCookbook';
import MyAccount from './pages/MyAccount';
import JournalEntryForm from './pages/JournalEntryForm';
import IdeaForm from './pages/IdeaForm';
import CookbookForm from './pages/CookbookForm';
import UpcomingBakeForm from './pages/UpcomingBakeForm';
import ViewUpcomingBakeModal from './components/ViewUpcomingBakeModal'; // Ensure this is imported

// --- Hooks ---
import { useAuth } from './hooks/useAuth';
import { useUser } from './hooks/useUser';
import { useJournal } from './hooks/useJournal';
import { useIdeaPad } from './hooks/useIdeaPad';
import { useCookbook } from './hooks/useCookbook';
import { useUpcomingBakes } from './hooks/useUpcomingBakes';
import { useCollections } from './hooks/useCollections';


export default function App() {
    const { user, isAuthReady } = useAuth();
    if (!isAuthReady) return <LoadingSpinner />;
    return <>{user ? <MainApp user={user} /> : <AuthPage />}</>;
}


const MainApp = ({ user }) => {
    const [view, setView] = useState('dashboard');
    const [dateFilter, setDateFilter] = useState(null);
    const { userProfile, updateUserProfile } = useUser();
    const { journal, addJournalEntry, updateJournalEntry, deleteJournalEntry } = useJournal();
    const { ideaPad, addIdea, deleteIdea } = useIdeaPad();
    const { cookbook, addRecipe, updateRecipe, deleteRecipe } = useCookbook();
    const { upcomingBakes, addUpcomingBake, updateUpcomingBake, deleteUpcomingBake } = useUpcomingBakes();
    const { collections, addCollection, updateCollection, deleteCollection } = useCollections();

    // State for modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAddJournalModalOpen, setIsAddJournalModalOpen] = useState(false);
    const [isAddIdeaModalOpen, setIsAddIdeaModalOpen] = useState(false);
    const [isAddRecipeModalOpen, setIsAddRecipeModalOpen] = useState(false);
    const [isAddUpcomingBakeModalOpen, setIsAddUpcomingBakeModalOpen] = useState(false);
    const [bakeToMove, setBakeToMove] = useState(null); // State for the new modal
    const [upcomingBakeToView, setUpcomingBakeToView] = useState(null);
    const [upcomingBakeToEdit, setUpcomingBakeToEdit] = useState(null);

    const handleSignOut = () => signOut(auth);
    const navigate = (newView) => setView(newView);

    // Functions to open each specific modal
    const openRecipeModal = () => { setIsCreateModalOpen(false); setIsAddRecipeModalOpen(true); };
    const openIdeaModal = () => { setIsCreateModalOpen(false); setIsAddIdeaModalOpen(true); };
    const openBakeModal = () => { setIsCreateModalOpen(false); setIsAddJournalModalOpen(true); };
    const openScheduleModal = () => { setIsCreateModalOpen(false); setIsAddUpcomingBakeModalOpen(true); };

    // Function to handle moving a bake to the journal
    const handleConfirmMoveToJournal = async () => {
        if (!bakeToMove) return;
        const newEntry = {
            entryTitle: bakeToMove.bakeName,
            bakingDate: bakeToMove.bakeDate,
            personalNotes: bakeToMove.notes || '',
            sourceURL: bakeToMove.link || '',
            createdAt: new Date(),
            tasteRating: 0, difficultyRating: 0, photoURLs: [], categories: [],
        };
        await addJournalEntry(newEntry);
        await deleteUpcomingBake(bakeToMove.id);
        setBakeToMove(null);
        setUpcomingBakeToView(null);
    };

    const renderView = () => {
        switch (view) {
            // ... other cases
            default:
                return <Dashboard 
                    // ... other props
                    setUpcomingBakeToView={setUpcomingBakeToView}
                    setUpcomingBakeToEdit={setUpcomingBakeToEdit}
                />;
        }
    };

    return (
        <div className="bg-app-white text-app-grey">
            <div className="min-h-screen flex flex-col md:items-center md:justify-center md:py-8 bg-gray-100">
                <div className="w-full md:max-w-md md:shadow-2xl md:overflow-hidden bg-app-white flex flex-col flex-grow relative">
                    {/* ... header ... */}
                    <main className="flex-grow overflow-y-auto bg-app-white pb-24">{renderView()}</main>

                    {/* --- ALL MODALS RENDERED HERE --- */}
                    {isAddJournalModalOpen && <JournalEntryForm /* ... */ />}
                    {isAddIdeaModalOpen && <IdeaForm /* ... */ />}
                    {isAddRecipeModalOpen && <CookbookForm /* ... */ />}
                    {isAddUpcomingBakeModalOpen && <UpcomingBakeForm /* ... */ />}
                    {upcomingBakeToEdit && <UpcomingBakeForm bakeToEdit={upcomingBakeToEdit} onSave={async (data) => {await updateUpcomingBake(upcomingBakeToEdit.id, data); setUpcomingBakeToEdit(null);}} onCancel={() => setUpcomingBakeToEdit(null)} cookbook={cookbook} />}

                    {upcomingBakeToView && (
                        <ViewUpcomingBakeModal 
                            bake={upcomingBakeToView}
                            onClose={() => setUpcomingBakeToView(null)}
                            onEdit={() => { setUpcomingBakeToEdit(upcomingBakeToView); setUpcomingBakeToView(null); }}
                            onDelete={() => { deleteUpcomingBake(upcomingBakeToView.id); setUpcomingBakeToView(null); }}
                            onMoveToJournal={() => setBakeToMove(upcomingBakeToView)}
                        />
                    )}

                    {bakeToMove && (
                        <MoveToJournalModal
                            bake={bakeToMove}
                            onConfirm={handleConfirmMoveToJournal}
                            onCancel={() => setBakeToMove(null)}
                        />
                    )}

                    {isCreateModalOpen && <CreateNewModal /* ... */ />}
                    <BottomNav currentView={view} navigate={navigate} onOpenCreateModal={() => setIsCreateModalOpen(true)} />
                </div>
            </div>
        </div>
    );
}