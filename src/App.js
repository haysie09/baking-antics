// Filename: App.js

import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase/config';

// --- Components ---
import LoadingSpinner from './components/LoadingSpinner';
import BottomNav from './components/BottomNav';
import CreateNewModal from './components/CreateNewModal';
import ViewBakeModal from './components/ViewBakeModal';
import ViewUpcomingBakeModal from './components/ViewUpcomingBakeModal';
import ConfirmationModal from './components/ConfirmationModal';
import AddRecipeChoiceModal from './components/AddRecipeChoiceModal';
import AddFromURLModal from './components/AddFromURLModal';

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
    const [bakeToView, setBakeToView] = useState(null);
    const [entryToEdit, setEntryToEdit] = useState(null);
    const [bakeToDelete, setBakeToDelete] = useState(null);
    const [bakeToJournal, setBakeToJournal] = useState(null);
    const [isAddRecipeChoiceModalOpen, setIsAddRecipeChoiceModalOpen] = useState(false);
    const [isAddFromURLModalOpen, setIsAddFromURLModalOpen] = useState(false);
    const [recipeToEdit, setRecipeToEdit] = useState(null); // New state for editing recipes

    const handleSignOut = () => signOut(auth);
    const navigate = (newView) => setView(newView);
    
    // This is the main function to start the add recipe flow
    const openAddRecipeFlow = () => {
        setIsCreateModalOpen(false); // Ensure create modal is closed if open
        setIsAddRecipeChoiceModalOpen(true);
    };

    const openIdeaModal = () => { setIsCreateModalOpen(false); setIsAddIdeaModalOpen(true); };
    const openBakeModal = () => { setIsCreateModalOpen(false); setIsAddJournalModalOpen(true); };
    const openScheduleModal = () => { setIsCreateModalOpen(false); setIsAddUpcomingBakeModalOpen(true); };

    const handleOpenManualRecipeForm = () => {
        setIsAddRecipeChoiceModalOpen(false);
        setRecipeToEdit(null); // Ensure we're not in edit mode
        setIsAddRecipeModalOpen(true);
    };

    const handleOpenURLImportModal = () => {
        setIsAddRecipeChoiceModalOpen(false);
        setIsAddFromURLModalOpen(true);
    };
    
    const handleSaveFromURL = async (recipeData) => {
        await addRecipe(recipeData);
        setIsAddFromURLModalOpen(false);
    };

    const handleEditRecipe = (recipe) => {
        setRecipeToEdit(recipe);
        setIsAddRecipeModalOpen(true);
    };

    const handleSaveRecipe = async (data) => {
        if (recipeToEdit) {
            await updateRecipe(recipeToEdit.id, data);
        } else {
            await addRecipe(data);
        }
        setIsAddRecipeModalOpen(false);
        setRecipeToEdit(null);
    };

    // --- Other handlers remain unchanged ---
    const handleUpdateJournalAndClose = async (id, data) => { await updateJournalEntry(id, data); setEntryToEdit(null); };
    const handleDeleteInitiate = (bake) => { setBakeToDelete(bake); };
    const handleDeleteConfirm = async () => { if (bakeToDelete) { await deleteUpcomingBake(bakeToDelete.id); setBakeToDelete(null); setUpcomingBakeToView(null); } };
    const handleDeleteCancel = () => { setBakeToDelete(null); };
    const handleMoveToJournalInitiate = (bake) => { setBakeToJournal(bake); setUpcomingBakeToView(null); };
    const handleSaveBakeToJournal = async (journalData) => { await addJournalEntry(journalData); await deleteUpcomingBake(bakeToJournal.id); setBakeToJournal(null); };


    const renderView = () => {
        switch (view) {
            case 'ideapad': return <IdeaPad ideas={ideaPad} addIdea={addIdea} deleteIdea={deleteIdea} addJournalEntry={addJournalEntry} />;
            case 'journal': return <BakingJournal journal={journal} addJournalEntry={addJournalEntry} updateJournalEntry={updateJournalEntry} deleteJournalEntry={deleteJournalEntry} cookbook={cookbook} dateFilter={dateFilter} setDateFilter={setDateFilter} />;
            case 'cookbook': 
                return <MyCookbook 
                    cookbook={cookbook} 
                    updateRecipe={updateRecipe} 
                    deleteRecipe={deleteRecipe} 
                    collections={collections} 
                    addCollection={addCollection} 
                    updateCollection={updateCollection} 
                    deleteCollection={deleteCollection} 
                    // Pass the new global functions as props
                    onAddRecipe={openAddRecipeFlow}
                    onEditRecipe={handleEditRecipe}
                />;
            case 'account': return <MyAccount user={user} userProfile={userProfile} updateUserProfile={updateUserProfile} />;
            default:
                return <Dashboard 
                    setView={setView} ideaPad={ideaPad} addJournalEntry={addJournalEntry} addIdea={addIdea} deleteIdea={deleteIdea} journal={journal} setDateFilter={setDateFilter} openScheduleModal={openScheduleModal}
                    upcomingBakes={upcomingBakes} updateUpcomingBake={updateUpcomingBake} deleteUpcomingBake={deleteUpcomingBake} cookbook={cookbook} openAddChoiceModal={openBakeModal}
                    setBakeToView={setBakeToView} setUpcomingBakeToView={setUpcomingBakeToView} setUpcomingBakeToEdit={setUpcomingBakeToEdit}
                />;
        }
    };

    return (
        <div className="bg-app-white text-app-grey">
            <div className="min-h-screen flex flex-col md:items-center md:justify-center md:py-8 bg-gray-100">
                <div className="w-full md:max-w-md md:shadow-2xl md:overflow-hidden bg-app-white flex flex-col flex-grow relative">
                    {view === 'dashboard' && ( <header className="bg-[#fcf8f9] sticky top-0 z-30 font-sans border-b border-pink-100"> <nav className="container mx-auto px-4 py-3 flex justify-between items-center"> <button onClick={() => navigate('account')} className="text-[#1b0d10] hover:text-[#f0425f]"> <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> </svg> </button> <div className="text-xl font-bold text-[#f0425f]"> Baking Antics </div> <div className="w-7"></div> </nav> </header> )}
                    
                    <main className="flex-grow overflow-y-auto bg-app-white pb-24">{renderView()}</main>

                    {/* --- ALL MODALS RENDERED HERE --- */}
                    {isAddJournalModalOpen && <JournalEntryForm isNew={true} cookbook={cookbook} onSave={async (data) => { await addJournalEntry(data); setIsAddJournalModalOpen(false); }} onCancel={() => setIsAddJournalModalOpen(false)} />}
                    {isAddIdeaModalOpen && <IdeaForm onSave={async (data) => { await addIdea(data); setIsAddIdeaModalOpen(false); }} onCancel={() => setIsAddIdeaModalOpen(false)} />}
                    
                    {/* Updated CookbookForm to handle both New and Edit states */}
                    {isAddRecipeModalOpen && <CookbookForm 
                        isNew={!recipeToEdit}
                        initialData={recipeToEdit}
                        collections={collections} 
                        onSave={handleSaveRecipe}
                        onCancel={() => { setIsAddRecipeModalOpen(false); setRecipeToEdit(null); }} 
                    />}

                    {isAddUpcomingBakeModalOpen && <UpcomingBakeForm onSave={async (data) => {await addUpcomingBake(data); setIsAddUpcomingBakeModalOpen(false);}} onCancel={() => setIsAddUpcomingBakeModalOpen(false)} cookbook={cookbook} />}
                    {upcomingBakeToEdit && <UpcomingBakeForm bakeToEdit={upcomingBakeToEdit} onSave={async (data) => {await updateUpcomingBake(upcomingBakeToEdit.id, data); setUpcomingBakeToEdit(null);}} onCancel={() => setUpcomingBakeToEdit(null)} cookbook={cookbook} />}
                    {bakeToView && ( <ViewBakeModal bake={bakeToView.past} upcomingBake={bakeToView.upcoming} onClose={() => setBakeToView(null)} onEdit={(bake, isUpcoming) => { if (isUpcoming) { setUpcomingBakeToEdit(bake); } else { setEntryToEdit(bake); } setBakeToView(null); }} onDeleteUpcoming={(bakeId) => { deleteUpcomingBake(bakeId); setBakeToView(null); }} onMoveToJournal={(bake) => { handleMoveToJournalInitiate(bake); setBakeToView(null); }} /> )}
                    {upcomingBakeToView && ( <ViewUpcomingBakeModal  bake={upcomingBakeToView} onClose={() => setUpcomingBakeToView(null)} onEdit={() => { setUpcomingBakeToEdit(upcomingBakeToView); setUpcomingBakeToView(null); }} onDelete={() => handleDeleteInitiate(upcomingBakeToView)} onMoveToJournal={() => handleMoveToJournalInitiate(upcomingBakeToView)} /> )}
                    {entryToEdit && ( <JournalEntryForm entry={entryToEdit} onSave={(data) => handleUpdateJournalAndClose(entryToEdit.id, data)} onCancel={() => setEntryToEdit(null)} cookbook={cookbook} /> )}
                    {bakeToDelete && ( <ConfirmationModal message={`Delete "${bakeToDelete.bakeName}"?`} onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} /> )}
                    {bakeToJournal && (() => { const bakeDateObject = bakeToJournal.bakeDate?.toDate ? bakeToJournal.bakeDate.toDate() : new Date(bakeToJournal.bakeDate); const journalEntryData = { entryTitle: bakeToJournal.bakeName || '', bakingDate: bakeDateObject.toISOString().split('T')[0], personalNotes: bakeToJournal.personalNotes || '', sourceURL: bakeToJournal.link || '', tasteRating: 0, difficultyRating: 0, photoURLs: [], categories: bakeToJournal.categories || [], }; return ( <JournalEntryForm entry={journalEntryData} onSave={handleSaveBakeToJournal} onCancel={() => setBakeToJournal(null)} cookbook={cookbook} isNew={true} /> ); })()}
                    
                    {isAddRecipeChoiceModalOpen && ( <AddRecipeChoiceModal onManual={handleOpenManualRecipeForm} onImport={handleOpenURLImportModal} onCancel={() => setIsAddRecipeChoiceModalOpen(false)} /> )}
                    {isAddFromURLModalOpen && ( <AddFromURLModal onSave={handleSaveFromURL} onCancel={() => setIsAddFromURLModalOpen(false)} /> )}
                    {isCreateModalOpen && <CreateNewModal onClose={() => setIsCreateModalOpen(false)} onAddRecipe={openAddRecipeFlow} onAddIdea={openIdeaModal} onAddBake={openBakeModal} onScheduleBake={openScheduleModal} />}
                    
                    <BottomNav currentView={view} navigate={navigate} onOpenCreateModal={() => setIsCreateModalOpen(true)} />
                </div>
            </div>
        </div>
    );
}