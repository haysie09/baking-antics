import React, { useState, useCallback } from 'react';
import DashboardStats from './DashboardStats';
import BakingCalendar from './BakingCalendar';
import UpcomingBakes from './UpcomingBakes';
import masterIdeaList from '../data/masterIdeaList';

const Dashboard = ({ 
    setView, 
    ideaPad, 
    addJournalEntry, 
    addIdea, 
    deleteIdea, 
    journal, 
    setDateFilter, 
    upcomingBakes, 
    openScheduleModal,
    setBakeToView,
    setUpcomingBakeToView,
}) => {
    
    const [idea, setIdea] = useState({ name: '', id: null });
    const [showConfirmation, setShowConfirmation] = useState({ journal: false, idea: false });
    const [inspiredBy, setInspiredBy] = useState('');
    const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

    const inspireMe = useCallback(() => {
        const randomIndex = Math.floor(Math.random() * masterIdeaList.length);
        setIdea({ name: masterIdeaList[randomIndex].ideaName, id: null });
        setShowConfirmation({ journal: false, idea: false });
        setInspiredBy('inspireMe');
    }, []);

    const generateFromMyIdeas = useCallback(() => {
        if (!ideaPad || ideaPad.length === 0) {
            setIdea({ name: <p className="text-center text-[var(--text-secondary)] py-4 text-sm">Your Idea Pad is empty!</p>, id: null });
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
        setTimeout(() => setShowConfirmation({ journal: false, idea: false }), 3000);
    };

    const handleAddToIdeaPad = async () => {
        if (!idea.name || typeof idea.name !== 'string' || idea.name.includes("empty") || idea.name.includes("used up")) return;
        await addIdea({ ideaName: idea.name, notes: 'From Inspire Me!', sourceURL: '', createdAt: new Date(), categories: [] });
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
        <div className="h-full bg-[var(--background-color)] font-sans"> 
            
            <UpcomingBakes 
                upcomingBakes={upcomingBakes}
                onViewDetails={setUpcomingBakeToView}
                openScheduleModal={openScheduleModal}
            />

            <div className="relative z-0">
                <div className="p-4 pt-6 space-y-8 bg-[var(--background-color)] -mt-4 rounded-t-2xl">
                    <section>
                        <h2 className="text-[var(--text-primary)] text-2xl font-bold mb-4">What Should I Bake?</h2>
                        <div className="rounded-xl bg-white shadow-sm overflow-hidden p-4">
                            <div className="relative">
                                <select onChange={handleGeneratorChange} className="w-full appearance-none rounded-full border border-pink-200 bg-white py-3 px-4 pr-10 text-base font-medium text-[var(--text-primary)] shadow-sm focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-300" defaultValue="">
                                    <option value="" disabled>Help me decide</option>
                                    <option value="inspireMe">Generate for me</option>
                                    <option value="myIdeas">Use My Ideas</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[var(--text-primary)]"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"></path></svg></div>
                            </div>
                            {showConfirmation.journal && <div className="text-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl relative mt-4 text-base" role="alert">Added to your Journal!</div>}
                            {showConfirmation.idea && <div className="text-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl relative mt-4 text-base" role="alert">New idea added!</div>}
                            {idea.name ? (
                                <div className="text-center bg-white p-4 rounded-xl mt-4">
                                    <div className="text-[var(--primary-color)] text-2xl font-bold">{idea.name}</div>
                                    {(typeof idea.name === 'string' && !idea.name.includes("empty") && !idea.name.includes("used up")) && (
                                        <div className="flex flex-col justify-center items-center gap-3 mt-4">
                                            <button onClick={handleLetsBake} className="w-full sm:w-auto bg-[var(--primary-color)] text-white py-2 px-5 rounded-full font-semibold hover:opacity-90 transition text-base">Let's Bake This</button>
                                            <button onClick={handleFindRecipe} className="w-full sm:w-auto border-2 border-[var(--primary-color)] text-[var(--primary-color)] bg-transparent py-1.5 px-4 rounded-full font-semibold hover:bg-pink-50 transition text-sm">Find a Recipe</button>
                                            {inspiredBy === 'inspireMe' && <button onClick={handleAddToIdeaPad} className="w-full sm:w-auto bg-[#f8a5b3] text-white py-1.5 px-4 rounded-full font-semibold hover:opacity-90 transition text-sm">Add to my idea pad</button>}
                                            <button onClick={inspiredBy === 'inspireMe' ? inspireMe : generateFromMyIdeas} className="text-[var(--primary-color)] p-2 rounded-full hover:bg-pink-50 transition" title="Try another">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="mt-4 flex flex-col items-center justify-center space-y-3 rounded-lg border border-dashed border-pink-200 bg-pink-50/50 py-10 text-center">
                                    <div className="text-4xl text-[var(--primary-color)]"><svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect height="4" rx="1" ry="1" width="8" x="8" y="2"></rect></svg></div>
                                    <p className="text-base font-medium text-[var(--text-primary)]">Select an option to get a suggestion</p>
                                    <p className="text-sm text-[var(--text-secondary)]">Your next baking adventure awaits!</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
            
            <section className="bg-[var(--progress-bg)] p-4 pt-6 pb-8">
                 <div className="flex justify-between items-start">
                    <h2 className="text-white text-2xl font-bold">Your Progress</h2>
                    <img src="/icon-brand-green.svg" alt="Baking Progress Icon" className="w-20 h-20 -mt-8" />
                </div>
            </section>
            
            <div className="relative z-0">
                <div className="p-4 bg-[var(--background-color)] -mt-4 rounded-t-2xl space-y-8">
                     <section>
                        <DashboardStats 
                            journal={journal} 
                            currentCalendarDate={currentCalendarDate} 
                        />
                    </section>
                    
                    <section>
                        <BakingCalendar 
                            journal={journal} 
                            upcomingBakes={upcomingBakes} 
                            setView={setView} 
                            setDateFilter={setDateFilter}
                            onViewBake={setBakeToView}
                            onViewUpcomingBake={setUpcomingBakeToView}
                            currentDate={currentCalendarDate}
                            setCurrentDate={setCurrentCalendarDate}
                        />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

