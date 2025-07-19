// src/pages/Dashboard.js

import React, { useState, useMemo, useEffect, useCallback } from 'react';

// --- Components located in src/components/ ---
import AddBakeChoiceModal from '../components/AddBakeChoiceModal';
import ViewBakeModal from '../components/ViewBakeModal'; // Assuming ViewBakeModal is also in components/

// --- Components located in src/pages/ (sibling files to Dashboard.js) ---
import DashboardStats from './DashboardStats'; // Corrected path
import BakingCalendar from './BakingCalendar'; // Corrected path
import UpcomingBakes from './UpcomingBakes';     // Corrected path
import UpcomingBakeForm from './UpcomingBakeForm'; // Corrected path
import IdeaForm from './IdeaForm';               // Corrected path
import JournalEntryForm from './JournalEntryForm'; // Corrected path


// --- Main Dashboard Component ---
const Dashboard = ({
    journal,
    cookbook,
    upcomingBakes,
    ideaPad,
    masterIdeaList, // Ensure this is passed as a prop
    addJournalEntry,
    addIdea,
    deleteIdea,
    addUpcomingBake,
    updateUpcomingBake,
    deleteUpcomingBake,
    setView,
    setDateFilter
}) => {
    // Current idea state for the generator
    const [idea, setIdea] = useState({ name: '', id: null });
    // State to track if the idea came from 'inspireMe' or 'ideaPad'
    const [inspiredBy, setInspiredBy] = useState('');
    // State to manage which confirmation message to show (journal or idea pad)
    const [showConfirmation, setShowConfirmation] = useState({ journal: false, idea: false });
    // State for the idea generator dropdown selection
    const [generatorSelection, setGeneratorSelection] = useState('');

    // States for modals
    const [isAddChoiceModalOpen, setIsAddChoiceModalOpen] = useState(false);
    const [isAddUpcomingBakeModalOpen, setIsAddUpcomingBakeModalOpen] = useState(false);
    const [bakeToView, setBakeToView] = useState(null);
    const [isAddJournalModalOpen, setIsAddJournalModalOpen] = useState(false); // For adding past bake
    const [isAddIdeaModalOpen, setIsAddIdeaModalOpen] = useState(false); // For adding new idea directly

    // State for calendar
    const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());


    // --- Idea Generator Functions ---
    const inspireMe = useCallback(() => {
        if (!masterIdeaList || masterIdeaList.length === 0) {
            setIdea({ name: "No general ideas to inspire from!", id: null });
            setInspiredBy('');
            return;
        }
        const randomIndex = Math.floor(Math.random() * masterIdeaList.length);
        setIdea({ name: masterIdeaList[randomIndex].ideaName, id: null });
        setShowConfirmation({ journal: false, idea: false }); // Clear previous confirmations
        setInspiredBy('inspireMe');
    }, [masterIdeaList]);

    const generateFromMyIdeas = useCallback(() => {
        if (!ideaPad || ideaPad.length === 0) {
            setIdea({ name: "Your Idea Pad is empty!", id: null });
            setInspiredBy('ideaPad');
            return;
        }
        // Prevent generating the same idea if it's the only one or if it was just selected
        let newIdeaName = idea.name;
        let newIdeaId = idea.id;
        if (ideaPad.length > 0) {
            let filteredPad = ideaPad;
            if (ideaPad.length > 1 && idea.id) { // If more than one idea, and we have a current one
                filteredPad = ideaPad.filter(item => item.id !== idea.id);
            }
            if (filteredPad.length === 0) { // If filtering left no other options
                 setIdea({ name: "You've used up all your ideas, or only one exists!", id: null });
                 setInspiredBy('ideaPad');
                 return;
            }
            const randomIndex = Math.floor(Math.random() * filteredPad.length);
            newIdeaName = filteredPad[randomIndex].ideaName;
            newIdeaId = filteredPad[randomIndex].id;
        } else { // Should be covered by initial check, but as a fallback
            setIdea({ name: "Your Idea Pad is empty!", id: null });
            setInspiredBy('ideaPad');
            return;
        }

        setIdea({ name: newIdeaName, id: newIdeaId });
        setShowConfirmation({ journal: false, idea: false }); // Clear previous confirmations
        setInspiredBy('ideaPad');
    }, [ideaPad, idea]); // Depend on ideaPad and current idea to prevent repeats if possible

    // Handler for the dropdown selection
    const handleGeneratorSelectChange = (event) => {
        setGeneratorSelection(event.target.value);
        // Reset idea and confirmations when selection changes
        setIdea({ name: '', id: null });
        setShowConfirmation({ journal: false, idea: false });
        setInspiredBy('');
    };

    // Handler for the "Generate Idea" button
    const triggerIdeaGeneration = () => {
        if (generatorSelection === 'inspireMe') {
            inspireMe();
        } else if (generatorSelection === 'myIdeas') {
            generateFromMyIdeas();
        } else {
            setIdea({ name: "Please select an option first!", id: null });
        }
    };

    // Handler for "Let's Bake This!" button
    const handleLetsBake = async () => {
        if (!idea.name || idea.name.includes("empty") || idea.name.includes("used up") || idea.name.includes("select")) return;

        const newEntry = {
            entryTitle: idea.name,
            bakingDate: new Date().toISOString().split('T')[0],
            tasteRating: 0, difficultyRating: 0, personalNotes: '',
            photoURLs: [], categories: [], sourceURL: '', createdAt: new Date(),
        };
        await addJournalEntry(newEntry);

        // If the idea came from the Idea Pad, delete it after moving to Journal
        if (inspiredBy === 'ideaPad' && idea.id) {
            await deleteIdea(idea.id);
        }
        setShowConfirmation({ journal: true, idea: false }); // Show journal confirmation
        setIdea({ name: '', id: null }); // Clear idea
        setInspiredBy(''); // Clear inspiredBy status
        setTimeout(() => setShowConfirmation({ journal: false, idea: false }), 3000); // Hide after 3 seconds
    };

    // Handler for "Add to Idea Pad" button
    const handleAddToIdeaPad = async () => {
        if (!idea.name || idea.name.includes("empty") || idea.name.includes("used up") || idea.name.includes("select")) return;

        await addIdea({ ideaName: idea.name, notes: 'From Inspire Me!', sourceURL: '', createdAt: new Date(), categories: [] });
        setShowConfirmation({ journal: false, idea: true }); // Show idea pad confirmation
        setIdea({ name: '', id: null }); // Clear idea
        setInspiredBy(''); // Clear inspiredBy status
        setTimeout(() => setShowConfirmation({ journal: false, idea: false }), 3000); // Hide after 3 seconds
    };

    // --- Modal Handlers ---
    const handleOpenPastBakeForm = () => {
        setIsAddJournalModalOpen(true);
        setIsAddChoiceModalOpen(false);
    };

    const handleOpenUpcomingBakeForm = () => {
        setIsAddUpcomingBakeModalOpen(true);
        setIsAddChoiceModalOpen(false);
    };

    const handleSaveJournalEntry = async (entryData) => {
        await addJournalEntry(entryData);
        setIsAddJournalModalOpen(false);
        // Optionally show a confirmation for journal entry added directly
    };

    const handleSaveUpcomingBake = async (bakeData) => {
        await addUpcomingBake(bakeData);
        setIsAddUpcomingBakeModalOpen(false);
    };

    const handleViewBake = (bake) => {
        setBakeToView(bake);
    };

    const handleEditFromView = (bake) => {
        // This function would likely set state to open an edit modal
        // and populate it with 'bake' data. For now, it's a placeholder.
        console.log("Edit bake:", bake);
        setBakeToView(null); // Close view modal after "edit" action
        // You'd typically open a form here pre-filled with bake data
    };


    return (
        <div className="p-4 md:p-6 space-y-6 h-full font-patrick-hand">
            <div className="bg-info-box p-6 rounded-2xl space-y-4 border border-burnt-orange">
                {/* START: Idea Generator Section */}
                <h2 className="text-2xl font-bold text-app-grey mb-4">Need a Baking Idea?</h2>
                <div className="flex items-center space-x-2 mb-4">
                    <select
                        value={generatorSelection}
                        onChange={handleGeneratorSelectChange}
                        className="flex-grow p-2 border border-gray-300 rounded-md bg-white text-app-grey font-montserrat"
                    >
                        <option value="">Choose an option</option>
                        <option value="inspireMe">Inspire Me!</option>
                        <option value="myIdeas">From My Idea Pad</option>
                    </select>
                    <button
                        onClick={triggerIdeaGeneration}
                        className="bg-burnt-orange text-light-peach py-2 px-4 rounded-xl font-normal font-montserrat hover:opacity-90 transition-opacity"
                        // Disable if no selection made
                        disabled={!generatorSelection}
                    >
                        Generate Idea
                    </button>
                </div>

                {/* Display generated idea */}
                {idea.name && (
                    <div className="text-center text-burnt-orange text-3xl font-bold mb-4 animate-fade-in">
                        {idea.name}
                    </div>
                )}

                <div className="flex justify-center space-x-4">
                    <button
                        onClick={handleLetsBake}
                        className="bg-add-idea text-white py-2 px-4 rounded-xl font-normal font-montserrat hover:opacity-90 transition-opacity"
                        // Disable if no valid idea is generated
                        disabled={!idea.name || idea.name.includes("empty") || idea.name.includes("used up") || idea.name.includes("select")}
                    >
                        Let's Bake This!
                    </button>
                    {/* "Add to Idea Pad" button shown only if idea came from 'inspireMe' (general list) */}
                    {inspiredBy === 'inspireMe' && (
                        <button
                            onClick={handleAddToIdeaPad}
                            className="bg-app-grey text-white py-2 px-4 rounded-xl font-normal font-montserrat hover:opacity-90 transition-opacity"
                            // Disable if no valid idea is generated
                            disabled={!idea.name || idea.name.includes("empty") || idea.name.includes("used up") || idea.name.includes("select")}
                        >
                            Add to Idea Pad
                        </button>
                    )}
                </div>

                {/* Confirmation Messages (using showConfirmation state) */}
                {showConfirmation.journal && (
                    <div className="text-center bg-confirm-bg border border-confirm-text text-confirm-text px-4 py-2 rounded-xl text-base mt-4 animate-fade-in" role="alert">
                        <span className="font-montserrat">Idea added to your Journal!</span>
                    </div>
                )}
                {showConfirmation.idea && (
                    <div className="text-center bg-confirm-bg border border-confirm-text text-confirm-text px-4 py-2 rounded-xl text-base mt-4 animate-fade-in" role="alert">
                        <span className="font-montserrat">Idea added to your Idea Pad!</span>
                    </div>
                )}
                {/* END: Idea Generator Section */}
            </div>

            {/* Quick Actions Buttons */}
            <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => setIsAddJournalModalOpen(true)} className="w-full bg-add-idea text-white py-2 px-3 rounded-xl text-sm font-normal font-montserrat hover:opacity-90 transition-opacity">Add Bake</button>
                    <button onClick={() => setIsAddIdeaModalOpen(true)} className="w-full bg-add-idea text-white py-2 px-3 rounded-xl text-sm font-normal font-montserrat hover:opacity-90 transition-opacity">Add Idea</button>
                    <button onClick={() => setIsAddUpcomingBakeModalOpen(true)} className="w-full bg-add-idea text-white py-2 px-3 rounded-xl text-sm font-normal font-montserrat hover:opacity-90 transition-opacity">Schedule Bake</button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setView('cookbook')} className="w-full bg-burnt-orange text-light-peach py-2 px-3 rounded-xl text-base font-normal font-montserrat hover:opacity-90 transition-opacity">My Cookbook</button>
                    <button onClick={() => setView('journal')} className="w-full bg-burnt-orange text-light-peach py-2 px-3 rounded-xl text-base font-normal font-montserrat hover:opacity-90 transition-opacity">My Journal</button>
                </div>
            </div>

            {/* Upcoming Bakes Component */}
            <UpcomingBakes
                upcomingBakes={upcomingBakes}
                addUpcomingBake={addUpcomingBake}
                updateUpcomingBake={updateUpcomingBake}
                deleteUpcomingBake={deleteUpcomingBake}
                cookbook={cookbook}
                addJournalEntry={addJournalEntry}
            />

            {/* Dashboard Stats Component */}
            <DashboardStats
                journal={journal}
                currentCalendarDate={currentCalendarDate}
            />

            {/* Baking Calendar Component */}
            <BakingCalendar
                journal={journal}
                upcomingBakes={upcomingBakes}
                setView={setView}
                setDateFilter={setDateFilter}
                openAddChoiceModal={() => setIsAddChoiceModalOpen(true)}
                onViewBake={handleViewBake}
                currentDate={currentCalendarDate}
                setCurrentDate={setCurrentCalendarDate}
            />

            {/* --- Modals --- */}
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
                    bake={bakeToView}
                    onClose={() => setBakeToView(null)}
                    onEdit={handleEditFromView}
                />
            )}
            {isAddJournalModalOpen && (
                <JournalEntryForm
                    onSave={handleSaveJournalEntry}
                    onCancel={() => setIsAddJournalModalOpen(false)}
                    cookbook={cookbook} // Pass cookbook if needed by JournalEntryForm
                />
            )}
            {isAddIdeaModalOpen && (
                <IdeaForm
                    onSave={addIdea} // Directly use addIdea prop
                    onCancel={() => setIsAddIdeaModalOpen(false)}
                />
            )}
        </div>
    );
};

export default Dashboard;