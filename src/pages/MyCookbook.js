import React, { useState, useMemo } from 'react';
import CookbookForm from './CookbookForm';
import ConfirmationModal from '../components/ConfirmationModal';
import AddFromURLModal from '../components/AddFromURLModal';
import FilterComponent from '../components/FilterComponent';
import AddRecipeChoiceModal from '../components/AddRecipeChoiceModal';
import StarRating from '../components/StarRating';

// --- Helper component for the folder style ---
const FolderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-burnt-orange/50">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
);

// --- A simple modal for adding/editing a collection name ---
const CollectionFormModal = ({ onSave, onCancel, collection = null }) => {
    const [name, setName] = useState(collection ? collection.name : '');

    const handleSave = () => {
        if (name.trim()) {
            onSave(name);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 font-patrick-hand">
            <div className="bg-app-white rounded-2xl p-8 w-full max-w-sm shadow-xl text-center space-y-4">
                <h2 className="text-3xl text-burnt-orange">{collection ? 'Rename Collection' : 'New Collection'}</h2>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Cakes, Breads..."
                    className="w-full p-3 border border-gray-300 rounded-xl text-lg font-montserrat"
                />
                <div className="flex justify-center space-x-4 pt-2">
                    <button onClick={handleSave} className="bg-add-idea text-white py-3 px-8 rounded-xl text-xl font-montserrat">Save</button>
                    <button onClick={onCancel} className="bg-gray-100 text-app-grey py-3 px-8 rounded-xl text-xl font-montserrat">Cancel</button>
                </div>
            </div>
        </div>
    );
};


// --- Main MyCookbook Component ---
const MyCookbook = ({ cookbook, addRecipe, updateRecipe, deleteRecipe, collections, addCollection, updateCollection, deleteCollection }) => {
    // --- State for view management ---
    const [currentView, setCurrentView] = useState('collections');
    const [selectedCollection, setSelectedCollection] = useState(null);

    // --- State for modals ---
    const [isCollectionFormOpen, setIsCollectionFormOpen] = useState(false);
    const [collectionToEdit, setCollectionToEdit] = useState(null);
    const [collectionToDelete, setCollectionToDelete] = useState(null);
    const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);
    const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
    
    // --- State for recipe management ---
    const [viewingRecipe, setViewingRecipe] = useState(null); // For read-only view
    const [editingRecipe, setEditingRecipe] = useState(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [recipeToDelete, setRecipeToDelete] = useState(null);
    const [importedRecipeData, setImportedRecipeData] = useState(null);

    // --- State for filtering ---
    const [activeFilters, setActiveFilters] = useState({ categories: [], month: 'all', year: 'all' });
    const recipeCategories = ["Bread", "Cake", "Cupcake", "Cookie", "No-Bake", "Cheesecake", "Pastry", "Slice", "Tart"];

    // --- Data Memoization ---
    const collectionRecipeCounts = useMemo(() => {
        const counts = { unassigned: 0 };
        collections.forEach(col => { counts[col.id] = 0; });
        cookbook.forEach(recipe => {
            if (recipe.collectionId && counts.hasOwnProperty(recipe.collectionId)) {
                counts[recipe.collectionId]++;
            } else {
                counts.unassigned++;
            }
        });
        return counts;
    }, [cookbook, collections]);

    const recipesInView = useMemo(() => {
        let recipes = cookbook || [];

        // Filter by selected collection
        if (selectedCollection) {
            if (selectedCollection.id === 'unassigned') {
                recipes = recipes.filter(recipe => !recipe.collectionId);
            } else {
                recipes = recipes.filter(recipe => recipe.collectionId === selectedCollection.id);
            }
        }
        
        // Filter by active filters (from FilterComponent)
        if (activeFilters.categories.length > 0) {
            recipes = recipes.filter(recipe => 
                activeFilters.categories.every(filterCat => recipe.categories?.includes(filterCat))
            );
        }
        if (activeFilters.month !== 'all') {
            recipes = recipes.filter(recipe => new Date(recipe.createdAt.toDate()).getMonth() === parseInt(activeFilters.month));
        }
        if (activeFilters.year !== 'all') {
            recipes = recipes.filter(recipe => new Date(recipe.createdAt.toDate()).getFullYear() === parseInt(activeFilters.year));
        }
        
        return recipes.sort((a, b) => new Date(b.createdAt.toDate()) - new Date(a.createdAt.toDate()));
    }, [cookbook, selectedCollection, activeFilters]);

    // --- Handlers for Collections ---
    const handleSaveCollection = (name) => {
        if (collectionToEdit) {
            updateCollection(collectionToEdit.id, name);
        } else {
            addCollection(name);
        }
        setIsCollectionFormOpen(false);
        setCollectionToEdit(null);
    };

    const handleConfirmDeleteCollection = () => {
        if (collectionToDelete) {
            deleteCollection(collectionToDelete.id);
        }
        setCollectionToDelete(null);
    };

    const handleViewCollection = (collection) => {
        setSelectedCollection(collection);
        setCurrentView('recipes');
    };

    // --- Handlers for Recipe Flow ---
    const handleChooseImport = () => { setIsChoiceModalOpen(false); setIsUrlModalOpen(true); };
    const handleChooseManual = () => { setIsChoiceModalOpen(false); setIsCreatingNew(true); };
    const handleImportRecipe = (data) => { setImportedRecipeData(data); setIsUrlModalOpen(false); setIsCreatingNew(true); };
    
    const handleSaveRecipe = async (recipeData) => {
        if (isCreatingNew || importedRecipeData) {
            await addRecipe({ ...recipeData, createdAt: new Date() });
            setImportedRecipeData(null);
        } else {
            await updateRecipe(editingRecipe.id, recipeData);
        }
        setEditingRecipe(null);
        setIsCreatingNew(false);
        setCurrentView('recipes'); 
    };

    const handleConfirmDeleteRecipe = () => {
        if (recipeToDelete) {
            deleteRecipe(recipeToDelete.id);
            setRecipeToDelete(null);
            setViewingRecipe(null);
        }
    };
    
    const handleCancelForm = () => {
        setEditingRecipe(null);
        setIsCreatingNew(false);
        setImportedRecipeData(null);
    };

    // --- RENDER LOGIC ---

    // RENDER: Read-Only Recipe Detail View
    if (viewingRecipe) {
        return (
            <div className="p-4 md:p-6 bg-app-white min-h-full font-patrick-hand">
                <button onClick={() => setViewingRecipe(null)} className="font-montserrat text-burnt-orange mb-4 flex items-center gap-1 hover:underline">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Back to Recipes
                </button>
                <div className="bg-info-box p-6 rounded-xl border border-burnt-orange">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-4xl font-bold text-burnt-orange">{viewingRecipe.recipeTitle}</h1>
                        <div className="flex gap-2">
                            <button onClick={() => { setEditingRecipe(viewingRecipe); setViewingRecipe(null); }} className="bg-add-idea text-white py-2 px-4 rounded-xl text-sm font-montserrat">Edit</button>
                            <button onClick={() => setRecipeToDelete(viewingRecipe)} className="bg-gray-200 text-app-grey py-2 px-4 rounded-xl text-sm font-montserrat">Delete</button>
                        </div>
                    </div>
                    <p className="font-montserrat text-app-grey text-lg whitespace-pre-wrap">{viewingRecipe.shortDescription}</p>
                    {/* Add more detailed recipe fields here, e.g., ingredients, instructions */}
                </div>
            </div>
        );
    }

    // RENDER: Recipe Form (for creating or editing)
    if (isCreatingNew || editingRecipe) {
        return <CookbookForm
            initialData={editingRecipe || importedRecipeData}
            onSave={handleSaveRecipe}
            onCancel={handleCancelForm}
            collections={collections}
        />;
    }
    
    // RENDER: Recipe List View (inside a collection)
    if (currentView === 'recipes') {
        return (
            <div className="p-4 md:p-6 bg-app-white min-h-full font-patrick-hand">
                <button onClick={() => setCurrentView('collections')} className="font-montserrat text-burnt-orange mb-4 flex items-center gap-1 hover:underline">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Back to Collections
                </button>
                <h1 className="text-4xl font-bold text-burnt-orange mb-4">{selectedCollection.name}</h1>
                <FilterComponent categories={recipeCategories} onFilterChange={setActiveFilters} />
                <div className="space-y-4 mt-6">
                    {recipesInView.length > 0 ? recipesInView.map(recipe => (
                        <div key={recipe.id} onClick={() => setViewingRecipe(recipe)} className="bg-info-box p-4 rounded-xl border border-burnt-orange cursor-pointer hover:border-burnt-orange hover:shadow-md transition">
                            <h2 className="text-2xl text-burnt-orange">{recipe.recipeTitle}</h2>
                            <p className="font-montserrat text-app-grey truncate">{recipe.shortDescription}</p>
                        </div>
                    )) : (
                        <div className="text-center py-16 bg-info-box rounded-xl border border-burnt-orange">
                            <p className="text-app-grey text-2xl">No recipes in this collection yet.</p>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // RENDER: Main Collections Grid View
    return (
        <div className="p-4 md:p-6 bg-app-white min-h-full font-patrick-hand">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-burnt-orange">My Recipes</h1>
                <div className="flex gap-2">
                    <button onClick={() => setIsChoiceModalOpen(true)} className="bg-burnt-orange text-white py-2 px-4 rounded-xl text-sm font-normal font-montserrat hover:opacity-90 transition-opacity">
                        + Recipe
                    </button>
                    <button onClick={() => setIsCollectionFormOpen(true)} className="bg-add-idea text-white py-2 px-4 rounded-xl text-sm font-normal font-montserrat hover:opacity-90 transition-opacity">
                        + Collection
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Unassigned Recipes Folder */}
                <div onClick={() => handleViewCollection({ id: 'unassigned', name: 'Unassigned Recipes' })} className="bg-info-box p-4 rounded-2xl border border-burnt-orange/50 aspect-square flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-lg transition-shadow">
                    <FolderIcon />
                    <h2 className="text-lg font-semibold text-app-grey mt-2 break-words">Unassigned Recipes</h2>
                    <p className="text-sm text-app-grey/70 font-montserrat">{collectionRecipeCounts.unassigned} recipes</p>
                </div>
                
                {/* User-created Collections */}
                {collections.map(col => (
                     <div key={col.id} className="relative group">
                        <div onClick={() => handleViewCollection(col)} className="bg-info-box p-4 rounded-2xl border border-burnt-orange/50 aspect-square flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-lg transition-shadow">
                             <FolderIcon />
                             <h2 className="text-lg font-semibold text-app-grey mt-2 break-words truncate">{col.name}</h2>
                             <p className="text-sm text-app-grey/70 font-montserrat">{collectionRecipeCounts[col.id] || 0} recipes</p>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={(e) => { e.stopPropagation(); setCollectionToEdit(col); setIsCollectionFormOpen(true); }} className="bg-white/80 p-1.5 rounded-full text-app-grey hover:bg-white"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg></button>
                           <button onClick={(e) => { e.stopPropagation(); setCollectionToDelete(col); }} className="bg-white/80 p-1.5 rounded-full text-red-500 hover:bg-white"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- All Modals --- */}
            {isChoiceModalOpen && <AddRecipeChoiceModal onImport={handleChooseImport} onManual={handleChooseManual} onCancel={() => setIsChoiceModalOpen(false)} />}
            {isUrlModalOpen && <AddFromURLModal onSave={handleImportRecipe} onCancel={() => setIsUrlModalOpen(false)} />}
            {isCollectionFormOpen && <CollectionFormModal collection={collectionToEdit} onSave={handleSaveCollection} onCancel={() => { setIsCollectionFormOpen(false); setCollectionToEdit(null); }} />}
            {collectionToDelete && <ConfirmationModal message={`Delete "${collectionToDelete.name}"? Recipes will be unassigned.`} onConfirm={handleConfirmDeleteCollection} onCancel={() => setCollectionToDelete(null)} />}
            {recipeToDelete && <ConfirmationModal 
                message={`Are you sure you want to delete "${recipeToDelete.recipeTitle}"?`}
                onConfirm={handleConfirmDeleteRecipe}
                onCancel={() => setRecipeToDelete(null)}
            />}
        </div>
    );
};

export default MyCookbook;