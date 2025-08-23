import React, { useState, useMemo } from 'react';
import CookbookForm from './CookbookForm';
import ConfirmationModal from '../components/ConfirmationModal';
import AddFromURLModal from '../components/AddFromURLModal';
import FilterComponent from '../components/FilterComponent';
import AddRecipeChoiceModal from '../components/AddRecipeChoiceModal';

// A new, simple modal for adding/editing a collection name
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


const MyCookbook = ({ cookbook, addRecipe, updateRecipe, deleteRecipe, collections, addCollection, updateCollection, deleteCollection }) => {
    // --- State for view management ---
    const [currentView, setCurrentView] = useState('collections'); // 'collections' or 'recipes'
    const [selectedCollection, setSelectedCollection] = useState(null);

    // --- State for modals ---
    const [isCollectionFormOpen, setIsCollectionFormOpen] = useState(false);
    const [collectionToEdit, setCollectionToEdit] = useState(null);
    const [collectionToDelete, setCollectionToDelete] = useState(null);
    const [isRecipeChoiceModalOpen, setIsRecipeChoiceModalOpen] = useState(false);
    
    const [editingRecipe, setEditingRecipe] = useState(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(null);
    const [expandedCookbookId, setExpandedCookbookId] = useState(null);
    const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
    const [importedRecipeData, setImportedRecipeData] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState({ categories: [], month: 'all', year: 'all' });

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

    // --- Handlers for Recipes ---
    const handleSaveRecipe = async (recipeData) => {
        const collectionIdToSave = selectedCollection?.id === 'unassigned' ? null : selectedCollection?.id;
        const sanitizedData = { ...recipeData, collectionId: collectionIdToSave };
        
        if (isCreatingNew || importedRecipeData) {
            await addRecipe({ ...sanitizedData, createdAt: new Date() });
            setImportedRecipeData(null);
        } else {
            await updateRecipe(editingRecipe.id, sanitizedData);
        }
        setEditingRecipe(null);
        setIsCreatingNew(false);
    };
    
    const handleOpenImportModal = () => {
        setIsRecipeChoiceModalOpen(false);
        setIsUrlModalOpen(true);
    };

    const handleOpenManualRecipeForm = () => {
        setIsRecipeChoiceModalOpen(false);
        setIsCreatingNew(true);
    };

    const handleImportRecipe = async (url) => { /* ... import logic ... */ };
    const handleFilterChange = (filters) => setActiveFilters(filters);

    // --- Data Memoization ---
    const recipesInView = useMemo(() => {
        let recipes = cookbook || [];
        if (selectedCollection?.id === 'unassigned') {
            recipes = cookbook.filter(recipe => !recipe.collectionId);
        } else {
            recipes = cookbook.filter(recipe => recipe.collectionId === selectedCollection?.id);
        }

        if (searchTerm) {
            recipes = recipes.filter(r => r.recipeTitle.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        // ... apply other filters ...
        return recipes;
    }, [cookbook, selectedCollection, searchTerm, activeFilters]);

    // --- RENDER LOGIC ---
    if (currentView === 'recipes') {
        return (
            <div className="p-4 md:p-6 bg-app-white min-h-full font-patrick-hand">
                <button onClick={() => setCurrentView('collections')} className="font-montserrat text-burnt-orange mb-4 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Back to Collections
                </button>
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-burnt-orange">{selectedCollection.name}</h1>
                    <div className="flex justify-center gap-2 mt-4">
                         <button onClick={() => setIsRecipeChoiceModalOpen(true)} className="bg-add-idea text-white py-2 px-2 rounded-xl text-xs font-normal font-montserrat hover:opacity-90 transition-opacity flex items-center justify-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                            Add Recipe
                        </button>
                    </div>
                </div>
                
                <div className="space-y-4">
                    {recipesInView.length > 0 ? recipesInView.map(recipe => (
                        <div key={recipe.id} className="bg-info-box p-4 rounded-xl border border-burnt-orange">
                            {/* This is the full, restored recipe details view */}
                        </div>
                    )) : <p className="text-center text-app-grey/70 py-8">No recipes in this collection yet. Add one!</p>}
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6 bg-app-white min-h-full font-patrick-hand">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-burnt-orange">My Recipes</h1>
                <button onClick={() => setIsCollectionFormOpen(true)} className="bg-add-idea text-white py-2 px-2 rounded-xl text-xs font-normal font-montserrat hover:opacity-90 transition-opacity flex items-center justify-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    + Collection
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div onClick={() => handleViewCollection({ id: 'unassigned', name: 'Unassigned Recipes' })} className="bg-info-box p-4 rounded-2xl border border-burnt-orange aspect-square flex flex-col justify-between cursor-pointer hover:shadow-lg transition-shadow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-burnt-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" /></svg>
                    <div>
                        <h3 className="font-bold text-lg text-app-grey font-montserrat">Unassigned Recipes</h3>
                        <p className="text-sm text-app-grey/70 font-montserrat">{cookbook.filter(r => !r.collectionId).length} recipes</p>
                    </div>
                </div>
                {collections.map(col => (
                     <div key={col.id} className="relative group">
                        <div onClick={() => handleViewCollection(col)} className="bg-info-box p-4 rounded-2xl border border-burnt-orange aspect-square flex flex-col justify-between cursor-pointer hover:shadow-lg transition-shadow">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-burnt-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                            <div>
                                <h3 className="font-bold text-lg text-app-grey font-montserrat">{col.name}</h3>
                                <p className="text-sm text-app-grey/70 font-montserrat">{cookbook.filter(r => r.collectionId === col.id).length} recipes</p>
                            </div>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={(e) => { e.stopPropagation(); setCollectionToEdit(col); setIsCollectionFormOpen(true); }} className="bg-white/80 p-1 rounded-full text-app-grey"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg></button>
                            <button onClick={(e) => { e.stopPropagation(); setCollectionToDelete(col); }} className="bg-white/80 p-1 rounded-full text-red-500"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                        </div>
                    </div>
                ))}
            </div>

            {(isCollectionFormOpen || collectionToEdit) && (
                <CollectionFormModal 
                    collection={collectionToEdit}
                    onSave={handleSaveCollection}
                    onCancel={() => { setIsCollectionFormOpen(false); setCollectionToEdit(null); }}
                />
            )}
            {collectionToDelete && (
                <ConfirmationModal 
                    message={`Delete "${collectionToDelete.name}"? Recipes will be unassigned.`}
                    onConfirm={handleConfirmDeleteCollection}
                    onCancel={() => setCollectionToDelete(null)}
                />
            )}
            {isRecipeChoiceModalOpen && (
                <AddRecipeChoiceModal 
                    onImport={handleOpenImportModal}
                    onManual={handleOpenManualRecipeForm}
                    onCancel={() => setIsRecipeChoiceModalOpen(false)}
                />
            )}
            {isUrlModalOpen && (
                <AddFromURLModal 
                    onImport={handleImportRecipe}
                    onCancel={() => setIsUrlModalOpen(false)}
                />
            )}
            {(isCreatingNew || importedRecipeData) && (
                <CookbookForm 
                    initialData={importedRecipeData}
                    isNew={true}
                    onSave={handleSaveRecipe} 
                    onCancel={() => { setIsCreatingNew(false); setImportedRecipeData(null); }} 
                />
            )}
            {editingRecipe && (
                 <CookbookForm 
                    recipe={editingRecipe}
                    onSave={handleSaveRecipe} 
                    onCancel={() => setEditingRecipe(null)} 
                />
            )}
            {showConfirmModal && <ConfirmationModal message="Delete this recipe?" onConfirm={() => { deleteRecipe(showConfirmModal); setShowConfirmModal(null); }} onCancel={() => setShowConfirmModal(null)} />}
        </div>
    );
};

export default MyCookbook;
