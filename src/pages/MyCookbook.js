import React, { useState, useMemo } from 'react';
import ConfirmationModal from '../components/ConfirmationModal';
import RecipeFilterBar from '../components/RecipeFilterBar'; // <-- IMPORT the new filter bar

// --- STYLING UPDATED ---
const FolderIcon = () => (
    <svg className="w-16 h-16 text-[var(--primary-color)] opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
);

const CollectionFormModal = ({ onSave, onCancel, collection = null }) => {
    const [name, setName] = useState(collection ? collection.name : '');
    const handleSave = () => { if (name.trim()) onSave(name); };
    return (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 font-sans">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center space-y-4">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">{collection ? 'Rename Collection' : 'New Collection'}</h2>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Cakes, Breads..." className="w-full h-12 px-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none"/>
                <div className="flex justify-center space-x-2 pt-2">
                    <button onClick={handleSave} className="h-12 px-8 rounded-full bg-[var(--primary-color)] text-white font-bold hover:opacity-90">Save</button>
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
    onAddRecipe,
    onEditRecipe
}) => {
    const [currentView, setCurrentView] = useState('collections');
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [isCollectionFormOpen, setIsCollectionFormOpen] = useState(false);
    const [collectionToEdit, setCollectionToEdit] = useState(null);
    const [collectionToDelete, setCollectionToDelete] = useState(null);
    const [recipeToDelete, setRecipeToDelete] = useState(null);
    const [expandedCookbookId, setExpandedCookbookId] = useState(null);
    
    // --- STATE SIMPLIFIED ---
    const [activeCategory, setActiveCategory] = useState('All');
    const recipeCategories = ["Bread", "Cake", "Cupcake", "Cookie", "No-Bake", "Cheesecake", "Pastry", "Slice", "Tart"];

    const collectionRecipeCounts = useMemo(() => {
        const counts = { unassigned: 0 };
        if (collections) { collections.forEach(col => { counts[col.id] = 0; }); }
        if (cookbook) { cookbook.forEach(recipe => { if (recipe.collectionId && counts.hasOwnProperty(recipe.collectionId)) { counts[recipe.collectionId]++; } else { counts.unassigned++; } }); }
        return counts;
    }, [cookbook, collections]);

    const recipesInView = useMemo(() => {
        let recipes = cookbook || [];
        // First, get only the recipes for the currently selected collection
        if (selectedCollection) {
            recipes = selectedCollection.id === 'unassigned'
                ? recipes.filter(recipe => !recipe.collectionId)
                : recipes.filter(recipe => recipe.collectionId === selectedCollection.id);
        }
        
        // Then, filter those recipes by the active category
        if (activeCategory !== 'All') {
            recipes = recipes.filter(recipe => recipe.categories?.includes(activeCategory));
        }

        return recipes.sort((a, b) => (a.createdAt && b.createdAt) ? new Date(b.createdAt.toDate()) - new Date(a.createdAt.toDate()) : 0);
    }, [cookbook, selectedCollection, activeCategory]);

    const handleSaveCollection = (name) => { if (collectionToEdit) { updateCollection(collectionToEdit.id, name); } else { addCollection(name); } setIsCollectionFormOpen(false); setCollectionToEdit(null); };
    const handleConfirmDeleteCollection = () => { if (collectionToDelete) { deleteCollection(collectionToDelete.id); } setCollectionToDelete(null); };
    const handleViewCollection = (collection) => { setActiveCategory('All'); setSelectedCollection(collection); setExpandedCookbookId(null); setCurrentView('recipes'); };
    const handleConfirmDeleteRecipe = () => { if (recipeToDelete) { deleteRecipe(recipeToDelete.id); setRecipeToDelete(null); } };

    if (currentView === 'recipes') {
        return (
            <div className="bg-[var(--background-color)] min-h-full font-sans">
                {/* --- NEW HEADER SECTION --- */}
                <div className="bg-[var(--upcoming-bg)]">
                    <div className="p-4 pb-0">
                        <button onClick={() => setCurrentView('collections')} className="flex items-center gap-1 text-sm font-bold text-white mb-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                            Back to Collections
                        </button>
                        <h1 className="text-3xl font-bold text-white">{selectedCollection?.name || 'Collection'}</h1>
                    </div>
                     <div className="py-2">
                        <RecipeFilterBar 
                            categories={recipeCategories}
                            activeCategory={activeCategory}
                            onCategorySelect={setActiveCategory}
                        />
                    </div>
                </div>

                {/* --- MAIN CONTENT SECTION --- */}
                <div className="p-4 space-y-4 bg-[var(--background-color)] -mt-4 rounded-t-2xl">
                    {recipesInView.length > 0 ? recipesInView.map(recipe => (
                        <div key={recipe.id} className="bg-white p-4 rounded-xl border border-pink-100 shadow-sm">
                           <div className="flex justify-between items-start cursor-pointer" onClick={() => setExpandedCookbookId(expandedCookbookId === recipe.id ? null : recipe.id)}>
                                <h3 className="text-lg font-semibold text-[var(--text-primary)]">{recipe.recipeTitle}</h3>
                                <span className={`transform transition-transform text-[var(--primary-color)] ${expandedCookbookId === recipe.id ? 'rotate-180' : ''}`}>▼</span>
                            </div>
                            {expandedCookbookId === recipe.id && (
                                <div className="mt-4 pt-4 border-t border-pink-100">
                                    <div className="flex justify-end space-x-3 text-[var(--text-secondary)] mb-3">
                                        {recipe.sourceURL && <a href={recipe.sourceURL} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--primary-color)]" onClick={(e) => e.stopPropagation()}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg></a>}
                                        <button onClick={(e) => { e.stopPropagation(); onEditRecipe(recipe); }} className="hover:text-[var(--primary-color)]"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg></button>
                                        <button onClick={(e) => { e.stopPropagation(); setRecipeToDelete(recipe); }} className="hover:text-[var(--primary-color)]"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg></button>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[var(--text-primary)] mb-1">Ingredients</h4>
                                        <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">{recipe.ingredients && recipe.ingredients.map((ing, i) => <li key={i}>{ing.quantity} {ing.measurement} {ing.name}</li>)}</ul>
                                    </div>
                                    <div className="mt-4">
                                        <h4 className="font-bold text-[var(--text-primary)] mb-1">Instructions</h4>
                                        <p className="whitespace-pre-wrap text-gray-700 text-sm">{recipe.instructions}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )) : ( <div className="text-center py-16 bg-white rounded-xl border border-pink-100"><p className="text-gray-500">No recipes in this collection match your filter.</p></div> )}
                </div>
                {recipeToDelete && <ConfirmationModal message={`Delete "${recipeToDelete.recipeTitle}"?`} onConfirm={handleConfirmDeleteRecipe} onCancel={() => setRecipeToDelete(null)} />}
            </div>
        );
    }

    return (
        <div className="bg-[var(--background-color)] min-h-full font-sans">
            <div className="bg-[var(--upcoming-bg)] p-4 pb-8">
                <h1 className="text-3xl font-bold text-white text-center mb-4">My Recipes</h1>
                <div className="flex gap-2 justify-center">
                    <button onClick={onAddRecipe} className="flex-1 h-12 flex items-center justify-center rounded-full bg-[var(--primary-color)] text-white font-bold text-sm shadow-md hover:opacity-90">
                        + Recipe
                    </button>
                    <button onClick={() => setIsCollectionFormOpen(true)} className="flex-1 h-12 flex items-center justify-center rounded-full bg-white/30 text-white font-bold text-sm hover:bg-white/40">
                        + Collection
                    </button>
                </div>
            </div>
            
            <div className="p-4 bg-[var(--background-color)] -mt-4 rounded-t-2xl">
                 <div className="grid grid-cols-2 gap-4">
                     <div onClick={() => handleViewCollection({ id: 'unassigned', name: 'Unassigned Recipes' })} className="bg-white p-4 rounded-xl border border-pink-100 shadow-sm flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-lg transition-shadow aspect-square">
                        <FolderIcon />
                        <h2 className="text-base font-bold text-[var(--text-primary)] mt-2">Unassigned</h2>
                        <p className="text-xs text-[var(--text-secondary)]">{collectionRecipeCounts.unassigned || 0} recipes</p>
                    </div>
                    
                    {collections && collections.map(col => (
                         <div key={col.id} className="relative group">
                            <div onClick={() => handleViewCollection(col)} className="bg-white p-4 rounded-xl border border-pink-100 shadow-sm flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-lg transition-shadow aspect-square">
                                 <FolderIcon />
                                 <h2 className="text-base font-bold text-[var(--text-primary)] mt-2 w-full truncate px-1">{col.name}</h2>
                                 <p className="text-xs text-[var(--text-secondary)]">{collectionRecipeCounts[col.id] || 0} recipes</p>
                            </div>
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button onClick={(e) => { e.stopPropagation(); setCollectionToEdit(col); setIsCollectionFormOpen(true); }} className="bg-white/80 p-1.5 rounded-full text-gray-600 hover:text-black"><svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg></button>
                               <button onClick={(e) => { e.stopPropagation(); setCollectionToDelete(col); }} className="bg-white/80 p-1.5 rounded-full text-red-500 hover:text-red-700"><svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {isCollectionFormOpen && <CollectionFormModal collection={collectionToEdit} onSave={handleSaveCollection} onCancel={() => { setIsCollectionFormOpen(false); setCollectionToEdit(null); }} />}
            {collectionToDelete && <ConfirmationModal message={`Delete "${collectionToDelete.name}"?`} onConfirm={handleConfirmDeleteCollection} onCancel={() => setCollectionToDelete(null)} />}
        </div>
    );
};

export default MyCookbook;

