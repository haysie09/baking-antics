import React, { useState, useCallback } from 'react';
import DashboardStats from './DashboardStats';
import BakingCalendar from './BakingCalendar';
import UpcomingBakes from './UpcomingBakes';
import ViewBakeModal from '../components/ViewBakeModal';
import ViewUpcomingBakeModal from '../components/ViewUpcomingBakeModal';
import UpcomingBakeForm from './UpcomingBakeForm';
import masterIdeaList from '../data/masterIdeaList';

const Dashboard = ({ 
    setView, 
    ideaPad, 
    addJournalEntry, 
    addIdea, 
    deleteIdea, 
    journal, 
    setDateFilter, 
    openScheduleModal,
    upcomingBakes, 
    updateUpcomingBake,
    cookbook,
    openAddChoiceModal 
}) => {
    
    // State for viewing/editing modals that are triggered from this page
    const [bakeToView, setBakeToView] = useState(null);
    const [upcomingBakeToView, setUpcomingBakeToView] = useState(null);
    const [upcomingBakeToEdit, setUpcomingBakeToEdit] = useState(null);
    const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

    // State for the generator
    const [idea, setIdea] = useState({ name: '', id: null });
    const [showConfirmation, setShowConfirmation] = useState({ journal: false, idea: false });
    const [inspiredBy, setInspiredBy] = useState('');

    // --- All handler functions are fully implemented ---

    const handleViewBake = (pastBake, upcomingBake) => setBakeToView({ past: pastBake, upcoming: upcomingBake });
    const handleEditFromView = (bake, isUpcoming = false) => { 
        if (isUpcoming) { 
            setUpcomingBakeToEdit(bake); 
        } else { 
            setDateFilter(bake.bakingDate); 
            setView('journal'); 
        } 
        setBakeToView(null); 
    };
    const handleViewUpcomingBake = (bake) => setUpcomingBakeToView(bake);
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
    };
    
    const handleLetsBake = async () => {
        if (!idea.name || typeof idea.name !== 'string' || idea.name.includes("empty") || idea.name.includes("used up")) return;
        const newEntry = {
            entryTitle: idea.name, bakingDate: new Date().toISOString().split('T')[0],
            tasteRating: 0, difficultyRating: 0, personalNotes: '',
            photoURLs: [], categories: [], sourceURL: '', createdAt: new Date(),
        };
        await addJournalEntry(newEntry);
        if (inspiredBy === 'ideaPad' && idea.id) { await deleteIdea(idea.id); }
        setShowConfirmation({ journal: true, idea: false });
        setIdea({ name: '', id: null });
        setTimeout(() => setShowConfirmation({ journal: false, idea: false }), 3000);
    };

    const handleAddToIdeaPad = async () => {
        if (!idea.name || typeof idea.name !== 'string' || idea.name.includes("empty") || idea.name.includes("used up")) return;
        await addIdea({ ideaName: idea.name, notes: 'From Inspire Me!', createdAt: new Date() });
        setShowConfirmation({ journal: false, idea: true });
        setIdea({ name: '', id: null });
        setTimeout(() => setShowConfirmation({ journal: false, idea: false }), 3000);
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
                openScheduleModal={openScheduleModal}
                onViewDetails={handleViewUpcomingBake}
            />

            <section>
                <h2 className="text-[#1b0d10] text-2xl font-bold mb-4">What Should I Bake?</h2>
                <div className="rounded-xl bg-white shadow-sm overflow-hidden p-4">
                    <div className="relative">
                        <select onChange={handleGeneratorChange} className="w-full appearance-none rounded-full border border-pink-200 bg-white py-3 px-4 pr-10 text-base font-medium text-[#1b0d10] shadow-sm focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-300" defaultValue="">
                            <option value="" disabled>Help me decide</option>
                            <option value="inspireMe">Generate for me</option>
                            <option value="myIdeas">Use My Ideas</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#1b0d10]"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"></path></svg></div>
                    </div>
                    
                    {showConfirmation.journal && <div className="text-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl relative mt-4 text-base" role="alert">Added to your Journal!</div>}
                    {showConfirmation.idea && <div className="text-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl relative mt-4 text-base" role="alert">New idea added!</div>}
                    
                    {idea.name ? (
                        <div className="text-center bg-white p-4 rounded-xl mt-4">
                            <div className="text-[#f0425f] text-2xl font-bold">{idea.name}</div>
                            {(typeof idea.name === 'string' && !idea.name.includes("empty") && !idea.name.includes("used up")) && (
                                <div className="flex flex-col justify-center items-center gap-3 mt-4">
                                    <button onClick={handleLetsBake} className="w-full sm:w-auto bg-[#f0425f] text-white py-2 px-5 rounded-full font-semibold hover:opacity-90 transition text-base">Let's Bake This</button>
                                    <button onClick={handleFindRecipe} className="w-full sm:w-auto border-2 border-[#f0425f] text-[#f0425f] bg-transparent py-1.5 px-4 rounded-full font-semibold hover:bg-pink-50 transition text-sm">Find a Recipe</button>
                                    {inspiredBy === 'inspireMe' && <button onClick={handleAddToIdeaPad} className="w-full sm:w-auto bg-[#f8a5b3] text-white py-1.5 px-4 rounded-full font-semibold hover:opacity-90 transition text-sm">Add to my idea pad</button>}
                                    <button onClick={inspiredBy === 'inspireMe' ? inspireMe : generateFromMyIdeas} className="text-[#f0425f] p-2 rounded-full hover:bg-pink-50 transition" title="Try another">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="mt-4 flex flex-col items-center justify-center space-y-3 rounded-lg border border-dashed border-pink-200 bg-pink-50/50 py-10 text-center">
                            <div className="text-4xl text-[#f0425f]"><svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect height="4" rx="1" ry="1" width="8" x="8" y="2"></rect></svg></div>
                            <p className="text-base font-medium text-[#1b0d10]">Select an option to get a suggestion</p>
                            <p className="text-sm text-[#9a4c59]">Your next baking adventure awaits!</p>
                        </div>
                    )}
                </div>
            </section>
            
            <section>
                <h2 className="text-[#1b0d10] text-2xl font-bold mb-4">Your Progress ✨</h2>
                <DashboardStats 
                    journal={journal} 
                    currentCalendarDate={currentCalendarDate} 
                />
            </section>
            
            <section>
                {/* REMOVED: The h2 title for the calendar was here */}
                <BakingCalendar 
                    journal={journal} 
                    upcomingBakes={upcomingBakes} 
                    setView={setView} 
                    setDateFilter={setDateFilter}
                    onViewBake={handleViewBake}
                    onViewUpcomingBake={handleViewUpcomingBake}
                    currentDate={currentCalendarDate}
                    setCurrentDate={setCurrentCalendarDate}
                    openAddChoiceModal={openAddChoiceModal}
                />
            </section>
            
            {/* --- MODALS --- */}
            {upcomingBakeToEdit && ( <UpcomingBakeForm bakeToEdit={upcomingBakeToEdit} onSave={handleUpdateUpcomingBake} onCancel={() => setUpcomingBakeToEdit(null)} cookbook={cookbook} /> )}
            {bakeToView && ( <ViewBakeModal bake={bakeToView.past} upcomingBake={bakeToView.upcoming} onClose={() => setBakeToView(null)} onEdit={handleEditFromView} /> )}
            {upcomingBakeToView && ( <ViewUpcomingBakeModal bake={upcomingBakeToView} onClose={() => setUpcomingBakeToView(null)} onEdit={handleEditFromUpcomingView} /> )}
        </div>
    );
};

export default Dashboard;