import React, { useState, useCallback } from 'react';
// We will define DashboardStats, BakingCalendar, and UpcomingBakes inside this file
import AddBakeChoiceModal from '../components/AddBakeChoiceModal';
import UpcomingBakeForm from './UpcomingBakeForm';
import ViewBakeModal from '../components/ViewBakeModal';
import ViewUpcomingBakeModal from '../components/ViewUpcomingBakeModal';
import masterIdeaList from '../data/masterIdeaList';
import CookbookForm from './CookbookForm';
import AddRecipeChoiceModal from '../components/AddRecipeChoiceModal';
import AddFromURLModal from '../components/AddFromURLModal';

// NEW: Styled UpcomingBakes / What's Next Component
const UpcomingBakes = ({ upcomingBakes, openScheduleModal }) => {
    const nextBake = upcomingBakes && upcomingBakes.length > 0 ? upcomingBakes.sort((a,b) => new Date(a.date) - new Date(b.date))[0] : null;

    return (
        <section>
            <h2 className="text-[#1b0d10] text-2xl font-bold mb-4">What's Next?</h2>
            <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-pink-200 px-6 py-10 bg-white shadow-sm">
                {nextBake ? (
                    <>
                        <p className="text-[#f0425f] text-sm font-bold tracking-wide">UP NEXT</p>
                        <p className="text-[#1b0d10] text-xl font-bold">{nextBake.bakeName}</p>
                        <p className="text-[#9a4c59] text-sm">{new Date(nextBake.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <button 
                            className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-full h-10 px-6 bg-[#f0425f] text-white text-sm font-bold shadow-md hover:bg-opacity-90 mt-2"
                        >
                            View Details
                        </button>
                    </>
                ) : (
                    <>
                        <p className="text-[#1b0d10] text-lg font-bold">No upcoming bakes</p>
                        <p className="text-[#9a4c59] text-sm font-normal">Schedule your next bake to see it here.</p>
                        <button 
                            onClick={openScheduleModal}
                            className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-full h-10 px-6 bg-[#f0425f] text-white text-sm font-bold shadow-md hover:bg-opacity-90"
                        >
                            Schedule Bake
                        </button>
                    </>
                )}
            </div>
        </section>
    );
};

// NEW: Styled DashboardStats Component
const DashboardStats = ({ journal }) => {
    return (
        <section>
            <h2 className="text-[#1b0d10] text-2xl font-bold mb-4">How's it going?</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 rounded-xl p-4 bg-white shadow-sm border border-pink-100">
                    <p className="text-[#9a4c59] text-sm font-medium">Monthly Bakes</p>
                    <p className="text-[#1b0d10] tracking-tight text-3xl font-bold">0</p>
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-4 bg-white shadow-sm border border-pink-100">
                    <p className="text-[#9a4c59] text-sm font-medium">Hours Spent</p>
                    <p className="text-[#1b0d10] tracking-tight text-3xl font-bold">0</p>
                </div>
            </div>
        </section>
    );
};

// NEW: Styled BakingCalendar Component
const BakingCalendar = () => {
     return (
        <section>
            <h2 className="text-[#1b0d10] text-2xl font-bold mb-4">My Baking Calendar</h2>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-pink-100">
                <div className="flex items-center justify-between">
                    <button className="text-[#1b0d10] flex size-10 items-center justify-center rounded-full hover:bg-[#f3e7e9] transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 256 256"><path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path></svg>
                    </button>
                    <p className="text-[#1b0d10] text-base font-bold">September 2025</p>
                    <button className="text-[#1b0d10] flex size-10 items-center justify-center rounded-full hover:bg-[#f3e7e9] transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 256 256"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path></svg>
                    </button>
                </div>
                <div className="grid grid-cols-7 text-center mt-4">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => <p key={day} className="text-[#9a4c59] text-xs font-bold flex h-10 w-full items-center justify-center">{day}</p>)}
                    {[...Array(30).keys()].map(i => <button key={i} className="h-10 w-full text-[#1b0d10] text-sm font-medium">{i + 1}</button>)}
                </div>
            </div>
        </section>
    );
}


const Dashboard = ({ setView, ideaPad, addJournalEntry, addIdea, deleteIdea, userId, journal, setDateFilter, upcomingBakes, addUpcomingBake, updateUpcomingBake, deleteUpcomingBake, cookbook, addRecipe, updateRecipe, deleteRecipe }) => {
    
    // State and handlers are mostly the same...
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

    const handleOpenPastBakeForm = () => { setIsAddChoiceModalOpen(false); /* Logic to open journal form is in App.js */ };
    const handleOpenUpcomingBakeForm = () => { setIsAddChoiceModalOpen(false); setIsAddUpcomingBakeModalOpen(true); };
    const handleSaveUpcomingBake = async (bakeData) => { await addUpcomingBake(bakeData); setIsAddUpcomingBakeModalOpen(false); };
    const handleViewBake = (pastBake, upcomingBake) => { setBakeToView({ past: pastBake, upcoming: upcomingBake }); };
    const handleEditFromView = (bake, isUpcoming = false) => { if (isUpcoming) { setUpcomingBakeToEdit(bake); } else { setDateFilter(bake.bakingDate); setView('journal'); } setBakeToView(null); };
    const handleViewUpcomingBake = (bake) => { setUpcomingBakeToView(bake); };
    const handleEditFromUpcomingView = () => { setUpcomingBakeToEdit(upcomingBakeToView); setUpcomingBakeToView(null); };
    const handleUpdateUpcomingBake = async (bakeData) => { if (upcomingBakeToEdit) { await updateUpcomingBake(upcomingBakeToEdit.id, bakeData); } setUpcomingBakeToEdit(null); };
    const handleOpenImportModal = () => { setIsRecipeChoiceModalOpen(false); setIsUrlModalOpen(true); };
    const handleOpenManualRecipeForm = () => { setIsRecipeChoiceModalOpen(false); setIsManualRecipeOpen(true); };
    const handleSaveNewRecipe = async (recipeData) => { await addRecipe({ ...recipeData, createdAt: new Date() }); setIsManualRecipeOpen(false); setImportedRecipeData(null); };
    const handleImportRecipe = async (url) => { /* ... */ };
    
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
            setIdea({ name: <p className="text-center text-[#9a4c59] py-4 text-sm">Your Idea Pad is empty!</p>, id: null });
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
        <div className="p-4 space-y-8 h-full bg-[#fcf8f9] font-sans">
            
            <UpcomingBakes 
                upcomingBakes={upcomingBakes}
                openScheduleModal={() => setIsAddUpcomingBakeModalOpen(true)}
            />

            <section>
                <h2 className="text-[#1b0d10] text-2xl font-bold mb-4">What Should I Bake?</h2>
                <div className="rounded-xl bg-white shadow-sm overflow-hidden p-4">
                    <div className="relative">
                        <select
                            onChange={handleGeneratorChange}
                            className="w-full appearance-none rounded-full border border-pink-200 bg-white py-3 px-4 pr-10 text-base font-medium text-[#1b0d10] shadow-sm focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-300"
                            defaultValue=""
                        >
                            <option value="" disabled>Help me decide</option>
                            <option value="inspireMe">Generate for me</option>
                            <option value="myIdeas">Use My Ideas</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#1b0d10]">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                    {idea.name ? (
                        <div className="text-center bg-white p-4 rounded-xl mt-4">
                            <div className="text-[#f0425f] text-2xl font-bold">{idea.name}</div>
                            {(typeof idea.name === 'string' && !idea.name.includes("empty") && !idea.name.includes("used up")) && (
                                <div className="flex flex-col justify-center items-center gap-3 mt-4">
                                    <button onClick={handleLetsBake} className="w-full sm:w-auto bg-[#f0425f] text-white py-2 px-5 rounded-full font-semibold hover:opacity-90 transition text-base">Let's Bake This</button>
                                    <button onClick={handleFindRecipe} className="w-full sm:w-auto border-2 border-[#f0425f] text-[#f0425f] bg-transparent py-1.5 px-4 rounded-full font-semibold hover:bg-pink-50 transition text-sm">Find a Recipe</button>
                                    {inspiredBy === 'inspireMe' && <button onClick={handleAddToIdeaPad} className="w-full sm:w-auto bg-[#FFC0CB] text-[#9a4c59] py-1.5 px-4 rounded-full font-semibold hover:opacity-90 transition text-sm">Add to my idea pad</button>}
                                    <button onClick={inspiredBy === 'inspireMe' ? inspireMe : generateFromMyIdeas} className="text-[#f0425f] p-2 rounded-full hover:bg-pink-50 transition" title="Try another">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="mt-4 flex flex-col items-center justify-center space-y-3 rounded-lg border border-dashed border-pink-200 bg-pink-50/50 py-10 text-center">
                            <div className="text-4xl text-[#f0425f]">
                                <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect height="4" rx="1" ry="1" width="8" x="8" y="2"></rect></svg>
                            </div>
                            <p className="text-base font-medium text-[#1b0d10]">Select an option to get a suggestion</p>
                            <p className="text-sm text-[#9a4c59]">Your next baking adventure awaits!</p>
                        </div>
                    )}
                </div>
            </section>
            
            <DashboardStats journal={journal} />
            <BakingCalendar />
            
            {/* --- MODALS --- */}
            {isRecipeChoiceModalOpen && ( <AddRecipeChoiceModal onImport={handleOpenImportModal} onManual={handleOpenManualRecipeForm} onCancel={() => setIsRecipeChoiceModalOpen(false)} /> )}
            {isUrlModalOpen && ( <AddFromURLModal onImport={handleImportRecipe} onCancel={() => setIsUrlModalOpen(false)} /> )}
            {isManualRecipeOpen && ( <CookbookForm initialData={importedRecipeData} isNew={true} onSave={handleSaveNewRecipe} onCancel={() => { setIsManualRecipeOpen(false); setImportedRecipeData(null); }} /> )}
            {isAddChoiceModalOpen && ( <AddBakeChoiceModal onAddPastBake={handleOpenPastBakeForm} onScheduleBake={handleOpenUpcomingBakeForm} onCancel={() => setIsAddChoiceModalOpen(false)} /> )}
            {isAddUpcomingBakeModalOpen && ( <UpcomingBakeForm onSave={handleSaveUpcomingBake} onCancel={() => setIsAddUpcomingBakeModalOpen(false)} cookbook={cookbook} /> )}
            {bakeToView && ( <ViewBakeModal bake={bakeToView.past} upcomingBake={bakeToView.upcoming} onClose={() => setBakeToView(null)} onEdit={handleEditFromView} /> )}
            {upcomingBakeToView && ( <ViewUpcomingBakeModal bake={upcomingBakeToView} onClose={() => setUpcomingBakeToView(null)} onEdit={handleEditFromUpcomingView} /> )}
            {upcomingBakeToEdit && ( <UpcomingBakeForm bakeToEdit={upcomingBakeToEdit} onSave={handleUpdateUpcomingBake} onCancel={() => setUpcomingBakeToEdit(null)} cookbook={cookbook} /> )}
        </div>
    );
};

export default Dashboard;