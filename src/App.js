import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase/config';

// --- Components ---
import LoadingSpinner from './components/LoadingSpinner';
import BottomNav from './components/BottomNav';
import CreateNewModal from './components/CreateNewModal';
import MoveToJournalModal from './components/MoveToJournalModal';

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
import ViewUpcomingBakeModal from './components/ViewUpcomingBakeModal';
import ViewBakeModal from './components/ViewBakeModal'; // Make sure this is imported

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

    // State for ALL modals is managed here
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
            case 'ideapad': return <IdeaPad ideas={ideaPad} addIdea={addIdea} deleteIdea={deleteIdea} addJournalEntry={addJournalEntry} />;
            case 'journal': return <BakingJournal journal={journal} addJournalEntry={addJournalEntry} updateJournalEntry={updateJournalEntry} deleteJournalEntry={deleteJournalEntry} cookbook={cookbook} dateFilter={dateFilter} setDateFilter={setDateFilter} />;
            case 'cookbook': return <MyCookbook cookbook={cookbook} addRecipe={addRecipe} updateRecipe={updateRecipe} deleteRecipe={deleteRecipe} collections={collections} addCollection={addCollection} updateCollection={updateCollection} deleteCollection={deleteCollection} />;
            case 'account': return <MyAccount user={user} userProfile={userProfile} updateUserProfile={updateUserProfile} />;
            default:
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
                    {view === 'dashboard' && ( <header>...</header> )}
                    <main className="flex-grow overflow-y-auto bg-app-white pb-24">{renderView()}</main>

                    {/* --- ALL MODALS RENDERED HERE --- */}
                    {isAddJournalModalOpen && <JournalEntryForm isNew={true} cookbook={cookbook} onSave={async (data) => { await addJournalEntry(data); setIsAddJournalModalOpen(false); }} onCancel={() => setIsAddJournalModalOpen(false)} />}
                    {isAddIdeaModalOpen && <IdeaForm onSave={async (data) => { await addIdea(data); setIsAddIdeaModalOpen(false); }} onCancel={() => setIsAddIdeaModalOpen(false)} />}
                    {isAddRecipeModalOpen && <CookbookForm isNew={true} collections={collections} onSave={async (data) => { await addRecipe(data); setIsAddRecipeModalOpen(false);}} onCancel={() => setIsAddRecipeModalOpen(false)} />}
                    {isAddUpcomingBakeModalOpen && <UpcomingBakeForm onSave={async (data) => {await addUpcomingBake(data); setIsAddUpcomingBakeModalOpen(false);}} onCancel={() => setIsAddUpcomingBakeModalOpen(false)} cookbook={cookbook} />}
                    {upcomingBakeToEdit && <UpcomingBakeForm bakeToEdit={upcomingBakeToEdit} onSave={async (data) => {await updateUpcomingBake(upcomingBakeToEdit.id, data); setUpcomingBakeToEdit(null);}} onCancel={() => setUpcomingBakeToEdit(null)} cookbook={cookbook} />}
                    
                    {bakeToView && (
                        <ViewBakeModal
                            bake={bakeToView.past}
                            upcomingBake={bakeToView.upcoming}
                            onClose={() => setBakeToView(null)}
                            onEdit={(bake, isUpcoming) => {
                                if (isUpcoming) {
                                    setUpcomingBakeToEdit(bake);
                                } else {
                                    // Handle editing past bake if needed, e.g., navigating to journal
                                    setView('journal');
                                    setDateFilter(bake.bakingDate);
                                }
                                setBakeToView(null);
                            }}
                        />
                    )}

                    {upcomingBakeToView && (
                        <ViewUpcomingBakeModal 
                            bake={upcomingBakeToView}
                            onClose={() => setUpcomingBakeToView(null)}
                            onEdit={() => { setUpcomingBakeToEdit(upcomingBakeToView); setUpcomingBakeToView(null); }}
                            onDelete={() => { deleteUpcomingBake(upcomingBakeToView.id); setUpcomingBakeToView(null); }}
                            onMoveToJournal={() => { setBakeToMove(upcomingBakeToView); setUpcomingBakeToView(null); }}
                        />
                    )}

                    {bakeToMove && (
                        <MoveToJournalModal
                            bake={bakeToMove}
                            onConfirm={handleConfirmMoveToJournal}
                            onCancel={() => setBakeToMove(null)}
                        />
                    )}

                    {isCreateModalOpen && <CreateNewModal 
                        onClose={() => setIsCreateModalOpen(false)}
                        onAddRecipe={openRecipeModal}
                        onAddIdea={openIdeaModal}
                        onAddBake={openBakeModal}
                        onScheduleBake={openScheduleModal}
                    />}
                    
                    <BottomNav currentView={view} navigate={navigate} onOpenCreateModal={() => setIsCreateModalOpen(true)} />
                </div>
            </div>
        </div>
    );
}