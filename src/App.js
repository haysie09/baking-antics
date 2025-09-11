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
    const [recipeToEdit, setRecipeToEdit] = useState(null); 

    const handleSignOut = () => signOut(auth);
    const navigate = (newView) => setView(newView);
    
    const openAddRecipeFlow = () => {
        setIsCreateModalOpen(false);
        setIsAddRecipeChoiceModalOpen(true);
    };

    const openIdeaModal = () => { setIsCreateModalOpen(false); setIsAddIdeaModalOpen(true); };
    const openBakeModal = () => { setIsCreateModalOpen(false); setIsAddJournalModalOpen(true); };
    const openScheduleModal = () => { setIsCreateModalOpen(false); setIsAddUpcomingBakeModalOpen(true); };

    const handleOpenManualRecipeForm = () => {
        setIsAddRecipeChoiceModalOpen(false);
        setRecipeToEdit(null);
        setIsAddRecipeModalOpen(true);
    };

    const handleOpenURLImportModal = () => {
        setIsAddRecipeChoiceModalOpen(false);
        setIsAddFromURLModalOpen(true);
    };
    
    const handleSaveFromURL = async (recipeData) => {
        const newRecipe = await addRecipe(recipeData);
        setIsAddFromURLModalOpen(false);
        if (newRecipe) {
            setRecipeToEdit(newRecipe);
            setIsAddRecipeModalOpen(true);
        }
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
                    onAddRecipe={openAddRecipeFlow}
                    onEditRecipe={handleEditRecipe}
                />;
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
                    deleteUpcomingBake={deleteUpcomingBake} 
                    cookbook={cookbook} 
                    openAddChoiceModal={openBakeModal}
                    setBakeToView={setBakeToView} 
                    setUpcomingBakeToView={setUpcomingBakeToView} 
                    setUpcomingBakeToEdit={setUpcomingBakeToEdit}
                />;
        }
    };

    return (
        <>
            {/* --- STYLE BLOCK ADDED --- */}
            <style>{`
                :root {
                    --primary-color: #f0425f;
                    --secondary-color: #f3e7e9;
                    --text-primary: #1b0d10;
                    --text-secondary: #9a4c59;
                    --background-color: #fcf8f9;
                    --upcoming-bg: #f8b4c0;
                    --upcoming-card-bg: #fde0e5;
                }
            `}</style>
            <div className="bg-app-white text-app-grey">
                <div className="min-h-screen flex flex-col md:items-center md:justify-center md:py-8 bg-gray-100">
                    <div className="w-full md:max-w-md md:shadow-2xl md:overflow-hidden bg-app-white flex flex-col flex-grow relative">
                        
                        {view === 'dashboard' && (
                            <header className="sticky top-0 z-10 flex items-center bg-[var(--upcoming-bg)] p-4 pb-2 justify-between border-b border-pink-200/50">
                                <div className="flex-1"></div>
                                <h1 className="text-white text-lg font-bold">Baking Antics</h1>
                                <div className="flex-1 text-right">
                                    <button onClick={() => navigate('account')} className="cursor-pointer text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                                    </button>
                                </div>
                            </header>
                        )}
                        
                        <main className="flex-grow overflow-y-auto bg-[var(--background-color)] pb-24">{renderView()}</main>

                        {/* --- ALL MODALS (UNCHANGED) --- */}
                        {isAddJournalModalOpen && <JournalEntryForm isNew={true} cookbook={cookbook} onSave={async (data) => { await addJournalEntry(data); setIsAddJournalModalOpen(false); }} onCancel={() => setIsAddJournalModalOpen(false)} />}
                        {isAddIdeaModalOpen && <IdeaForm onSave={async (data) => { await addIdea(data); setIsAddIdeaModalOpen(false); }} onCancel={() => setIsAddIdeaModalOpen(false)} />}
                        {isAddRecipeModalOpen && <CookbookForm isNew={!recipeToEdit} initialData={recipeToEdit} collections={collections} onSave={handleSaveRecipe} onCancel={() => { setIsAddRecipeModalOpen(false); setRecipeToEdit(null); }} />}
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
        </>
    );
}
