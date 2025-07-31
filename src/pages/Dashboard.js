import React, { useState, useCallback } from 'react';
import DashboardStats from './DashboardStats';
import BakingCalendar from './BakingCalendar';
import UpcomingBakes from './UpcomingBakes';
import AddBakeChoiceModal from '../components/AddBakeChoiceModal';
import UpcomingBakeForm from './UpcomingBakeForm';
import ViewBakeModal from '../components/ViewBakeModal';
import ViewUpcomingBakeModal from '../components/ViewUpcomingBakeModal';
import masterIdeaList from '../data/masterIdeaList'; // 1. Import the list from its new location

// The masterIdeaList constant has been removed from this file.

const Dashboard = ({ setView, ideaPad, addJournalEntry, addIdea, deleteIdea, userId, journal, setDateFilter, openAddJournalModal, openAddIdeaModal, upcomingBakes, addUpcomingBake, updateUpcomingBake, deleteUpcomingBake, cookbook }) => {
    
    // --- State for modals ---
    const [isAddChoiceModalOpen, setIsAddChoiceModalOpen] = useState(false);
    const [isAddUpcomingBakeModalOpen, setIsAddUpcomingBakeModalOpen] = useState(false);
    const [bakeToView, setBakeToView] = useState(null);
    const [upcomingBakeToView, setUpcomingBakeToView] = useState(null);
    const [upcomingBakeToEdit, setUpcomingBakeToEdit] = useState(null);
    const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

    // --- Handlers for modals ---
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
    
    // --- Existing Dashboard Logic ---
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
            setIdea({ name: "Your Idea Pad is empty!", id: null });
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
        if (!idea.name || idea.name.includes("empty") || idea.name.includes("used up")) return;
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
        if (!idea.name || idea.name.includes("empty") || idea.name.includes("used up")) return;
        await addIdea({ ideaName: idea.name, notes: 'From Inspire Me!', sourceURL: '', createdAt: new Date(), categories: [] });
        setShowConfirmation({ journal: false, idea: true });
        setIdea({ name: '', id: null });
    };

    return (
        <div className="p-4 md:p-6 space-y-6 h-full font-patrick-hand">
            <div className="bg-info-box p-6 rounded-2xl space-y-4 border border-burnt-orange">
                <div className="relative">
                    <select
                        onChange={handleGeneratorChange}
                        className="w-full bg-white text-add-idea font-bold py-3 px-4 rounded-xl text-lg hover:bg-light-peach transition-colors shadow-sm font-montserrat appearance-none text-center"
                        value=""
                    >
                        <option value="" disabled>What should I bake?</option>
                        <option value="inspireMe" className="font-montserrat text-app-grey">Help me decide</option>
                        <option value="myIdeas" className="font-montserrat text-app-grey">Use My Ideas</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-add-idea">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>

                {idea.name && (
                    <div className="text-center bg-app-white p-4 rounded-xl mt-4">
                        <p className="text-burnt-orange text-2xl font-medium mb-4">{idea.name}</p>
                        {(!idea.name.includes("empty") && !idea.name.includes("used up")) && (
                            <div className="flex flex-col justify-center items-center gap-3">
                                <button onClick={handleLetsBake} className="w-full sm:w-auto bg-burnt-orange text-light-peach py-2 px-5 rounded-xl font-semibold hover:opacity-90 transition text-base font-montserrat">Let's Bake This</button>
                                {inspiredBy === 'inspireMe' && <button onClick={handleAddToIdeaPad} className="w-full sm:w-auto bg-add-idea text-light-peach py-2 px-5 rounded-xl font-semibold hover:opacity-90 transition text-base font-montserrat">Add to my idea pad</button>}
                                <button onClick={inspiredBy === 'inspireMe' ? inspireMe : generateFromMyIdeas} className="w-full sm:w-auto bg-gray-100 text-app-grey py-2 px-5 rounded-xl font-semibold hover:bg-gray-200 transition text-base font-montserrat">Something Else</button>
                            </div>
                        )}
                    </div>
                )}
                {showConfirmation.journal && <div className="text-center bg-confirm-bg border border-confirm-text text-confirm-text px-4 py-3 rounded-xl relative mt-4 text-lg" role="alert"><span className="block sm:inline font-montserrat">Added to your Journal!</span></div>}
                {showConfirmation.idea && <div className="text-center bg-confirm-bg border border-confirm-text text-confirm-text px-4 py-3 rounded-xl relative mt-4 text-lg" role="alert"><span className="block sm:inline font-montserrat">New idea added!</span></div>}
            </div>

            <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                    <button onClick={openAddJournalModal} className="w-full bg-add-idea text-white py-2 px-3 rounded-xl text-sm font-normal font-montserrat hover:opacity-90 transition-opacity">Add Bake</button>
                    <button onClick={openAddIdeaModal} className="w-full bg-add-idea text-white py-2 px-3 rounded-xl text-sm font-normal font-montserrat hover:opacity-90 transition-opacity">Add Idea</button>
                    <button onClick={() => setIsAddUpcomingBakeModalOpen(true)} className="w-full bg-add-idea text-white py-2 px-3 rounded-xl text-sm font-normal font-montserrat hover:opacity-90 transition-opacity">Schedule Bake</button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setView('cookbook')} className="w-full bg-burnt-orange text-light-peach py-2 px-3 rounded-xl text-base font-normal font-montserrat hover:opacity-90 transition-opacity">My Cookbook</button>
                    <button onClick={() => setView('journal')} className="w-full bg-burnt-orange text-light-peach py-2 px-3 rounded-xl text-base font-normal font-montserrat hover:opacity-90 transition-opacity">My Journal</button>
                </div>
            </div>
            
            <UpcomingBakes 
                upcomingBakes={upcomingBakes}
                addUpcomingBake={addUpcomingBake}
                updateUpcomingBake={updateUpcomingBake}
                deleteUpcomingBake={deleteUpcomingBake}
                cookbook={cookbook}
                addJournalEntry={addJournalEntry}
            />
            
            <DashboardStats 
                journal={journal} 
                currentCalendarDate={currentCalendarDate} 
            />
            
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
