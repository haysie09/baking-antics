import React, { useState, useCallback } from 'react';
import DashboardStats from './DashboardStats';
import BakingCalendar from './BakingCalendar';
import UpcomingBakes from './UpcomingBakes';
import AddBakeChoiceModal from '../components/AddBakeChoiceModal';
import UpcomingBakeForm from './UpcomingBakeForm';
import ViewBakeModal from '../components/ViewBakeModal';
import ViewUpcomingBakeModal from '../components/ViewUpcomingBakeModal';

// ... (masterIdeaList constant)
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

    // Updated to handle both past and upcoming bake data
    const handleViewBake = (pastBake, upcomingBake) => {
        setBakeToView({ past: pastBake, upcoming: upcomingBake });
    };

    // Updated to handle which bake is being edited
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
    
    // ... (existing dashboard generator logic)
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
            {/* ... (generator and buttons sections) ... */}
            
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
            {/* ... (other modals) ... */}
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
