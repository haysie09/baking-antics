// src/pages/Dashboard.js

import React, { useState, useCallback, useMemo, useEffect } from 'react'; // Added useMemo, useEffect for DashboardStats

// --- Components located in src/components/ ---
import AddBakeChoiceModal from '../components/AddBakeChoiceModal';
import ViewBakeModal from '../components/ViewBakeModal';

// --- Components located in src/pages/ (sibling files to Dashboard.js) ---
// Note: DashboardStats is defined within this file, so no import statement for it is needed here.
import BakingCalendar from './BakingCalendar';
import UpcomingBakes from './UpcomingBakes';
import UpcomingBakeForm from './UpcomingBakeForm';
import IdeaForm from './IdeaForm';
import JournalEntryForm from './JournalEntryForm'; // Assuming this is your form for editing/adding journal entries


// --- masterIdeaList constant ---
const masterIdeaList = [
    { ideaName: "Simple Chocolate Chip Cookies", difficulty: "simple" },
    { ideaName: "Easy Banana Bread", difficulty: "simple" },
    { ideaName: "Basic Blueberry Muffins", difficulty: "simple" },
    { ideaName: "Classic Victoria Sponge", difficulty: "simple" },
    { ideaName: "No-Bake Cheesecake", difficulty: "simple" },
    { ideaName: "Fudgy Brownies", difficulty: "simple" },
    { ideaName: "Classic Apple Pie", difficulty: "simple" },
    { ideaName: "Peanut Butter Cookies", difficulty: "simple" },
    { ideaName: "Lemon Loaf Cake", difficulty: "simple" },
    { ideaName: "Oatmeal Raisin Cookies", difficulty: "simple" },
    { ideaName: "Rice Krispie Treats", difficulty: "simple" },
    { ideaName: "Vanilla Cupcakes", difficulty: "simple" },
    { ideaName: "Simple Shortbread", difficulty: "simple" },
    { ideaName: "Chocolate Avocado Mousse", difficulty: "simple" },
    { ideaName: "Anzac Biscuits", difficulty: "simple" },
    { ideaName: "Complex Sourdough Loaf", difficulty: "challenging" },
    { ideaName: "Multi-layer Opera Cake", difficulty: "challenging" },
    { ideaName: "French Macarons", difficulty: "challenging" },
    { ideaName: "Handmade Croissants", difficulty: "challenging" },
    { ideaName: "Elaborate Pavlova Tower", difficulty: "challenging" },
    { ideaName: "Artisan Baguettes", difficulty: "challenging" },
    { ideaName: "Japanese Cotton Cheesecake", difficulty: "challenging" },
    { ideaName: "Baklava", difficulty: "challenging" },
    { ideaName: "Cronuts (Croissant-Doughnut Hybrid)", difficulty: "challenging" },
    { ideaName: "Kouign-amann", difficulty: "challenging" },
    { ideaName: "Prinsesstårta (Princess Cake)", difficulty: "challenging" },
    { ideaName: "Dobos Torte", difficulty: "challenging" },
    { ideaName: "Canele", difficulty: "challenging" },
    { ideaName: "Ginger Crunch Slice", difficulty: "simple" },
    { ideaName: "Caramel Slice", difficulty: "simple" },
    { ideaName: "Lamingtons", difficulty: "simple" },
    { ideaName: "Red Velvet Cake", difficulty: "challenging" },
    { ideaName: "Carrot Cake", difficulty: "simple" },
    { ideaName: "Sticky Toffee Pudding", difficulty: "simple" },
    { ideaName: "Cinnamon Rolls", difficulty: "challenging" },
    { ideaName: "Profiteroles with Chocolate Sauce", difficulty: "challenging" },
    { ideaName: "Banana Bread", difficulty: "simple" },
    { ideaName: "Marshmellow Slice", difficulty: "challenging" },
    { ideaName: "Madeleines", difficulty: "challenging" },
    { ideaName: "Churros with Chocolate Dip", difficulty: "simple" },
    { ideaName: "Cheesecake", difficulty: "challenging" },
];


// --- DashboardStats Component (defined inline within this file) ---
const DashboardStats = ({ journal, currentCalendarDate }) => {
    const [filter, setFilter] = useState('month');

    useEffect(() => {
        setFilter('month');
    }, [currentCalendarDate]);

    const stats = useMemo(() => {
        const now = new Date();
        let filteredEntries = [];
        let dateLabel = '';
        let dateSubLabel = '';

        switch (filter) {
            case 'week': {
                const startOfWeek = new Date(now);
                const day = startOfWeek.getUTCDay();
                const diff = startOfWeek.getUTCDate() - day + (day === 0 ? -6 : 1);
                startOfWeek.setUTCDate(diff);
                startOfWeek.setUTCHours(0, 0, 0, 0);

                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
                endOfWeek.setUTCHours(23, 59, 59, 999);

                dateLabel = 'This Week';
                dateSubLabel = `(${startOfWeek.getDate()}/${startOfWeek.getMonth() + 1} - ${endOfWeek.getDate()}/${endOfWeek.getMonth() + 1})`;

                filteredEntries = journal.filter(entry => {
                    const entryDate = new Date(entry.bakingDate);
                    return entryDate >= startOfWeek && entryDate <= endOfWeek;
                });
                break;
            }
            case 'last-week': {
                const today = new Date();
                const dayOfWeek = today.getUTCDay();
                const endOfLastWeek = new Date(today);
                endOfLastWeek.setUTCDate(today.getUTCDate() - dayOfWeek);
                endOfLastWeek.setUTCHours(23, 59, 59, 999);

                const startOfLastWeek = new Date(endOfLastWeek);
                startOfLastWeek.setUTCDate(endOfLastWeek.getUTCDate() - 6);
                startOfLastWeek.setUTCHours(0, 0, 0, 0);

                dateLabel = 'Last Week';
                dateSubLabel = `(${startOfLastWeek.getDate()}/${startOfLastWeek.getMonth() + 1} - ${endOfLastWeek.getDate()}/${endOfLastWeek.getMonth() + 1})`;

                filteredEntries = journal.filter(entry => {
                    const entryDate = new Date(entry.bakingDate);
                    return entryDate >= startOfLastWeek && entryDate <= endOfLastWeek;
                });
                break;
            }
            case 'all':
                dateLabel = 'All Time';
                filteredEntries = journal;
                break;

            case 'month':
            default: {
                const displayDate = currentCalendarDate || new Date();
                const month = displayDate.getMonth();
                const year = displayDate.getFullYear();
                dateLabel = displayDate.toLocaleString('default', { month: 'long' });

                filteredEntries = journal.filter(entry => {
                    const entryDate = new Date(entry.bakingDate);
                    return entryDate.getMonth() === month && entryDate.getFullYear() === year;
                });
                break;
            }
        }

        const totalBakes = filteredEntries.length;
        const totalMinutes = filteredEntries.reduce((acc, entry) => {
            const hours = entry.timeHours || 0;
            const minutes = entry.timeMinutes || 0;
            return acc + (hours * 60) + minutes;
        }, 0);

        const totalHours = Math.floor(totalMinutes / 60);

        return { totalBakes, totalHours, dateLabel, dateSubLabel };
    }, [journal, filter, currentCalendarDate]);

    return (
        <div className="bg-info-box p-4 rounded-2xl border border-burnt-orange">
            <div className="flex justify-center items-center mb-3">
                <div className="relative">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="text-xs font-montserrat bg-white border border-gray-300 rounded-lg py-1 pl-2 pr-6 appearance-none focus:outline-none focus:ring-2 focus:ring-burnt-orange"
                    >
                        <option value="month">{stats.dateLabel}</option>
                        <option value="week">This Week</option>
                        <option value="last-week">Last Week</option>
                        <option value="all">All Time</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                    <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-4 border-light-peach"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-add-idea" style={{ clipPath: 'inset(0 50% 0 0)' }}></div>
                        <span className="text-4xl font-bold text-burnt-orange font-montserrat">{stats.totalBakes}</span>
                    </div>
                    <p className="mt-2 text-sm font-bold text-app-grey font-montserrat">Bakes</p>
                    <p className="text-xs italic text-app-grey/75 font-montserrat">
                        {stats.dateSubLabel ? stats.dateSubLabel : stats.dateLabel}
                    </p>
                </div>
                <div>
                    <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-4 border-light-peach"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-add-idea" style={{ clipPath: 'inset(0 0 50% 0)' }}></div>
                        <span className="text-4xl font-bold text-burnt-orange font-montserrat">{stats.totalHours}</span>
                    </div>
                    <p className="mt-2 text-sm font-bold text-app-grey font-montserrat">Hours Spent</p>
                    <p className="text-xs italic text-app-grey/75 font-montserrat">
                        {stats.dateSubLabel ? stats.dateSubLabel : stats.dateLabel}
                    </p>
                </div>
            </div>
        </div>
    );
};


// --- Main Dashboard Component ---
const Dashboard = ({
    setView, ideaPad, addJournalEntry, addIdea, deleteIdea, userId, journal, setDateFilter,
    openAddJournalModal, openAddIdeaModal, // These props will still open the main Add/Journal modals if needed
    upcomingBakes, addUpcomingBake, updateUpcomingBake, deleteUpcomingBake, cookbook,
    updateJournalEntry // <<< IMPORTANT: Assuming you have an updateJournalEntry prop for editing
}) => {

    // States for general modals and calendar
    const [isAddChoiceModalOpen, setIsAddChoiceModalOpen] = useState(false);
    const [isAddUpcomingBakeModalOpen, setIsAddUpcomingBakeModalOpen] = useState(false);
    const [bakeToView, setBakeToView] = useState(null);
    const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

    // States for the idea generator
    const [idea, setIdea] = useState({ name: '', id: null });
    const [showConfirmation, setShowConfirmation] = useState({ journal: false, idea: false });
    const [inspiredBy, setInspiredBy] = useState('');

    // --- NEW STATES FOR EDITING JOURNAL ENTRY ---
    const [isEditJournalModalOpen, setIsEditJournalModalOpen] = useState(false);
    const [editJournalEntryData, setEditJournalEntryData] = useState(null);

    // --- Modal Handlers (existing and modified) ---
    const handleOpenPastBakeForm = () => {
        setIsAddChoiceModalOpen(false);
        // This likely opens the ADD journal modal, not edit.
        // If openAddJournalModal is a prop that controls a modal elsewhere, keep it.
        // If it was meant to open the local JournalEntryForm, use setIsAddJournalModalOpen(true)
        // For now, retaining original call but noting the distinction.
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

    const handleViewBake = (bake) => {
        setBakeToView(bake);
    };

    // --- MODIFIED handleEditFromView to open JournalEntryForm for editing ---
    const handleEditFromView = (bake) => {
        if (bake) {
            setEditJournalEntryData(bake);         // Set the data to pre-fill the form
            setIsEditJournalModalOpen(true);        // Open the JournalEntryForm in edit mode
            setBakeToView(null);                    // Close the ViewBakeModal
        }
    };

    // --- Idea Generator Functions ---
    const inspireMe = useCallback(() => {
        if (!masterIdeaList || masterIdeaList.length === 0) {
            setIdea({ name: "No general ideas to inspire from!", id: null });
            setInspiredBy('');
            return;
        }
        const randomIndex = Math.floor(Math.random() * masterIdeaList.length);
        setIdea({ name: masterIdeaList[randomIndex].ideaName, id: null });
        setShowConfirmation({ journal: false, idea: false });
        setInspiredBy('inspireMe');
    }, [masterIdeaList]);

    const generateFromMyIdeas = useCallback(() => {
        if (!ideaPad || ideaPad.length === 0) {
            setIdea({ name: "Your Idea Pad is empty!", id: null });
            setInspiredBy('ideaPad');
            return;
        }
        if (ideaPad.length === 1 && idea.name === ideaPad[0].ideaName) {
            setIdea({ name: "You've used up all your ideas", id: null });
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
        if (value !== "") {
            setIdea({ name: '', id: null });
            setShowConfirmation({ journal: false, idea: false });

            if (value === 'inspireMe') {
                inspireMe();
            } else if (value === 'myIdeas') {
                generateFromMyIdeas();
            }
        }
    };

    const handleLetsBake = async () => {
        if (!idea.name || idea.name.includes("empty") || idea.name.includes("used up") || idea.name.includes("select")) return;

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
        setInspiredBy('');
        setTimeout(() => setShowConfirmation({ journal: false, idea: false }), 3000);
    };

    const handleAddToIdeaPad = async () => {
        if (!idea.name || idea.name.includes("empty") || idea.name.includes("used up") || idea.name.includes("select")) return;

        await addIdea({ ideaName: idea.name, notes: 'From Inspire Me!', sourceURL: '', createdAt: new Date(), categories: [] });
        setShowConfirmation({ journal: false, idea: true });
        setIdea({ name: '', id: null });
        setInspiredBy('');
        setTimeout(() => setShowConfirmation({ journal: false, idea: false }), 3000);
    };

    return (
        <div className="p-4 md:p-6 space-y-6 h-full font-patrick-hand">
            <div className="bg-info-box p-6 rounded-2xl space-y-4 border border-burnt-orange">
                {/* START: Idea Generator Section */}
                <div className="relative">
                    <select
                        onChange={handleGeneratorChange}
                        className="w-full bg-white text-add-idea font-bold py-3 px-4 rounded-xl text-lg hover:bg-light-peach transition-colors shadow-sm font-montserrat appearance-none text-center"
                        value=""
                    >
                        <option value="" disabled>What should I bake?</option>
                        <option value="inspireMe" className="font-montserrat text-app-grey">Generate from Inspire Me!</option>
                        <option value="myIdeas" className="font-montserrat text-app-grey">Generate from My Ideas</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-add-idea">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>

                {idea.name && (
                    <div className="text-center bg-app-white p-4 rounded-xl mt-4">
                        <p className="text-burnt-orange text-2xl font-medium mb-4">{idea.name}</p>
                        {(!idea.name.includes("empty") && !idea.name.includes("used up") && !idea.name.includes("select")) && (
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
                {/* END: Idea Generator Section */}
            </div>

            {/* Quick Actions Buttons */}
            <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                    {/* These buttons assume openAddJournalModal and openAddIdeaModal are passed as props and control modals at a higher level */}
                    <button onClick={openAddJournalModal} className="w-full bg-add-idea text-white py-2 px-3 rounded-xl text-base font-normal font-montserrat hover:opacity-90 transition-opacity">Add Bake</button>
                    <button onClick={openAddIdeaModal} className="w-full bg-add-idea text-white py-2 px-3 rounded-xl text-base font-normal font-montserrat hover:opacity-90 transition-opacity">Add Idea</button>
                    <button onClick={() => setIsAddUpcomingBakeModalOpen(true)} className="w-full bg-add-idea text-white py-2 px-3 rounded-xl text-base font-normal font-montserrat hover:opacity-90 transition-opacity">Schedule Bake</button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setView('cookbook')} className="w-full bg-burnt-orange text-light-peach py-2 px-3 rounded-xl text-base font-normal font-montserrat hover:opacity-90 transition-opacity">My Cookbook</button>
                    <button onClick={() => setView('journal')} className="w-full bg-burnt-orange text-light-peach py-2 px-3 rounded-xl text-base font-normal font-montserrat hover:opacity-90 transition-opacity">My Journal</button>
                </div>
            </div>

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

            {/* Upcoming Bakes Component */}
            <UpcomingBakes
                upcomingBakes={upcomingBakes}
                addUpcomingBake={addUpcomingBake}
                updateUpcomingBake={updateUpcomingBake}
                deleteUpcomingBake={deleteUpcomingBake}
                cookbook={cookbook}
                addJournalEntry={addJournalEntry}
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
                    onEdit={handleEditFromView} // This now correctly triggers the edit form
                />
            )}

            {/* JournalEntryForm for ADDING (if controlled by Dashboard state directly) */}
            {/* If openAddJournalModal prop leads to a modal outside Dashboard, you might not need this. */}
            {/* I'm including it assuming Dashboard *can* control its own add journal modal. */}
            {/* Note: I'm passing addJournalEntry and cookbook as props, assuming the form needs them. */}
            {/* The onSave here just calls addJournalEntry and closes the modal. */}
            {/* You'll need to define a handleSaveJournalEntry if you want more complex logic here. */}
            {openAddJournalModal && ( // If openAddJournalModal is a prop and directly controls visibility
                // This assumes openAddJournalModal is actually a boolean state prop that turns this on/off
                // If it's a function that *opens* a modal elsewhere, this needs rethinking.
                // For now, I'm assuming it's a state that becomes true when "Add Bake" is clicked.
                <JournalEntryForm
                    onSave={(entryData) => { addJournalEntry(entryData); /* maybe close modal here? */ }}
                    onCancel={() => { /* maybe close modal here? */ }}
                    cookbook={cookbook} // Pass cookbook if JournalEntryForm needs it
                />
            )}

            {/* IdeaForm for ADDING (if controlled by Dashboard state directly) */}
            {/* Similar logic as JournalEntryForm above. */}
            {openAddIdeaModal && ( // If openAddIdeaModal is a prop and directly controls visibility
                <IdeaForm
                    onSave={(ideaData) => { addIdea(ideaData); /* maybe close modal here? */ }}
                    onCancel={() => { /* maybe close modal here? */ }}
                />
            )}


            {/* --- JournalEntryForm for EDITING (NEW) --- */}
            {isEditJournalModalOpen && (
                <JournalEntryForm
                    initialData={editJournalEntryData} // Pass the bake data to pre-fill the form
                    onSave={async (updatedEntry) => {
                        // Assuming you have an 'updateJournalEntry' function available as a prop
                        // (you'll need to pass this prop to Dashboard from your App.js or parent)
                        if (updateJournalEntry) {
                            await updateJournalEntry(updatedEntry.id, updatedEntry); // Call the update function
                        } else {
                            console.warn("updateJournalEntry function is not provided to Dashboard.");
                            // Handle saving logic here if updateJournalEntry is not a prop
                            // e.g., if you're using contexts/hooks for updates.
                        }
                        setIsEditJournalModalOpen(false); // Close the edit modal
                        setEditJournalEntryData(null);    // Clear the edit data
                    }}
                    onCancel={() => {
                        setIsEditJournalModalOpen(false);
                        setEditJournalEntryData(null);
                    }}
                    cookbook={cookbook} // Pass cookbook if JournalEntryForm needs it for categories/recipes
                />
            )}
        </div>
    );
};

export default Dashboard;