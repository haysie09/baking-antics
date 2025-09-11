// Filename: src/pages/MyCookbook.js

import React, { useState, useMemo } from 'react';
import ConfirmationModal from '../components/ConfirmationModal';
import FilterComponent from '../components/FilterComponent';

// Note: The CollectionFormModal, CookbookForm, and other local modals were removed
// as they are now handled globally by App.js

const FolderIcon = () => (
    <svg className="w-16 h-16 text-[#f8a5b3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
);

const CollectionFormModal = ({ onSave, onCancel, collection = null }) => {
    const [name, setName] = useState(collection ? collection.name : '');
    const handleSave = () => { if (name.trim()) onSave(name); };
    return (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 font-sans">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center space-y-4">
                <h2 className="text-xl font-bold text-[#1b0d10]">{collection ? 'Rename Collection' : 'New Collection'}</h2>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Cakes, Breads..." className="w-full h-12 px-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#f0425f] focus:outline-none"/>
                <div className="flex justify-center space-x-2 pt-2">
                    <button onClick={handleSave} className="h-12 px-8 rounded-full bg-[#f0425f] text-white font-bold hover:opacity-90">Save</button>
                    <button onClick={onCancel} className="h-12 px-8 rounded-full bg-gray-100 text-gray-700 font-bold hover:bg-gray-200">Cancel</button>
                </div>
            </div>
        </div>
    );
};


const MyCookbook = ({ 
    cookbook, 
    updateRecipe, 
    deleteRecipe, 
    collections, 
    addCollection, 
    updateCollection, 
    deleteCollection,
    // --- New props from App.js ---
    onAddRecipe,
    onEditRecipe
}) => {
    // State is now much simpler, only for managing views and collections within this page
    const [currentView, setCurrentView] = useState('collections');
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [isCollectionFormOpen, setIsCollectionFormOpen] = useState(false);
    const [collectionToEdit, setCollectionToEdit] = useState(null);
    const [collectionToDelete, setCollectionToDelete] = useState(null);
    const [recipeToDelete, setRecipeToDelete] = useState(null);
    const [expandedCookbookId, setExpandedCookbookId] = useState(null);
    const [activeFilters, setActiveFilters] = useState({ categories: [], month: 'all', year: 'all' });
    const recipeCategories = ["Bread", "Cake", "Cupcake", "Cookie", "No-Bake", "Cheesecake", "Pastry", "Slice", "Tart"];

    const collectionRecipeCounts = useMemo(() => {
        const counts = { unassigned: 0 };
        if (collections) { collections.forEach(col => { counts[col.id] = 0; }); }
        if (cookbook) { cookbook.forEach(recipe => { if (recipe.collectionId && counts.hasOwnProperty(recipe.collectionId)) { counts[recipe.collectionId]++; } else { counts.unassigned++; } }); }
        return counts;
    }, [cookbook, collections]);

    const recipesInView = useMemo(() => {
        let recipes = cookbook || [];
        if (selectedCollection) {
            recipes = selectedCollection.id === 'unassigned'
                ? recipes.filter(recipe => !recipe.collectionId)
                : recipes.filter(recipe => recipe.collectionId === selectedCollection.id);
        }
        if (activeFilters.categories.length > 0) {
            recipes = recipes.filter(recipe => activeFilters.categories.every(filterCat => recipe.categories?.includes(filterCat)));
        }
        return recipes.sort((a, b) => (a.createdAt && b.createdAt) ? new Date(b.createdAt.toDate()) - new Date(a.createdAt.toDate()) : 0);
    }, [cookbook, selectedCollection, activeFilters]);

    const handleSaveCollection = (name) => { if (collectionToEdit) { updateCollection(collectionToEdit.id, name); } else { addCollection(name); } setIsCollectionFormOpen(false); setCollectionToEdit(null); };
    const handleConfirmDeleteCollection = () => { if (collectionToDelete) { deleteCollection(collectionToDelete.id); } setCollectionToDelete(null); };
    const handleViewCollection = (collection) => { setSelectedCollection(collection); setExpandedCookbookId(null); setCurrentView('recipes'); };
    const handleConfirmDeleteRecipe = () => { if (recipeToDelete) { deleteRecipe(recipeToDelete.id); setRecipeToDelete(null); } };

    if (currentView === 'recipes') {
        return (
            <div className="p-4 bg-[#fcf8f9] min-h-full font-sans">
                <button onClick={() => setCurrentView('collections')} className="flex items-center gap-1 text-sm font-bold text-[#f0425f] mb-4">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                    Back to Collections
                </button>
                <h1 className="text-3xl font-bold text-[#1b0d10] mb-4">{selectedCollection?.name || 'Collection'}</h1>
                <FilterComponent categories={recipeCategories} onFilterChange={setActiveFilters} />
                <div className="space-y-4 mt-6">
                    {recipesInView.length > 0 ? recipesInView.map(recipe => (
                        <div key={recipe.id} className="bg-white p-4 rounded-xl border border-pink-100 shadow-sm">
                           <div className="flex justify-between items-start cursor-pointer" onClick={() => setExpandedCookbookId(expandedCookbookId === recipe.id ? null : recipe.id)}>
                                <h3 className="text-lg font-semibold text-[#1b0d10]">{recipe.recipeTitle}</h3>
                                <span className={`transform transition-transform text-[#f0425f] ${expandedCookbookId === recipe.id ? 'rotate-180' : ''}`}>▼</span>
                            </div>
                            {expandedCookbookId === recipe.id && (
                                <div className="mt-4 pt-4 border-t border-pink-100">
                                    <div className="flex justify-end space-x-3 text-[#9a4c59] mb-3">
                                        {recipe.sourceURL && <a href={recipe.sourceURL} target="_blank" rel="noopener noreferrer" className="hover:text-[#f0425f]" onClick={(e) => e.stopPropagation()}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg></a>}
                                        <button onClick={(e) => { e.stopPropagation(); onEditRecipe(recipe); }} className="hover:text-[#f0425f]"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg></button>
                                        <button onClick={(e) => { e.stopPropagation(); setRecipeToDelete(recipe); }} className="hover:text-[#f0425f]"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg></button>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#1b0d10] mb-1">Ingredients</h4>
                                        <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">{recipe.ingredients && recipe.ingredients.map((ing, i) => <li key={i}>{ing.quantity} {ing.measurement} {ing.name}</li>)}</ul>
                                    </div>
                                    <div className="mt-4">
                                        <h4 className="font-bold text-[#1b0d10] mb-1">Instructions</h4>
                                        <p className="whitespace-pre-wrap text-gray-700 text-sm">{recipe.instructions}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )) : ( <div className="text-center py-16 bg-white rounded-xl border border-pink-100"><p className="text-gray-500">No recipes here. Add one!</p></div> )}
                </div>
                {recipeToDelete && <ConfirmationModal message={`Delete "${recipeToDelete.recipeTitle}"?`} onConfirm={handleConfirmDeleteRecipe} onCancel={() => setRecipeToDelete(null)} />}
            </div>
        );
    }

    return (
        <div className="p-4 bg-[#fcf8f9] min-h-full font-sans">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-[#1b0d10] text-center md:text-left">My Recipes</h1>
                <div className="flex gap-2 mt-4 justify-center md:justify-start">
                    <button onClick={onAddRecipe} className="flex-1 h-12 flex items-center justify-center rounded-full bg-[#f0425f] text-white font-bold text-sm shadow-md hover:opacity-90">
                        + Recipe
                    </button>
                    <button onClick={() => setIsCollectionFormOpen(true)} className="flex-1 h-12 flex items-center justify-center rounded-full bg-white text-[#1b0d10] font-bold text-sm border border-pink-200 shadow-sm hover:bg-gray-50">
                        + Collection
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                 <div onClick={() => handleViewCollection({ id: 'unassigned', name: 'Unassigned Recipes' })} className="bg-white p-4 rounded-xl border border-pink-100 shadow-sm flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-lg transition-shadow aspect-square">
                    <FolderIcon />
                    <h2 className="text-base font-bold text-[#1b0d10] mt-2">Unassigned</h2>
                    <p className="text-xs text-[#9a4c59]">{collectionRecipeCounts.unassigned || 0} recipes</p>
                </div>
                
                {collections && collections.map(col => (
                     <div key={col.id} className="relative group">
                        <div onClick={() => handleViewCollection(col)} className="bg-white p-4 rounded-xl border border-pink-100 shadow-sm flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-lg transition-shadow aspect-square">
                             <FolderIcon />
                             <h2 className="text-base font-bold text-[#1b0d10] mt-2 w-full truncate px-1">{col.name}</h2>
                             <p className="text-xs text-[#9a4c59]">{collectionRecipeCounts[col.id] || 0} recipes</p>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={(e) => { e.stopPropagation(); setCollectionToEdit(col); setIsCollectionFormOpen(true); }} className="bg-white/80 p-1.5 rounded-full text-gray-600 hover:text-black"><svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg></button>
                           <button onClick={(e) => { e.stopPropagation(); setCollectionToDelete(col); }} className="bg-white/80 p-1.5 rounded-full text-red-500 hover:text-red-700"><svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg></button>
                        </div>
                    </div>
                ))}
            </div>
            
            {isCollectionFormOpen && <CollectionFormModal collection={collectionToEdit} onSave={handleSaveCollection} onCancel={() => { setIsCollectionFormOpen(false); setCollectionToEdit(null); }} />}
            {collectionToDelete && <ConfirmationModal message={`Delete "${collectionToDelete.name}"?`} onConfirm={handleConfirmDeleteCollection} onCancel={() => setCollectionToDelete(null)} />}
        </div>
    );
};

export default MyCookbook;