import React, { useState, useCallback } from 'react';
import DashboardStats from './DashboardStats';
import BakingCalendar from './BakingCalendar';
import UpcomingBakes from './UpcomingBakes';
import AddBakeChoiceModal from '../components/AddBakeChoiceModal';
import UpcomingBakeForm from './UpcomingBakeForm';
import ViewBakeModal from '../components/ViewBakeModal';
import ViewUpcomingBakeModal from '../components/ViewUpcomingBakeModal';
import masterIdeaList from '../data/masterIdeaList';
import MyCookbook from './MyCookbook';
import AddRecipeChoiceModal from '../components/AddRecipeChoiceModal';
import AddFromURLModal from '../components/AddFromURLModal';
import CookbookForm from './CookbookForm';

const Dashboard = ({ setView, ideaPad, addJournalEntry, addIdea, deleteIdea, userId, journal, setDateFilter, openAddJournalModal, openAddIdeaModal, upcomingBakes, addUpcomingBake, updateUpcomingBake, deleteUpcomingBake, cookbook, addRecipe, updateRecipe, deleteRecipe }) => {
    
    const [isAddChoiceModalOpen, setIsAddChoiceModalOpen] = useState(false);
    const [isAddUpcomingBakeModalOpen, setIsAddUpcomingBakeModalOpen] = useState(false);
    const [bakeToView, setBakeToView] = useState(null);
    const [upcomingBakeToView, setUpcomingBakeToView] = useState(null);
    const [upcomingBakeToEdit, setUpcomingBakeToEdit] = useState(null);
    const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
    const [isRecipeChoiceModalOpen, setIsRecipeChoiceModalOpen] = useState(false);
    const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
    const [isManualRecipeOpen, setIsManualRecipeOpen] = useState(false);
    const [importedRecipeData, setImportedRecipeData] = useState(null);

    const handleOpenPastBakeForm = () => {
        setIsAddChoiceModalOpen(false);
        openAddJournalModal();
    };

    const handleOpenUpcomingBakeForm = () => {
        setIsAddChoiceModalOpen(false);
        setIsAddUpcomingBakeModalOpen(true);
    };

    const handleSaveUpcomingBake = async (bakeData) => {
        await addUpcomingBake(bakeData);
        setIsAddUpcomingBakeModalOpen(false);
    };

    const handleViewBake = (pastBake, upcomingBake) => {
        setBakeToView({ past: pastBake, upcoming: upcomingBake });
    };

    const handleEditFromView = (bake, isUpcoming = false) => {
        if (isUpcoming) {
            setUpcomingBakeToEdit(bake);
        } else {
            setDateFilter(bake.bakingDate);
            setView('journal');
        }
        setBakeToView(null);
    };

    const handleViewUpcomingBake = (bake) => {
        setUpcomingBakeToView(bake);
    };

    const handleEditFromUpcomingView = () => {
        setUpcomingBakeToEdit(upcomingBakeToView);
        setUpcomingBakeToView(null);
    };

    const handleUpdateUpcomingBake = async (bakeData) => {
        if (upcomingBakeToEdit) {
            await updateUpcomingBake(upcomingBakeToEdit.id, bakeData);
        }
        setUpcomingBakeToEdit(null);
    };

    const handleOpenImportModal = () => {
        setIsRecipeChoiceModalOpen(false);
        setIsUrlModalOpen(true);
    };

    const handleOpenManualRecipeForm = () => {
        setIsRecipeChoiceModalOpen(false);
        setIsManualRecipeOpen(true);
    };

    const handleSaveNewRecipe = async (recipeData) => {
        await addRecipe({ ...recipeData, createdAt: new Date() });
        setIsManualRecipeOpen(false);
        setImportedRecipeData(null);
    };

    const handleImportRecipe = async (url) => {
        const functionUrl = `/.netlify/functions/fetch-recipe?url=${encodeURIComponent(url)}`;
        try {
            const response = await fetch(functionUrl);
            const recipeData = await response.json();
            if (!response.ok) {
                throw new Error(recipeData.error || 'An unknown error occurred during import.');
            }
            const finalRecipeData = { ...recipeData, sourceURL: url, categories: [] };
            setImportedRecipeData(finalRecipeData);
            setIsUrlModalOpen(false);
            setIsManualRecipeOpen(true); 
        } catch (error) {
            console.error("Import Error:", error);
            throw new Error(error.message);
        }
    };
    
    const [idea, setIdea] = useState({ name: '', id: null });
    const [showConfirmation, setShowConfirmation] = useState({ journal: false, idea: false });
    const [inspiredBy, setInspiredBy] = useState('');

    const inspireMe = useCallback(() => {
        const randomIndex = Math.floor(Math.random() * masterIdeaList.length);
        setIdea({ name: masterIdeaList[randomIndex].ideaName, id: null });
        setShowConfirmation({ journal: false, idea: false });
        setInspiredBy('inspireMe');
    }, []);

    const generateFromMyIdeas = useCallback(() => {
        if (!ideaPad || ideaPad.length === 0) {
            setIdea({ name: <p className="text-center text-app-grey/70 py-4 text-sm font-montserrat">Your Idea Pad is empty!</p>, id: null });
            setInspiredBy('ideaPad');
            return;
        }
        if (ideaPad.length === 1 && idea.name === ideaPad[0].ideaName) {
            setIdea({ name: "You’ve used up all your ideas", id: null });
            setInspiredBy('ideaPad');
            return;
        }
        let newIdea = idea.name;
        let newIdeaId = idea.id;
        while (newIdea === idea.name && ideaPad.length > 1) {
            const randomIndex = Math.floor(Math.random() * ideaPad.length);
            newIdea = ideaPad[randomIndex].ideaName;
            newIdeaId = ideaPad[randomIndex].id;
        }
        if (ideaPad.length === 1) {
            newIdea = ideaPad[0].ideaName;
            newIdeaId = ideaPad[0].id;
        }
        setIdea({ name: newIdea, id: newIdeaId });
        setShowConfirmation({ journal: false, idea: false });
        setInspiredBy('ideaPad');
    }, [ideaPad, idea]);

    const handleGeneratorChange = (event) => {
        const value = event.target.value;
        if (value === 'inspireMe') {
            inspireMe();
        } else if (value === 'myIdeas') {
            generateFromMyIdeas();
        }
        event.target.value = "";
    };

    const handleLetsBake = async () => {
        if (!idea.name || typeof idea.name !== 'string' || idea.name.includes("empty") || idea.name.includes("used up")) return;
        const newEntry = {
            entryTitle: idea.name,
            bakingDate: new Date().toISOString().split('T')[0],
            tasteRating: 0, difficultyRating: 0, personalNotes: '',
            photoURLs: [], categories: [], sourceURL: '', createdAt: new Date(),
        };
        await addJournalEntry(newEntry);
        if (inspiredBy === 'ideaPad' && idea.id) {
            await deleteIdea(idea.id);
        }
        setShowConfirmation({ journal: true, idea: false });
        setIdea({ name: '', id: null });
    };

    const handleAddToIdeaPad = async () => {
        if (!idea.name || typeof idea.name !== 'string' || idea.name.includes("empty") || idea.name.includes("used up")) return;
        await addIdea({ ideaName: idea.name, notes: 'From Inspire Me!', sourceURL: '', createdAt: new Date(), categories: [] });
        setShowConfirmation({ journal: false, idea: true });
        setIdea({ name: '', id: null });
    };

    const handleFindRecipe = () => {
        if (idea.name && typeof idea.name === 'string') {
            const query = `${idea.name} recipe`;
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        }
    };

    return (
        <div className="p-4 md:p-6 space-y-6 h-full font-patrick-hand">
            <div id="generator-box" className="bg-info-box p-6 rounded-2xl space-y-4 border border-burnt-orange">
                <div className="relative">
                    <select
                        onChange={handleGeneratorChange}
                        className="w-full bg-white text-add-idea font-bold py-3 px-4 rounded-xl text-lg hover:bg-light-peach transition-colors shadow-sm font-montserrat appearance-none text-center"
                        value=""
                    >
                        <option value="" disabled>What should I bake?</option>
                        <option value="inspireMe" className="font-montserrat text-app-grey">Help Me Decide</option>
                        <option value="myIdeas" className="font-montserrat text-app-grey">Use My Ideas</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-add-idea">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>

                {idea.name && (
                    <div className="text-center bg-app-white p-4 rounded-xl mt-4">
                        <div className="text-burnt-orange text-2xl font-bold font-montserrat mb-4">{idea.name}</div>
                        {(typeof idea.name === 'string' && !idea.name.includes("empty") && !idea.name.includes("used up")) && (
                            <div className="flex flex-col justify-center items-center gap-3">
                                <button onClick={handleLetsBake} className="w-full sm:w-auto bg-burnt-orange text-light-peach py-2 px-5 rounded-xl font-semibold hover:opacity-90 transition text-base font-montserrat">Let's Bake This</button>
                                <button onClick={handleFindRecipe} className="w-full sm:w-auto border-2 border-add-idea text-add-idea bg-transparent py-1.5 px-4 rounded-xl font-semibold hover:bg-add-idea/10 transition text-sm font-montserrat">Find a Recipe</button>
                                {inspiredBy === 'inspireMe' && <button onClick={handleAddToIdeaPad} className="w-full sm:w-auto bg-add-idea text-light-peach py-1.5 px-4 rounded-xl font-semibold hover:opacity-90 transition text-sm font-montserrat">Add to my idea pad</button>}
                                <button onClick={inspiredBy === 'inspireMe' ? inspireMe : generateFromMyIdeas} className="text-add-idea p-2 rounded-full hover:bg-add-idea/10 transition" title="Try another">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {showConfirmation.journal && <div className="text-center bg-confirm-bg border border-confirm-text text-confirm-text px-4 py-3 rounded-xl relative mt-4 text-lg" role="alert"><span className="block sm:inline font-montserrat">Added to your Journal!</span></div>}
                {showConfirmation.idea && <div className="text-center bg-confirm-bg border border-confirm-text text-confirm-text px-4 py-3 rounded-xl relative mt-4 text-lg" role="alert"><span className="block sm:inline font-montserrat">New idea added!</span></div>}
            </div>

            <div className="space-y-2">
                <div id="quick-add-buttons" className="grid grid-cols-2 gap-2">
                    <button onClick={openAddJournalModal} className="w-full bg-add-idea text-white py-2 px-2 rounded-xl text-xs font-normal font-montserrat hover:opacity-90 transition-opacity flex items-center justify-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        Bake
                    </button>
                    <button onClick={openAddIdeaModal} className="w-full bg-add-idea text-white py-2 px-2 rounded-xl text-xs font-normal font-montserrat hover:opacity-90 transition-opacity flex items-center justify-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        Idea
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                     <button onClick={() => setIsAddUpcomingBakeModalOpen(true)} className="w-full bg-add-idea text-white py-2 px-2 rounded-xl text-xs font-normal font-montserrat hover:opacity-90 transition-opacity flex items-center justify-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        Schedule
                    </button>
                    <button onClick={() => setIsRecipeChoiceModalOpen(true)} className="w-full bg-add-idea text-white py-2 px-2 rounded-xl text-xs font-normal font-montserrat hover:opacity-90 transition-opacity flex items-center justify-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        Recipe
                    </button>
                </div>
            </div>
            
            <div id="navigation-buttons" className="grid grid-cols-3 gap-3">
                <button onClick={() => setView('cookbook')} className="bg-burnt-orange text-white rounded-2xl p-3 flex flex-col items-center justify-center gap-2 aspect-square hover:opacity-90 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-bookmark-heart" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 4.41c1.387-1.425 4.854 1.07 0 4.277C3.146 5.48 6.613 2.986 8 4.412z"/>
                        <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"/>
                    </svg>
                    <span className="text-xs font-bold font-montserrat">Recipes</span>
                </button>
                <button onClick={() => setView('journal')} className="bg-burnt-orange text-white rounded-2xl p-3 flex flex-col items-center justify-center gap-2 aspect-square hover:opacity-90 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-book" viewBox="0 0 16 16">
                        <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/>
                    </svg>
                    <span className="text-xs font-bold font-montserrat">Journal</span>
                </button>
                <button onClick={() => setView('ideapad')} className="bg-burnt-orange text-white rounded-2xl p-3 flex flex-col items-center justify-center gap-2 aspect-square hover:opacity-90 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-lightbulb" viewBox="0 0 16 16">
                        <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1"/>
                    </svg>
                    <span className="text-xs font-bold font-montserrat">Ideas</span>
                </button>
            </div>
            
            <div id="upcoming-bakes">
                <UpcomingBakes 
                    upcomingBakes={upcomingBakes}
                    addUpcomingBake={addUpcomingBake}
                    updateUpcomingBake={updateUpcomingBake}
                    deleteUpcomingBake={deleteUpcomingBake}
                    cookbook={cookbook}
                    addJournalEntry={addJournalEntry}
                />
            </div>
            
            <div id="stats-box">
                <DashboardStats 
                    journal={journal} 
                    currentCalendarDate={currentCalendarDate} 
                />
            </div>
            
            <div id="calendar-box">
                <BakingCalendar 
                    journal={journal} 
                    upcomingBakes={upcomingBakes} 
                    setView={setView} 
                    setDateFilter={setDateFilter} 
                    openAddChoiceModal={() => setIsAddChoiceModalOpen(true)}
                    onViewBake={handleViewBake}
                    onViewUpcomingBake={handleViewUpcomingBake}
                    currentDate={currentCalendarDate}
                    setCurrentDate={setCurrentCalendarDate}
                />
            </div>
            
            {/* --- MODALS --- */}
            {isRecipeChoiceModalOpen && (
                <AddRecipeChoiceModal 
                    onImport={handleOpenImportModal}
                    onManual={handleOpenManualRecipeForm}
                    onCancel={() => setIsRecipeChoiceModalOpen(false)}
                />
            )}
            {isUrlModalOpen && (
                <AddFromURLModal 
                    onImport={handleImportRecipe}
                    onCancel={() => setIsUrlModalOpen(false)}
                />
            )}
            {isManualRecipeOpen && (
                <CookbookForm 
                    initialData={importedRecipeData}
                    isNew={true}
                    onSave={handleSaveNewRecipe}
                    onCancel={() => {
                        setIsManualRecipeOpen(false);
                        setImportedRecipeData(null);
                    }}
                    cookbook={cookbook}
                />
            )}
            {isAddChoiceModalOpen && (
                <AddBakeChoiceModal 
                    onAddPastBake={handleOpenPastBakeForm}
                    onScheduleBake={handleOpenUpcomingBakeForm}
                    onCancel={() => setIsAddChoiceModalOpen(false)}
                />
            )}
            {isAddUpcomingBakeModalOpen && (
                <UpcomingBakeForm 
                    onSave={handleSaveUpcomingBake}
                    onCancel={() => setIsAddUpcomingBakeModalOpen(false)}
                    cookbook={cookbook}
                />
            )}
            {bakeToView && (
                <ViewBakeModal 
                    bake={bakeToView.past}
                    upcomingBake={bakeToView.upcoming}
                    onClose={() => setBakeToView(null)}
                    onEdit={handleEditFromView}
                />
            )}
            {upcomingBakeToView && (
                <ViewUpcomingBakeModal 
                    bake={upcomingBakeToView}
                    onClose={() => setUpcomingBakeToView(null)}
                    onEdit={handleEditFromUpcomingView}
                />
            )}
            {upcomingBakeToEdit && (
                <UpcomingBakeForm 
                    bakeToEdit={upcomingBakeToEdit}
                    onSave={handleUpdateUpcomingBake}
                    onCancel={() => setUpcomingBakeToEdit(null)}
                    cookbook={cookbook}
                />
            )}
        </div>
    );
};

export default Dashboard;
