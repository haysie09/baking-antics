import React, { useState, useCallback } from 'react';
import DashboardStats from './DashboardStats';
import BakingCalendar from './BakingCalendar';
import UpcomingBakes from './UpcomingBakes';
import AddBakeChoiceModal from '../components/AddBakeChoiceModal';
import UpcomingBakeForm from './UpcomingBakeForm';
import ViewBakeModal from '../components/ViewBakeModal';
import ViewUpcomingBakeModal from '../components/ViewUpcomingBakeModal';
import masterIdeaList from '../data/masterIdeaList';

const Dashboard = ({ setView, ideaPad, addJournalEntry, addIdea, deleteIdea, userId, journal, setDateFilter, openAddJournalModal, openAddIdeaModal, upcomingBakes, addUpcomingBake, updateUpcomingBake, deleteUpcomingBake, cookbook }) => {
    
    const [isAddChoiceModalOpen, setIsAddChoiceModalOpen] = useState(false);
    const [isAddUpcomingBakeModalOpen, setIsAddUpcomingBakeModalOpen] = useState(false);
    const [bakeToView, setBakeToView] = useState(null);
    const [upcomingBakeToView, setUpcomingBakeToView] = useState(null);
    const [upcomingBakeToEdit, setUpcomingBakeToEdit] = useState(null);
    const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

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
            setIdea({ name: <p className="text-center text-app-grey/70 py-4 text-base font-montserrat">Your Idea Pad is empty!</p>, id: null });
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
                <div id="quick-add-buttons" className="grid grid-cols-3 gap-2">
                    <button onClick={openAddJournalModal} className="w-full bg-add-idea text-white py-2 px-2 rounded-xl text-xs font-normal font-montserrat hover:opacity-90 transition-opacity flex items-center justify-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        Bake
                    </button>
                    <button onClick={openAddIdeaModal} className="w-full bg-add-idea text-white py-2 px-2 rounded-xl text-xs font-normal font-montserrat hover:opacity-90 transition-opacity flex items-center justify-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        Idea
                    </button>
                    <button onClick={() => setIsAddUpcomingBakeModalOpen(true)} className="w-full bg-add-idea text-white py-2 px-2 rounded-xl text-xs font-normal font-montserrat hover:opacity-90 transition-opacity flex items-center justify-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        Schedule
                    </button>
                </div>
                <div id="navigation-buttons" className="grid grid-cols-3 gap-2">
                    <button onClick={() => setView('cookbook')} className="w-full bg-burnt-orange text-light-peach py-2 px-3 rounded-xl text-xs font-normal font-montserrat hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                        </svg>
                        Cook Book
                    </button>
                    <button onClick={() => setView('journal')} className="w-full bg-burnt-orange text-light-peach py-2 px-3 rounded-xl text-xs font-normal font-montserrat hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                        </svg>
                        Journal
                    </button>
                    <button onClick={() => setView('ideapad')} className="w-full bg-burnt-orange text-light-peach py-2 px-3 rounded-xl text-xs font-normal font-montserrat hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M12 .75a8.25 8.25 0 0 0-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 0 0 .577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 0 1-.937-.171.75.75 0 1 1 .374-1.453 5.261 5.261 0 0 0 2.626 0 .75.75 0 1 1 .374 1.452 6.712 6.712 0 0 1-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 0 0 .577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0 0 12 .75Z" />
                            <path fillRule="evenodd" d="M9.013 19.9a.75.75 0 0 1 .877-.597 11.319 11.319 0 0 0 4.22 0 .75.75 0 1 1 .28 1.473 12.819 12.819 0 0 1-4.78 0 .75.75 0 0 1-.597-.876ZM9.754 22.344a.75.75 0 0 1 .824-.668 13.682 13.682 0 0 0 2.844 0 .75.75 0 1 1 .156 1.492 15.156 15.156 0 0 1-3.156 0 .75.75 0 0 1-.668-.824Z" clipRule="evenodd" />
                        </svg>
                        Idea Pad
                    </button>
                </div>
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
