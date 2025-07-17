import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    updateProfile 
} from 'firebase/auth';
import { getFirestore, doc, onSnapshot, collection, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const appId = 'baking-antics-v1';

// --- Initialize Firebase ---
const app = firebaseConfig.projectId ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;

// --- Master Bake Idea List ---
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

// --- Predefined Categories & Measurements ---
const journalCategories = ["Bread", "Cake", "Cupcake", "Cookie", "No-Bake", "Cheesecake", "Pastry", "Slice", "Tart"];
const recipeMeasurements = ["cup", "tbsp", "tsp", "g", "kg", "ml", "L", "oz", "lb", "pinch", "unit(s)"];


// --- Helper Components ---

const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-screen bg-app-white">
        <div className="w-16 h-16 border-4 border-light-peach border-t-add-idea rounded-full animate-spin"></div>
    </div>
);

const StarRating = ({ rating, setRating, isEditable = true }) => (
    <div className="flex space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
            <svg key={star} onClick={() => isEditable && setRating(star)} className={`w-6 h-6 ${isEditable ? 'cursor-pointer' : ''} ${rating >= star ? 'text-star-gold' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
        ))}
    </div>
);

const Modal = ({ children, onClose, size = 'sm' }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
        <div className={`bg-app-white rounded-2xl flex flex-col w-full max-w-${size} shadow-xl max-h-[90vh]`}>
            <div className="p-6 overflow-y-auto font-patrick-hand">
                {children}
            </div>
            <div className="p-4 border-t border-gray-200">
                 <button onClick={onClose} className="w-full bg-gray-100 text-app-grey py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors text-xl font-montserrat">Close</button>
            </div>
        </div>
    </div>
);

const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
     <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 font-patrick-hand">
        <div className="bg-app-white rounded-2xl p-8 w-full max-w-sm shadow-xl text-center">
            <p className="text-app-grey text-2xl mb-6">{message}</p>
            <div className="flex justify-center space-x-4">
                <button onClick={onConfirm} className="bg-burnt-orange text-light-peach py-3 px-8 rounded-xl hover:opacity-90 transition-opacity text-xl font-montserrat">Yes</button>
                <button onClick={onCancel} className="bg-gray-100 text-app-grey py-3 px-8 rounded-xl hover:bg-gray-200 transition-colors text-xl font-montserrat">No</button>
            </div>
        </div>
    </div>
);

// --- Main App Components ---

const DashboardStats = ({ journal }) => {
    const stats = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyEntries = journal.filter(entry => {
            const entryDate = new Date(entry.bakingDate);
            return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
        });

        const totalBakes = monthlyEntries.length;
        const totalMinutes = monthlyEntries.reduce((acc, entry) => {
            const hours = entry.timeHours || 0;
            const minutes = entry.timeMinutes || 0;
            return acc + (hours * 60) + minutes;
        }, 0);

        const totalHours = Math.floor(totalMinutes / 60);

        return { totalBakes, totalHours };
    }, [journal]);

    return (
        <div className="bg-info-box p-4 rounded-2xl border border-burnt-orange">
            <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                    <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-4 border-light-peach"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-add-idea" style={{ clipPath: 'inset(0 50% 0 0)' }}></div>
                        <span className="text-4xl font-bold text-burnt-orange font-montserrat">{stats.totalBakes}</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-app-grey font-montserrat">bakes this month</p>
                </div>
                <div>
                     <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-4 border-light-peach"></div>
                         <div className="absolute inset-0 rounded-full border-4 border-add-idea" style={{ clipPath: 'inset(0 0 50% 0)' }}></div>
                        <span className="text-4xl font-bold text-burnt-orange font-montserrat">{stats.totalHours}</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-app-grey font-montserrat">hours spent baking</p>
                </div>
            </div>
        </div>
    );
};

const BakingCalendar = ({ journal, setView, setDateFilter }) => {
    const [currentDate] = useState(new Date()); // Removed unused setCurrentDate

    const bakedDays = useMemo(() => {
        const dates = new Set();
        journal.forEach(entry => {
            dates.add(new Date(entry.bakingDate).toDateString());
        });
        return dates;
    }, [journal]);

    const handleDayClick = (day) => {
        const fullDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        if (bakedDays.has(fullDate.toDateString())) {
            setDateFilter(fullDate.toISOString().split('T')[0]);
            setView('journal');
        } else {
            alert("No baking activity on this day.");
        }
    };

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(<div key={`empty-${i}`}></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
        const isBaked = bakedDays.has(dayDate.toDateString());
        calendarDays.push(
            <div key={i} onClick={() => handleDayClick(i)} className="text-center p-1 cursor-pointer relative">
                {i}
                {isBaked && <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-burnt-orange rounded-full"></div>}
            </div>
        );
    }

    return (
        <div className="bg-info-box p-4 rounded-2xl border border-burnt-orange">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-burnt-orange">My Baking Calendar</h3>
                <button onClick={() => setView('journal')} className="text-burnt-orange" title="Add New Bake">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-sm text-center text-app-grey font-montserrat font-bold">
                <div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div><div>S</div>
            </div>
            <div className="grid grid-cols-7 gap-1 mt-2 font-montserrat text-app-grey">
                {calendarDays}
            </div>
        </div>
    );
};


const Dashboard = ({ setView, ideaPad, addJournalEntry, addIdea, deleteIdea, userId, journal, setDateFilter }) => {
    const [idea, setIdea] = useState({name: '', id: null});
    const [showConfirmation, setShowConfirmation] = useState({journal: false, idea: false});
    const [inspiredBy, setInspiredBy] = useState('');

    const inspireMe = useCallback(() => {
        const randomIndex = Math.floor(Math.random() * masterIdeaList.length);
        setIdea({name: masterIdeaList[randomIndex].ideaName, id: null});
        setShowConfirmation({journal: false, idea: false});
        setInspiredBy('inspireMe');
    }, []);

    const generateFromMyIdeas = useCallback(() => {
        if (!ideaPad || ideaPad.length === 0) {
            setIdea({name: "Your Idea Pad is empty!", id: null});
            setInspiredBy('ideaPad');
            return;
        }
        if (ideaPad.length === 1 && idea.name === ideaPad[0].ideaName) {
            setIdea({name: "You’ve used up all your ideas", id: null});
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

        setIdea({name: newIdea, id: newIdeaId});
        setShowConfirmation({journal: false, idea: false});
        setInspiredBy('ideaPad');
    }, [ideaPad, idea]);

    const handleGeneratorChange = (event) => {
        const value = event.target.value;
        if (value === 'inspireMe') {
            inspireMe();
        } else if (value === 'myIdeas') {
            generateFromMyIdeas();
        }
        event.target.value = ""; // Reset dropdown after selection
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

        setShowConfirmation({journal: true, idea: false});
        setIdea({name: '', id: null});
    };

    const handleAddToIdeaPad = async () => {
        if (!idea.name || idea.name.includes("empty") || idea.name.includes("used up")) return;
        await addIdea({ ideaName: idea.name, notes: 'From Inspire Me!', sourceURL: '', createdAt: new Date(), categories: [] });
        setShowConfirmation({journal: false, idea: true});
        setIdea({name: '', id: null});
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
                        <option value="inspireMe" className="font-montserrat text-app-grey">Generate from Inspire Me!</option>
                        <option value="myIdeas" className="font-montserrat text-app-grey">Generate from My Ideas</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-add-idea">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
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
            
            <DashboardStats journal={journal} />
            <BakingCalendar journal={journal} setView={setView} setDateFilter={setDateFilter} />
        </div>
    );
};

const BakeListIdeaPad = ({ ideas, addIdea, deleteIdea, addJournalEntry }) => {
    const [newIdea, setNewIdea] = useState({ ideaName: '', notes: '', sourceURL: '', categories: [] });
    const [showConfirmModal, setShowConfirmModal] = useState(null);
    const [showAddConfirm, setShowAddConfirm] = useState(false);
    const [showMoveConfirm, setShowMoveConfirm] = useState(false);
    const [activeFilters, setActiveFilters] = useState([]);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [isAddFormVisible, setIsAddFormVisible] = useState(false);

    const handleCategoryToggle = (cat) => {
        const categories = newIdea.categories.includes(cat)
            ? newIdea.categories.filter(c => c !== cat)
            : [...newIdea.categories, cat];
        setNewIdea(p => ({ ...p, categories }));
    };

    const handleAdd = async () => {
        if (newIdea.ideaName.trim()) {
            await addIdea({ ...newIdea, createdAt: new Date() });
            setNewIdea({ ideaName: '', notes: '', sourceURL: '', categories: [] });
            setShowAddConfirm(true);
            setIsAddFormVisible(false);
            setTimeout(() => setShowAddConfirm(false), 3000);
        }
    };
    
    const moveToJournal = async (idea) => {
        const newEntry = {
            entryTitle: idea.ideaName,
            bakingDate: new Date().toISOString().split('T')[0],
            tasteRating: 0, difficultyRating: 0,
            personalNotes: idea.notes || '',
            photoURLs: [], categories: idea.categories || [],
            sourceURL: idea.sourceURL || '',
            createdAt: new Date(),
        };
        await addJournalEntry(newEntry);
        await deleteIdea(idea.id);
        setShowMoveConfirm(true);
        setTimeout(() => setShowMoveConfirm(false), 3000);
    };
    
    const handleFilterToggle = (cat) => {
        setActiveFilters(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
    };

    const filteredIdeas = useMemo(() => {
        if (!ideas) return [];
        if (activeFilters.length === 0) return ideas;
        return ideas.filter(idea => 
            idea.categories && activeFilters.every(filter => idea.categories.includes(filter))
        );
    }, [ideas, activeFilters]);

    return (
        <div className="p-4 md:p-6 bg-app-white h-full font-patrick-hand">
            <h1 className="text-4xl font-bold text-burnt-orange text-center mb-6">Bake List Idea Pad</h1>
            <div className="bg-info-box p-6 rounded-2xl space-y-4 border border-burnt-orange">
                <button onClick={() => setIsAddFormVisible(!isAddFormVisible)} className="w-full bg-burnt-orange text-light-peach py-3 px-6 rounded-xl text-lg hover:opacity-90 transition-opacity font-montserrat flex justify-between items-center">
                    <span>Add Baking Idea</span>
                    <span className={`transform transition-transform ${isAddFormVisible ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {isAddFormVisible && (
                    <div className="space-y-4 pt-4">
                        <input type="text" value={newIdea.ideaName} onChange={(e) => setNewIdea(p => ({...p, ideaName: e.target.value}))} placeholder="Baking Idea Name*" className="w-full p-3 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-burnt-orange focus:outline-none font-montserrat" />
                        <input type="text" value={newIdea.notes} onChange={(e) => setNewIdea(p => ({...p, notes: e.target.value}))} placeholder="Optional notes..." className="w-full p-3 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-burnt-orange focus:outline-none font-montserrat" />
                        <input type="text" value={newIdea.sourceURL} onChange={(e) => setNewIdea(p => ({...p, sourceURL: e.target.value}))} placeholder="Optional link..." className="w-full p-3 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-burnt-orange focus:outline-none font-montserrat" />
                        <div>
                            <label className="block text-app-grey font-semibold mb-2 text-xl">Categories</label>
                            <div className="flex flex-wrap gap-2">{journalCategories.map(cat => <button key={cat} onClick={() => handleCategoryToggle(cat)} className={`py-1 px-3 rounded-xl border text-base font-montserrat ${newIdea.categories.includes(cat) ? 'bg-burnt-orange text-light-peach border-burnt-orange' : 'bg-white text-app-grey border-gray-300'}`}>{cat}</button>)}</div>
                        </div>
                        <button onClick={handleAdd} className="w-full bg-burnt-orange text-light-peach py-3 px-6 rounded-xl text-lg hover:opacity-90 transition-opacity font-montserrat">Add to List</button>
                    </div>
                )}
                {showAddConfirm && <div className="text-center bg-confirm-bg border border-confirm-text text-confirm-text px-4 py-2 rounded-xl text-base" role="alert"><span className="font-montserrat">New idea added!</span></div>}
            </div>
            
            <div className="bg-info-box p-3 rounded-xl my-4 border border-burnt-orange">
                <button onClick={() => setShowFilterDropdown(!showFilterDropdown)} className="w-full flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-app-grey">Filter by Category</h3>
                    <span className={`transform transition-transform text-burnt-orange ${showFilterDropdown ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {showFilterDropdown && (
                    <div className="mt-2 flex flex-wrap gap-2">{journalCategories.map(cat => <button key={cat} onClick={() => handleFilterToggle(cat)} className={`py-1 px-3 rounded-xl border text-base font-montserrat ${activeFilters.includes(cat) ? 'bg-burnt-orange text-light-peach border-burnt-orange' : 'bg-white text-app-grey border-gray-300'}`}>{cat}</button>)}</div>
                )}
                {activeFilters.length > 0 && 
                    <div className="mt-2 pt-2 border-t border-gray-200">
                        <span className="text-sm font-semibold text-app-grey">Active:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {activeFilters.map(f => <span key={f} className="py-1 px-2 rounded-full text-xs bg-burnt-orange text-light-peach font-montserrat">{f}</span>)}
                        </div>
                        <button onClick={() => setActiveFilters([])} className="text-sm text-burnt-orange hover:underline mt-2">Clear Filters</button>
                    </div>
                }
            </div>
            {showMoveConfirm && <div className="text-center bg-confirm-bg border border-confirm-text text-confirm-text px-4 py-2 rounded-xl text-base mb-4" role="alert"><span className="font-montserrat">Idea added to your journal!</span></div>}

            <div className="space-y-3 mt-6 max-h-96 overflow-y-auto p-1">
                {filteredIdeas.length === 0 ? <p className="text-center text-app-grey py-8 text-2xl">{ideas.length > 0 ? "No ideas match filters" : "Add Baking Notes & Ideas"}</p> : [...filteredIdeas].sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate()).map(idea => (
                    <div key={idea.id} className="bg-info-box p-3 rounded-xl border border-burnt-orange">
                        <div className="flex items-center justify-between">
                            <span className="text-burnt-orange text-xl font-semibold">{idea.ideaName}</span>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => moveToJournal(idea)} className="text-burnt-orange hover:opacity-70" title="Move to Journal"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" /></svg></button>
                                <button onClick={() => setShowConfirmModal(idea.id)} className="text-burnt-orange hover:opacity-70" title="Delete Idea"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                            </div>
                        </div>
                        {idea.notes && <p className="text-app-grey/80 mt-1 text-base font-montserrat">{idea.notes}</p>}
                        {idea.sourceURL && <a href={idea.sourceURL} target="_blank" rel="noopener noreferrer" className="text-burnt-orange hover:underline text-lg"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg></a>}
                    </div>
                ))}
            </div>
            {showConfirmModal && <ConfirmationModal message="Delete this idea?" onConfirm={() => { deleteIdea(showConfirmModal); setShowConfirmModal(null); }} onCancel={() => setShowConfirmModal(null)} />}
        </div>
    );
};

const JournalEntryForm = ({ entry, onSave, onCancel, isNew = false, cookbook }) => {
    const [formData, setFormData] = useState(entry || { entryTitle: '', bakingDate: new Date().toISOString().split('T')[0], tasteRating: 0, difficultyRating: 0, personalNotes: '', photoURLs: [], categories: [], sourceURL: '', timeHours: '', timeMinutes: '' });

    const handleCategoryToggle = (cat) => {
        const categories = formData.categories.includes(cat)
            ? formData.categories.filter(c => c !== cat)
            : [...formData.categories, cat];
        setFormData(p => ({ ...p, categories }));
    };

    const handleCookbookSelect = (e) => {
        const recipeId = e.target.value;
        if (!recipeId) {
            setFormData(p => ({...p, entryTitle: '', sourceURL: ''}));
            return;
        };
        const selectedRecipe = cookbook.find(r => r.id === recipeId);
        if (selectedRecipe) {
            setFormData(p => ({
                ...p,
                entryTitle: selectedRecipe.recipeTitle,
                sourceURL: selectedRecipe.sourceURL,
                categories: selectedRecipe.categories || []
            }));
        }
    };

    return (
        <Modal onClose={onCancel} size="md">
            <div className="space-y-4 text-xl">
                <h2 className="text-4xl font-bold text-burnt-orange">{isNew ? 'Add a Past Bake' : 'Edit Journal Entry'}</h2>
                
                {isNew && (
                    <div className="relative">
                         <select 
                            onChange={handleCookbookSelect} 
                            className="w-full bg-white text-add-idea font-bold py-3 px-4 rounded-xl text-lg hover:bg-light-peach transition-colors shadow-sm font-montserrat appearance-none text-center"
                            defaultValue=""
                        >
                            <option value="" disabled>Or Choose from My Cookbook</option>
                            {cookbook.map(recipe => (
                                <option key={recipe.id} value={recipe.id} className="font-montserrat text-app-grey">{recipe.recipeTitle}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-add-idea">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                )}

                <div><label className="block text-app-grey font-semibold mb-1">Bake Name</label><input type="text" name="entryTitle" value={formData.entryTitle} onChange={(e) => setFormData(p=>({...p, entryTitle: e.target.value}))} className="w-full p-3 border border-gray-300 rounded-xl text-xl font-montserrat"/></div>
                <div><label className="block text-app-grey font-semibold mb-1">Baking Date</label><input type="date" name="bakingDate" value={formData.bakingDate} onChange={(e) => setFormData(p=>({...p, bakingDate: e.target.value}))} className="w-full p-3 border border-gray-300 rounded-xl text-xl font-montserrat"/></div>
                <div><label className="block text-app-grey font-semibold mb-1">Recipe Source URL</label><input type="text" name="sourceURL" value={formData.sourceURL} onChange={(e) => setFormData(p=>({...p, sourceURL: e.target.value}))} className="w-full p-3 border border-gray-300 rounded-xl text-xl font-montserrat"/></div>
                
                <div>
                    <label className="block text-app-grey font-semibold mb-1">Time Spent</label>
                    <div className="flex gap-4">
                        <input type="number" min="0" placeholder="Hour(s)" value={formData.timeHours} onChange={e => setFormData(p => ({...p, timeHours: Number(e.target.value)}))} className="w-1/2 p-3 border border-gray-300 rounded-xl text-lg font-montserrat" />
                        <input type="number" min="0" max="59" placeholder="Minute(s)" value={formData.timeMinutes} onChange={e => setFormData(p => ({...p, timeMinutes: Number(e.target.value)}))} className="w-1/2 p-3 border border-gray-300 rounded-xl text-lg font-montserrat" />
                    </div>
                </div>

                <div className="flex justify-between items-center py-2"><label className="text-app-grey font-semibold">Taste</label><StarRating rating={formData.tasteRating} setRating={(r) => setFormData(p => ({...p, tasteRating: r}))} /></div>
                <div className="flex justify-between items-center py-2"><label className="text-app-grey font-semibold">Difficulty</label><StarRating rating={formData.difficultyRating} setRating={(r) => setFormData(p => ({...p, difficultyRating: r}))} /></div>
                <div><label className="block text-app-grey font-semibold mb-1">Categories</label><div className="flex flex-wrap gap-2">{journalCategories.map(cat => <button key={cat} onClick={() => handleCategoryToggle(cat)} className={`py-1 px-3 rounded-xl border text-base font-montserrat ${formData.categories && formData.categories.includes(cat) ? 'bg-burnt-orange text-light-peach border-burnt-orange' : 'bg-white text-app-grey border-gray-300'}`}>{cat}</button>)}</div></div>
                <div><label className="block text-app-grey font-semibold mb-1">Personal Notes</label><textarea name="personalNotes" value={formData.personalNotes} onChange={(e) => setFormData(p=>({...p, personalNotes: e.target.value}))} rows="4" className="w-full p-3 border border-gray-300 rounded-lg text-lg font-montserrat"></textarea></div>
                <div><label className="block text-app-grey font-semibold mb-1">Photos</label><div className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-app-grey/70">Photo upload coming soon!</div></div>
                <button onClick={() => onSave(formData)} className="w-full bg-burnt-orange text-light-peach py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity text-xl font-montserrat">Save Entry</button>
            </div>
        </Modal>
    );
};

const BakingJournal = ({ journal, addJournalEntry, updateJournalEntry, deleteJournalEntry, cookbook, dateFilter, setDateFilter }) => {
    const [editingEntry, setEditingEntry] = useState(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(null);
    const [activeFilters, setActiveFilters] = useState([]);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [expandedJournalId, setExpandedJournalId] = useState(null);

    const handleSave = async (entryData) => {
        if (isCreatingNew) await addJournalEntry({ ...entryData, createdAt: new Date() });
        else await updateJournalEntry(editingEntry.id, entryData);
        setEditingEntry(null); setIsCreatingNew(false);
    };

    const handleFilterToggle = (cat) => {
        setActiveFilters(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
    };

    const filteredJournal = useMemo(() => {
        let entries = journal || [];
        if (dateFilter) {
            entries = entries.filter(entry => entry.bakingDate === dateFilter);
        }
        if (activeFilters.length === 0) return entries;
        return entries.filter(entry => 
            entry.categories && activeFilters.every(filter => entry.categories.includes(filter))
        );
    }, [journal, activeFilters, dateFilter]);
    
    useEffect(() => {
        // Clear date filter when navigating away
        return () => {
            setDateFilter(null);
        }
    }, [setDateFilter]);

    return (
        <div className="p-4 md:p-6 bg-app-white min-h-full font-patrick-hand">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-4xl font-bold text-burnt-orange">Baking Journal</h1>
                <button onClick={() => setIsCreatingNew(true)} className="bg-burnt-orange text-light-peach py-1 px-4 rounded-xl font-normal hover:opacity-90 transition-opacity text-base font-montserrat">Add Bake</button>
            </div>
            <div className="bg-info-box p-3 rounded-xl mb-4 border border-burnt-orange">
                <button onClick={() => setShowFilterDropdown(!showFilterDropdown)} className="w-full flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-app-grey">Filter by Category</h3>
                    <span className={`transform transition-transform text-burnt-orange ${showFilterDropdown ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {showFilterDropdown && (
                    <div className="mt-2 flex flex-wrap gap-2">{journalCategories.map(cat => <button key={cat} onClick={() => handleFilterToggle(cat)} className={`py-1 px-3 rounded-xl border text-base font-montserrat ${activeFilters.includes(cat) ? 'bg-burnt-orange text-light-peach border-burnt-orange' : 'bg-white text-app-grey border-gray-300'}`}>{cat}</button>)}</div>
                )}
                {activeFilters.length > 0 && 
                    <div className="mt-2 pt-2 border-t border-gray-200">
                        <span className="text-sm font-semibold text-app-grey">Active:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {activeFilters.map(f => <span key={f} className="py-1 px-2 rounded-full text-xs bg-burnt-orange text-light-peach font-montserrat">{f}</span>)}
                        </div>
                        <button onClick={() => setActiveFilters([])} className="text-sm text-burnt-orange hover:underline mt-2">Clear Filters</button>
                    </div>
                }
            </div>
            <div className="space-y-4">
                {filteredJournal.length === 0 ? <div className="text-center py-16 bg-info-box rounded-xl border border-burnt-orange"><p className="text-app-grey text-2xl">{journal && journal.length > 0 ? "No entries match filters" : "Start your Baking Journal"}</p></div> : [...filteredJournal].sort((a, b) => new Date(b.bakingDate) - new Date(a.bakingDate)).map(entry => (
                    <div key={entry.id} className="bg-info-box p-4 rounded-xl border border-burnt-orange">
                        <div className="flex justify-between items-start cursor-pointer" onClick={() => setExpandedJournalId(expandedJournalId === entry.id ? null : entry.id)}>
                            <div>
                                <h3 className="text-2xl font-bold text-burnt-orange">{entry.entryTitle}</h3>
                                <p className="text-base text-app-grey/80 font-montserrat">{new Date(entry.bakingDate).toLocaleDateString('en-GB')}</p>
                            </div>
                             <span className={`transform transition-transform text-burnt-orange ${expandedJournalId === entry.id ? 'rotate-180' : ''}`}>▼</span>
                        </div>
                        {expandedJournalId === entry.id && (
                            <div className="mt-4 pt-4 border-t border-burnt-orange/20">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-lg"><div><span className="font-semibold text-app-grey mr-2">Taste:</span><StarRating rating={entry.tasteRating} isEditable={false} /></div><div><span className="font-semibold text-app-grey mr-2">Difficulty:</span><StarRating rating={entry.difficultyRating} isEditable={false} /></div></div>
                                    <div className="flex space-x-2 text-burnt-orange">
                                        {entry.sourceURL && <a href={entry.sourceURL} target="_blank" rel="noopener noreferrer" className="hover:opacity-70"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg></a>}
                                        <button onClick={(e) => {e.stopPropagation(); setEditingEntry(entry)}} className="hover:opacity-70"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg></button>
                                        <button onClick={(e) => {e.stopPropagation(); setShowConfirmModal(entry.id)}} className="hover:opacity-70"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                    </div>
                                </div>
                                {entry.categories && entry.categories.length > 0 && <div className="mt-2 flex flex-wrap gap-2">{entry.categories.map(c => <span key={c} className="py-1 px-3 rounded-full text-sm bg-app-white border border-gray-200 text-app-grey font-montserrat">{c}</span>)}</div>}
                                {entry.personalNotes && <p className="mt-4 text-app-grey bg-app-white p-3 rounded-lg text-lg font-montserrat">{entry.personalNotes}</p>}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {(editingEntry || isCreatingNew) && <JournalEntryForm entry={editingEntry} cookbook={cookbook} isNew={isCreatingNew} onSave={handleSave} onCancel={() => { setEditingEntry(null); setIsCreatingNew(false); }} />}
            {showConfirmModal && <ConfirmationModal message="Delete this entry?" onConfirm={() => {deleteJournalEntry(showConfirmModal); setShowConfirmModal(null);}} onCancel={() => setShowConfirmModal(null)} />}
        </div>
    );
};

const CookbookForm = ({ recipe, onSave, onCancel, isNew = false }) => {
    // ... This component's code remains the same ...
    const [formData, setFormData] = useState(recipe || { recipeTitle: '', sourceURL: '', ingredients: [{ quantity: '', measurement: 'cup', name: '' }], instructions: '', categories: [] });

    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...formData.ingredients];
        newIngredients[index][field] = value;
        setFormData(p => ({ ...p, ingredients: newIngredients }));
    };
    const addIngredient = () => setFormData(p => ({ ...p, ingredients: [...p.ingredients, { quantity: '', measurement: 'cup', name: '' }] }));
    const removeIngredient = (index) => setFormData(p => ({ ...p, ingredients: p.ingredients.filter((_, i) => i !== index) }));
    
    const handleCategoryToggle = (cat) => {
        const categories = formData.categories.includes(cat)
            ? formData.categories.filter(c => c !== cat)
            : [...formData.categories, cat];
        setFormData(p => ({ ...p, categories }));
    };

    return (
        <Modal onClose={onCancel} size="lg">
            <div className="space-y-4 text-xl">
                <h2 className="text-4xl font-bold text-burnt-orange">{isNew ? 'Add New Recipe' : 'Edit Recipe'}</h2>
                <div><label className="block text-app-grey font-semibold mb-1">Recipe Title</label><input type="text" value={formData.recipeTitle} onChange={(e) => setFormData(p=>({...p, recipeTitle: e.target.value}))} className="w-full p-3 border border-gray-300 rounded-xl text-xl font-montserrat"/></div>
                <div><label className="block text-app-grey font-semibold mb-1">Source URL</label><input type="text" value={formData.sourceURL} onChange={(e) => setFormData(p=>({...p, sourceURL: e.target.value}))} className="w-full p-3 border border-gray-300 rounded-xl text-xl font-montserrat"/></div>
                <div><label className="block text-app-grey font-semibold mb-1">Categories</label><div className="flex flex-wrap gap-2">{journalCategories.map(cat => <button key={cat} onClick={() => handleCategoryToggle(cat)} className={`py-1 px-3 rounded-xl border text-base font-montserrat ${formData.categories && formData.categories.includes(cat) ? 'bg-burnt-orange text-light-peach border-burnt-orange' : 'bg-white text-app-grey border-gray-300'}`}>{cat}</button>)}</div></div>
                <div><label className="block text-app-grey font-semibold mb-1">Ingredients</label>
                    <div className="space-y-2 font-montserrat">{formData.ingredients.map((ing, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input type="text" placeholder="Qty" value={ing.quantity} onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)} className="w-1/4 p-2 border border-gray-300 rounded-xl text-lg" />
                            <select value={ing.measurement} onChange={(e) => handleIngredientChange(index, 'measurement', e.target.value)} className="w-1/2 p-2 border border-gray-300 rounded-xl text-lg bg-white"><option value="">Unit</option>{recipeMeasurements.map(m => <option key={m} value={m}>{m}</option>)}</select>
                            <input type="text" placeholder="Name" value={ing.name} onChange={(e) => handleIngredientChange(index, 'name', e.target.value)} className="w-full p-2 border border-gray-300 rounded-xl text-lg" />
                            <button onClick={() => removeIngredient(index)} className="text-red-500 hover:text-red-700">&times;</button>
                        </div>))}
                    </div>
                    <button onClick={addIngredient} className="mt-2 text-sm text-burnt-orange hover:underline">+ Add Ingredient</button>
                </div>
                <div><label className="block text-app-grey font-semibold mb-1">Instructions</label><textarea value={formData.instructions} onChange={(e) => setFormData(p=>({...p, instructions: e.target.value}))} rows="8" className="w-full p-3 border border-gray-300 rounded-lg text-lg font-montserrat"></textarea></div>
                <button onClick={() => onSave(formData)} className="w-full bg-burnt-orange text-light-peach py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity text-xl font-montserrat">Save Recipe</button>
            </div>
        </Modal>
    );
};

const MyCookbook = ({ cookbook, addRecipe, updateRecipe, deleteRecipe }) => {
    const [editingRecipe, setEditingRecipe] = useState(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(null);
    const [expandedCookbookId, setExpandedCookbookId] = useState(null);
    const [activeFilters, setActiveFilters] = useState([]);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    const handleSave = async (recipeData) => {
        if (isCreatingNew) await addRecipe({ ...recipeData, createdAt: new Date() });
        else await updateRecipe(editingRecipe.id, recipeData);
        setEditingRecipe(null); setIsCreatingNew(false);
    };

    const handleFilterToggle = (cat) => {
        setActiveFilters(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
    };

    const filteredCookbook = useMemo(() => {
        if (!cookbook) return [];
        if (activeFilters.length === 0) return cookbook;
        return cookbook.filter(recipe => 
            recipe.categories && activeFilters.every(filter => recipe.categories.includes(filter))
        );
    }, [cookbook, activeFilters]);

    return (
        <div className="p-4 md:p-6 bg-app-white min-h-full font-patrick-hand">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-burnt-orange">My Cookbook</h1>
                <button onClick={() => setIsCreatingNew(true)} className="bg-burnt-orange text-light-peach py-1 px-4 rounded-xl font-normal hover:opacity-90 transition-opacity text-base font-montserrat">Add Recipe</button>
            </div>
             <div className="bg-info-box p-3 rounded-xl mb-4 border border-burnt-orange">
                <button onClick={() => setShowFilterDropdown(!showFilterDropdown)} className="w-full flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-app-grey">Filter by Category</h3>
                    <span className={`transform transition-transform text-burnt-orange ${showFilterDropdown ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {showFilterDropdown && (
                    <div className="mt-2 flex flex-wrap gap-2">{journalCategories.map(cat => <button key={cat} onClick={() => handleFilterToggle(cat)} className={`py-1 px-3 rounded-xl border text-base font-montserrat ${activeFilters.includes(cat) ? 'bg-burnt-orange text-light-peach border-burnt-orange' : 'bg-white text-app-grey border-gray-300'}`}>{cat}</button>)}</div>
                )}
                {activeFilters.length > 0 && 
                    <div className="mt-2 pt-2 border-t border-gray-200">
                        <span className="text-sm font-semibold text-app-grey">Active:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {activeFilters.map(f => <span key={f} className="py-1 px-2 rounded-full text-xs bg-burnt-orange text-light-peach font-montserrat">{f}</span>)}
                        </div>
                        <button onClick={() => setActiveFilters([])} className="text-sm text-burnt-orange hover:underline mt-2">Clear Filters</button>
                    </div>
                }
            </div>
            <div className="space-y-4">
                {filteredCookbook.length === 0 ? <div className="text-center py-16 bg-info-box rounded-xl border border-burnt-orange"><p className="text-app-grey text-2xl">{cookbook && cookbook.length > 0 ? "No recipes match filters" : "Save your favorite recipes"}</p></div> : [...filteredCookbook].sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate()).map(recipe => (
                    <div key={recipe.id} className="bg-info-box p-4 rounded-xl border border-burnt-orange">
                        <div className="flex justify-between items-start cursor-pointer" onClick={() => setExpandedCookbookId(expandedCookbookId === recipe.id ? null : recipe.id)}>
                            <h3 className="text-2xl font-bold text-burnt-orange">{recipe.recipeTitle}</h3>
                            <span className={`transform transition-transform text-burnt-orange ${expandedCookbookId === recipe.id ? 'rotate-180' : ''}`}>▼</span>
                        </div>
                        {expandedCookbookId === recipe.id && (
                            <div className="mt-4 pt-4 border-t border-burnt-orange/20">
                                <div className="flex justify-end space-x-2 text-burnt-orange mb-2">
                                     {recipe.sourceURL && <a href={recipe.sourceURL} target="_blank" rel="noopener noreferrer" className="hover:opacity-70"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg></a>}
                                    <button onClick={(e) => {e.stopPropagation(); setEditingRecipe(recipe)}} className="hover:opacity-70"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg></button>
                                    <button onClick={(e) => {e.stopPropagation(); setShowConfirmModal(recipe.id)}} className="hover:opacity-70"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                </div>
                                <div className="font-montserrat">
                                    <h4 className="font-semibold text-2xl text-burnt-orange font-patrick-hand">Ingredients</h4>
                                    <ul className="list-disc list-inside text-lg text-app-grey">{recipe.ingredients && recipe.ingredients.map((ing, i) => <li key={i}>{ing.quantity} {ing.measurement} {ing.name}</li>)}</ul>
                                </div>
                                <div className="mt-4 font-montserrat">
                                    <h4 className="font-semibold text-2xl text-burnt-orange font-patrick-hand">Instructions</h4>
                                    <p className="whitespace-pre-wrap text-lg text-app-grey">{recipe.instructions}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {(editingRecipe || isCreatingNew) && <CookbookForm recipe={editingRecipe} isNew={isCreatingNew} onSave={handleSave} onCancel={() => { setEditingRecipe(null); setIsCreatingNew(false); }} />}
            {showConfirmModal && <ConfirmationModal message="Delete this recipe?" onConfirm={() => {deleteRecipe(showConfirmModal); setShowConfirmModal(null);}} onCancel={() => setShowConfirmModal(null)} />}
        </div>
    );
};

// --- Main App Component ---
export default function App() {
    const [user, setUser] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    
    useEffect(() => {
        if (!auth) {
            setIsAuthReady(true);
            return;
        }
        const unsub = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsAuthReady(true);
        });
        return () => unsub();
    }, []);

    if (!isAuthReady || !app) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return <AuthPage />;
    }

    return <MainApp user={user} />;
}

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');

    const handleAuthAction = async () => {
        setError('');
        if (isLogin) {
            try {
                await signInWithEmailAndPassword(auth, email, password);
            } catch (err) {
                setError(err.message);
            }
        } else {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                if (nickname) {
                    await updateProfile(userCredential.user, { displayName: nickname });
                }
            } catch (err) {
                setError(err.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-app-white flex items-center justify-center p-4 font-patrick-hand">
            <div className="w-full max-w-sm mx-auto">
                <h1 className="text-5xl font-bold text-add-idea text-center mb-8">Baking Antics</h1>
                <div className="bg-info-box p-8 rounded-2xl border border-burnt-orange space-y-6">
                    <h2 className="text-3xl text-burnt-orange text-center">{isLogin ? 'Log In' : 'Sign Up'}</h2>
                    {!isLogin && (
                         <input 
                            type="text" 
                            value={nickname} 
                            onChange={(e) => setNickname(e.target.value)} 
                            placeholder="Name / Nickname (Optional)" 
                            className="w-full p-3 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-burnt-orange focus:outline-none font-montserrat"
                        />
                    )}
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Email" 
                        className="w-full p-3 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-burnt-orange focus:outline-none font-montserrat"
                    />
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Password" 
                        className="w-full p-3 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-burnt-orange focus:outline-none font-montserrat"
                    />
                    {error && <p className="text-red-500 text-sm text-center font-montserrat">{error}</p>}
                    <button onClick={handleAuthAction} className="w-full bg-burnt-orange text-light-peach py-3 px-6 rounded-xl text-xl hover:opacity-90 transition-opacity font-montserrat">
                        {isLogin ? 'Log In' : 'Sign Up'}
                    </button>
                    <button onClick={() => setIsLogin(!isLogin)} className="w-full text-center text-app-grey hover:text-burnt-orange text-lg">
                        {isLogin ? 'Need an account? Sign Up' : 'Have an account? Log In'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const MainApp = ({ user }) => {
    const [view, setView] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [dateFilter, setDateFilter] = useState(null);
    
    // Data states
    const [ideaPad, setIdeaPad] = useState([]);
    const [journal, setJournal] = useState([]);
    const [cookbook, setCookbook] = useState([]);
    
    const userId = user.uid;

    // Firestore Collections
    const ideaPadCol = useMemo(() => userId && db ? collection(db, 'artifacts', appId, 'users', userId, 'ideapad') : null, [userId]);
    const journalCol = useMemo(() => userId && db ? collection(db, 'artifacts', appId, 'users', userId, 'journal') : null, [userId]);
    const cookbookCol = useMemo(() => userId && db ? collection(db, 'artifacts', appId, 'users', userId, 'cookbook') : null, [userId]);

    // Data Fetching
    useEffect(() => { if (userId && ideaPadCol) return onSnapshot(ideaPadCol, s => setIdeaPad(s.docs.map(d => ({ id: d.id, ...d.data() })))); }, [userId, ideaPadCol]);
    useEffect(() => { if (userId && journalCol) return onSnapshot(journalCol, s => setJournal(s.docs.map(d => ({ id: d.id, ...d.data() })))); }, [userId, journalCol]);
    useEffect(() => { if (userId && cookbookCol) return onSnapshot(cookbookCol, s => setCookbook(s.docs.map(d => ({ id: d.id, ...d.data() })))); }, [userId, cookbookCol]);

    // Data Manipulation Functions
    const addIdea = useCallback(async (idea) => { if (ideaPadCol) await addDoc(ideaPadCol, idea); }, [ideaPadCol]);
    const deleteIdea = useCallback(async (id) => { if (ideaPadCol) await deleteDoc(doc(ideaPadCol, id)); }, [ideaPadCol]);
    const addJournalEntry = useCallback(async (entry) => { if (journalCol) await addDoc(journalCol, entry); }, [journalCol]);
    const updateJournalEntry = useCallback(async (id, entry) => { if (journalCol) await updateDoc(doc(journalCol, id), entry); }, [journalCol]);
    const deleteJournalEntry = useCallback(async (id) => { if (journalCol) await deleteDoc(doc(journalCol, id)); }, [journalCol]);
    const addRecipe = useCallback(async (recipe) => { if (cookbookCol) await addDoc(cookbookCol, recipe); }, [cookbookCol]);
    const updateRecipe = useCallback(async (id, recipe) => { if (cookbookCol) await updateDoc(doc(cookbookCol, id), recipe); }, [cookbookCol]);
    const deleteRecipe = useCallback(async (id) => { if (cookbookCol) await deleteDoc(doc(cookbookCol, id)); }, [cookbookCol]);

    const renderView = () => {
        switch (view) {
            case 'dashboard': return <Dashboard setView={setView} ideaPad={ideaPad} addJournalEntry={addJournalEntry} addIdea={addIdea} deleteIdea={deleteIdea} userId={userId} journal={journal} setDateFilter={setDateFilter} />;
            case 'ideapad': return <BakeListIdeaPad ideas={ideaPad} addIdea={addIdea} deleteIdea={deleteIdea} addJournalEntry={addJournalEntry} />;
            case 'journal': return <BakingJournal journal={journal} addJournalEntry={addJournalEntry} updateJournalEntry={updateJournalEntry} deleteJournalEntry={deleteJournalEntry} cookbook={cookbook} dateFilter={dateFilter} setDateFilter={setDateFilter} />;
            case 'cookbook': return <MyCookbook cookbook={cookbook} addRecipe={addRecipe} updateRecipe={updateRecipe} deleteRecipe={deleteRecipe} />;
            default: return <Dashboard setView={setView} ideaPad={ideaPad} addJournalEntry={addJournalEntry} addIdea={addIdea} deleteIdea={deleteIdea} userId={userId} journal={journal} setDateFilter={setDateFilter} />;
        }
    };
    
    const handleSignOut = async () => {
        await signOut(auth);
    };
    
    const navigate = (newView) => {
        setView(newView);
        setIsSidebarOpen(false);
    };

    return (
        <div className="bg-app-white text-app-grey">
            <div className="min-h-screen flex flex-col md:items-center md:justify-center md:py-8 bg-gray-100">
                <div className="w-full md:max-w-md md:shadow-2xl md:overflow-hidden bg-app-white flex flex-col flex-grow relative">
                    {/* Sidebar */}
                    <div className={`fixed inset-y-0 left-0 w-64 bg-info-box z-50 transform transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-lg`}>
                        <div className="p-4 font-patrick-hand">
                           <h2 className="text-2xl font-bold text-add-idea">My Baking Hub</h2>
                           <div className="text-sm text-app-grey mt-1 mb-4 truncate">{user.displayName || user.email}</div>
                           <nav className="flex flex-col space-y-2 font-montserrat">
                                <button onClick={() => navigate('dashboard')} className="text-left p-2 rounded-lg hover:bg-light-peach">Dashboard</button>
                                <button onClick={() => navigate('ideapad')} className="text-left p-2 rounded-lg hover:bg-light-peach">Idea Pad</button>
                                <button onClick={() => navigate('journal')} className="text-left p-2 rounded-lg hover:bg-light-peach">My Journal</button>
                                <button onClick={() => navigate('cookbook')} className="text-left p-2 rounded-lg hover:bg-light-peach">My Cookbook</button>
                           </nav>
                           <div className="absolute bottom-0 left-0 w-full p-4">
                               <button onClick={handleSignOut} className="w-full text-left p-2 rounded-lg hover:bg-light-peach font-montserrat">Sign Out</button>
                           </div>
                        </div>
                    </div>
                    {/* Overlay */}
                    {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>}

                    <header className="bg-app-white shadow-md sticky top-0 z-30 font-patrick-hand">
                        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                            <button onClick={() => setIsSidebarOpen(true)} className="text-add-idea">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                            </button>
                            <div className="text-2xl font-bold text-add-idea">Baking Antics</div>
                             {/* Placeholder for alignment */}
                            <div className="w-8"></div>
                        </nav>
                    </header>
                    <main className="flex-grow overflow-y-auto bg-app-white">{renderView()}</main>
                </div>
            </div>
        </div>
    );
}
