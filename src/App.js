import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase/config';

// --- Components ---
import LoadingSpinner from './components/LoadingSpinner';
import BottomNav from './components/BottomNav';
import CreateNewModal from './components/CreateNewModal';
// import MoveToJournalModal from './components/MoveToJournalModal'; // <-- 1. REMOVED old modal import
import ViewBakeModal from './components/ViewBakeModal';
import ViewUpcomingBakeModal from './components/ViewUpcomingBakeModal';
import ConfirmationModal from './components/ConfirmationModal';

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
    // const [bakeToMove, setBakeToMove] = useState(null); // <-- 2. REMOVED old state
    const [bakeToView, setBakeToView] = useState(null);
    const [entryToEdit, setEntryToEdit] = useState(null);
    const [bakeToDelete, setBakeToDelete] = useState(null);
    
    // <-- 3. ADD new state for opening the journal form with bake data
    const [bakeToJournal, setBakeToJournal] = useState(null);

    const handleSignOut = () => signOut(auth);
    const navigate = (newView) => setView(newView);

    const openRecipeModal = () => { setIsCreateModalOpen(false); setIsAddRecipeModalOpen(true); };
    const openIdeaModal = () => { setIsCreateModalOpen(false); setIsAddIdeaModalOpen(true); };
    const openBakeModal = () => { setIsCreateModalOpen(false); setIsAddJournalModalOpen(true); };
    const openScheduleModal = () => { setIsCreateModalOpen(false); setIsAddUpcomingBakeModalOpen(true); };

    // const handleConfirmMoveToJournal = async (bake) => { ... }; // <-- 4. REMOVED old handler function

    const handleUpdateJournalAndClose = async (id, data) => {
        await updateJournalEntry(id, data);
        setEntryToEdit(null);
    };

    const handleDeleteInitiate = (bake) => {
        setBakeToDelete(bake);
    };

    const handleDeleteConfirm = async () => {
        if (bakeToDelete) {
            await deleteUpcomingBake(bakeToDelete.id);
            setBakeToDelete(null);
            setUpcomingBakeToView(null); 
        }
    };

    const handleDeleteCancel = () => {
        setBakeToDelete(null); 
    };

    // <-- 5. ADD new handlers for the "Move to Journal" workflow
    const handleMoveToJournalInitiate = (bake) => {
        setBakeToJournal(bake);
        setUpcomingBakeToView(null); // Close the details modal
    };

    const handleSaveBakeToJournal = async (journalData) => {
        // First, add the new journal entry
        await addJournalEntry(journalData);
        // Then, delete the original upcoming bake
        await deleteUpcomingBake(bakeToJournal.id);
        // Finally, close the form
        setBakeToJournal(null);
    };


    const renderView = () => {
        switch (view) {
            case 'ideapad': return <IdeaPad ideas={ideaPad} addIdea={addIdea} deleteIdea={deleteIdea} addJournalEntry={addJournalEntry} />;
            case 'journal': return <BakingJournal journal={journal} addJournalEntry={addJournalEntry} updateJournalEntry={updateJournalEntry} deleteJournalEntry={deleteJournalEntry} cookbook={cookbook} dateFilter={dateFilter} setDateFilter={setDateFilter} />;
            case 'cookbook': return <MyCookbook cookbook={cookbook} addRecipe={addRecipe} updateRecipe={updateRecipe} deleteRecipe={deleteRecipe} collections={collections} addCollection={addCollection} updateCollection={updateCollection} deleteCollection={deleteCollection} />;
            case 'account': return <MyAccount user={user} userProfile={userProfile} updateUserProfile={updateUserProfile} />;
            default:
                return <Dashboard 
                    // ... other props are unchanged
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
                    deleteUpcomingBake={deleteUpcomingBake}
                    // setBakeToMove={setBakeToMove} // This prop is no longer needed
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
                    
                    {view === 'dashboard' && (
                        <header className="bg-[#fcf8f9] sticky top-0 z-30 font-sans border-b border-pink-100">
                           {/* Header content is unchanged */}
                            <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                                <button onClick={() => navigate('account')} className="text-[#1b0d10] hover:text-[#f0425f]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </button>
                                <div className="text-xl font-bold text-[#f0425f]">
                                    Baking Antics
                                </div>
                                <div className="w-7"></div>
                            </nav>
                        </header>
                    )}
                    
                    <main className="flex-grow overflow-y-auto bg-app-white pb-24">{renderView()}</main>

                    {/* --- ALL MODALS RENDERED HERE --- */}
                    {isAddJournalModalOpen && <JournalEntryForm isNew={true} cookbook={cookbook} onSave={async (data) => { await addJournalEntry(data); setIsAddJournalModalOpen(false); }} onCancel={() => setIsAddJournalModalOpen(false)} />}
                    {isAddIdeaModalOpen && <IdeaForm onSave={async (data) => { await addIdea(data); setIsAddIdeaModalOpen(false); }} onCancel={() => setIsAddIdeaModalOpen(false)} />}
                    {isAddRecipeModalOpen && <CookbookForm isNew={true} collections={collections} onSave={async (data) => { await addRecipe(data); setIsAddRecipeModalOpen(false);}} onCancel={() => setIsAddRecipeModalOpen(false)} />}
                    {isAddUpcomingBakeModalOpen && <UpcomingBakeForm onSave={async (data) => {await addUpcomingBake(data); setIsAddUpcomingBakeModalOpen(false);}} onCancel={() => setIsAddUpcomingBakeModalOpen(false)} cookbook={cookbook} />}
                    {upcomingBakeToEdit && <UpcomingBakeForm bakeToEdit={upcomingBakeToEdit} onSave={async (data) => {await updateUpcomingBake(upcomingBakeToEdit.id, data); setUpcomingBakeToEdit(null);}} onCancel={() => setUpcomingBakeToEdit(null)} cookbook={cookbook} />}
                    
                    {bakeToView && ( <ViewBakeModal bake={bakeToView.past} upcomingBake={bakeToView.upcoming} onClose={() => setBakeToView(null)} onEdit={(bake, isUpcoming) => { if (isUpcoming) { setUpcomingBakeToEdit(bake); } else { setEntryToEdit(bake); } setBakeToView(null); }} onDeleteUpcoming={(bakeId) => { deleteUpcomingBake(bakeId); setBakeToView(null); }} onMoveToJournal={(bake) => { handleMoveToJournalInitiate(bake); setBakeToView(null); }} /> )}

                    {upcomingBakeToView && (
                        <ViewUpcomingBakeModal 
                            bake={upcomingBakeToView}
                            onClose={() => setUpcomingBakeToView(null)}
                            onEdit={() => { setUpcomingBakeToEdit(upcomingBakeToView); setUpcomingBakeToView(null); }}
                            onDelete={() => handleDeleteInitiate(upcomingBakeToView)}
                            // <-- 6. UPDATE this line to call the new "initiate" function
                            onMoveToJournal={() => handleMoveToJournalInitiate(upcomingBakeToView)}
                        />
                    )}

                    {/* {bakeToMove && ( ... )} */} {/* <-- 7. REMOVED the old MoveToJournalModal */}

                    {entryToEdit && ( <JournalEntryForm entry={entryToEdit} onSave={(data) => handleUpdateJournalAndClose(entryToEdit.id, data)} onCancel={() => setEntryToEdit(null)} cookbook={cookbook} /> )}
                    
                    {bakeToDelete && ( <ConfirmationModal message={`Delete "${bakeToDelete.bakeName}"?`} onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} /> )}

                    {/* <-- 8. ADD the new JournalEntryForm render logic */}
                    {bakeToJournal && (() => {
                        // This function transforms the bake data into the format the journal form expects
                        const journalEntryData = {
                            entryTitle: bakeToJournal.bakeName || '',
                            // Convert Firestore Timestamp to YYYY-MM-DD string for the date input
                            bakingDate: new Date(bakeToJournal.bakeDate.toDate()).toISOString().split('T')[0],
                            personalNotes: bakeToJournal.personalNotes || '',
                            sourceURL: bakeToJournal.link || '',
                            // Default values for new ratings
                            tasteRating: 0,
                            difficultyRating: 0,
                            photoURLs: [],
                            categories: bakeToJournal.categories || [],
                        };

                        return (
                            <JournalEntryForm
                                entry={journalEntryData}
                                onSave={handleSaveBakeToJournal}
                                onCancel={() => setBakeToJournal(null)}
                                cookbook={cookbook}
                                isNew={true} // Treat this as a new entry
                            />
                        );
                    })()}

                    {isCreateModalOpen && <CreateNewModal onClose={() => setIsCreateModalOpen(false)} onAddRecipe={openRecipeModal} onAddIdea={openIdeaModal} onAddBake={openBakeModal} onScheduleBake={openScheduleModal} />}
                    
                    <BottomNav currentView={view} navigate={navigate} onOpenCreateModal={() => setIsCreateModalOpen(true)} />
                </div>
            </div>
        </div>
    );
}