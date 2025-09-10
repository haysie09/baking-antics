// Filename: App.js

import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase/config';

// ... (all other imports remain the same)
import LoadingSpinner from './components/LoadingSpinner';
import BottomNav from './components/BottomNav';
import CreateNewModal from './components/CreateNewModal';
import MoveToJournalModal from './components/MoveToJournalModal';
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
import ViewUpcomingBakeModal from './components/ViewUpcomingBakeModal';
import ViewBakeModal from './components/ViewBakeModal';
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
    // ... (all state and hooks remain the same)
    const [view, setView] = useState('dashboard');
    const [dateFilter, setDateFilter] = useState(null);
    const { userProfile, updateUserProfile } = useUser();
    const { journal, addJournalEntry, updateJournalEntry, deleteJournalEntry } = useJournal();
    const { ideaPad, addIdea, deleteIdea } = useIdeaPad();
    const { cookbook, addRecipe, updateRecipe, deleteRecipe } = useCookbook();
    const { upcomingBakes, addUpcomingBake, updateUpcomingBake, deleteUpcomingBake } = useUpcomingBakes();
    const { collections, addCollection, updateCollection, deleteCollection } = useCollections();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAddJournalModalOpen, setIsAddJournalModalOpen] = useState(false);
    const [isAddIdeaModalOpen, setIsAddIdeaModalOpen] = useState(false);
    const [isAddRecipeModalOpen, setIsAddRecipeModalOpen] = useState(false);
    const [isAddUpcomingBakeModalOpen, setIsAddUpcomingBakeModalOpen] = useState(false);
    const [upcomingBakeToView, setUpcomingBakeToView] = useState(null);
    const [upcomingBakeToEdit, setUpcomingBakeToEdit] = useState(null);
    const [bakeToMove, setBakeToMove] = useState(null);
    const [bakeToView, setBakeToView] = useState(null);

    const handleSignOut = () => signOut(auth);
    const navigate = (newView) => setView(newView);
    const openRecipeModal = () => { setIsCreateModalOpen(false); setIsAddRecipeModalOpen(true); };
    const openIdeaModal = () => { setIsCreateModalOpen(false); setIsAddIdeaModalOpen(true); };
    const openBakeModal = () => { setIsCreateModalOpen(false); setIsAddJournalModalOpen(true); };
    const openScheduleModal = () => { setIsCreateModalOpen(false); setIsAddUpcomingBakeModalOpen(true); };

    const handleConfirmMoveToJournal = async (bake) => {
        if (!bake) return;
        const newEntry = {
            entryTitle: bake.bakeName || bake.title,
            bakingDate: bake.bakeDate,
            personalNotes: bake.notes || '',
            sourceURL: bake.link || '',
            createdAt: new Date(),
            tasteRating: 0, difficultyRating: 0, photoURLs: [], categories: [],
        };
        await addJournalEntry(newEntry);
        await deleteUpcomingBake(bake.id);
        setBakeToMove(null);
        setUpcomingBakeToView(null);
        setBakeToView(null);
    };

    const renderView = () => {
        switch (view) {
            // ... (other cases are the same)
            default:
                // UPDATED: Pass all necessary props to Dashboard
                return <Dashboard 
                    setView={setView} 
                    ideaPad={ideaPad} 
                    addJournalEntry={addJournalEntry} 
                    addIdea={addIdea} 
                    deleteIdea={deleteIdea} 
                    journal={journal} 
                    setDateFilter={setDateFilter} 
                    openScheduleModal={openScheduleModal}
                    upcomingBakes={upcomingBakes} 
                    updateUpcomingBake={updateUpcomingBake} 
                    deleteUpcomingBake={deleteUpcomingBake} // Pass delete function
                    setBakeToMove={setBakeToMove} // Pass function to trigger move modal
                    cookbook={cookbook}
                    openAddChoiceModal={openBakeModal}
                    setBakeToView={setBakeToView}
                    setUpcomingBakeToView={setUpcomingBakeToView}
                    setUpcomingBakeToEdit={setUpcomingBakeToEdit}
                />;
        }
    };

    return (
        <div className="bg-app-white text-app-grey">
            <div className="min-h-screen flex flex-col md:items-center md:justify-center md:py-8 bg-gray-100">
                <div className="w-full md:max-w-md md:shadow-2xl md:overflow-hidden bg-app-white flex flex-col flex-grow relative">
                    {/* ... (header and main content are the same) */}
                    
                    {/* --- ALL MODALS RENDERED HERE --- */}
                    {upcomingBakeToView && (
                        <ViewUpcomingBakeModal 
                            bake={upcomingBakeToView}
                            onClose={() => setUpcomingBakeToView(null)}
                            onEdit={() => { setUpcomingBakeToEdit(upcomingBakeToView); setUpcomingBakeToView(null); }}
                            onDelete={() => { deleteUpcomingBake(upcomingBakeToView.id); setUpcomingBakeToView(null); }}
                            onMoveToJournal={() => { setBakeToMove(upcomingBakeToView); setUpcomingBakeToView(null); }}
                        />
                    )}

                    {bakeToView && (
                        <ViewBakeModal
                            bake={bakeToView.past}
                            upcomingBake={bakeToView.upcoming}
                            onClose={() => setBakeToView(null)}
                            onEdit={(bake, isUpcoming) => {
                                if (isUpcoming) {
                                    setUpcomingBakeToEdit(bake);
                                } else {
                                    setView('journal');
                                    setDateFilter(bake.bakingDate);
                                }
                                setBakeToView(null);
                            }}
                            onDeleteUpcoming={(bakeId) => { deleteUpcomingBake(bakeId); setBakeToView(null); }}
                            onMoveToJournal={(bake) => { setBakeToMove(bake); setBakeToView(null); }}
                        />
                    )}

                    {bakeToMove && (
                        <MoveToJournalModal
                            bake={bakeToMove}
                            onConfirm={() => handleConfirmMoveToJournal(bakeToMove)}
                            onCancel={() => setBakeToMove(null)}
                        />
                    )}
                    
                    {/* ... (other modals are the same) */}
                    
                    <BottomNav currentView={view} navigate={navigate} onOpenCreateModal={() => setIsCreateModalOpen(true)} />
                </div>
            </div>
        </div>
    );
}