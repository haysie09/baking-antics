import React, { useState, useMemo } from 'react';
import CookbookForm from './CookbookForm';
import ConfirmationModal from '../components/ConfirmationModal';
import AddFromURLModal from '../components/AddFromURLModal';

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
    const [selectedCollection, setSelectedCollection] = useState(null); // Holds the collection object being viewed

    // --- State for modals ---
    const [isCollectionFormOpen, setIsCollectionFormOpen] = useState(false);
    const [collectionToEdit, setCollectionToEdit] = useState(null);
    const [collectionToDelete, setCollectionToDelete] = useState(null);
    
    const [editingRecipe, setEditingRecipe] = useState(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(null);
    const [expandedCookbookId, setExpandedCookbookId] = useState(null);
    const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
    const [importedRecipeData, setImportedRecipeData] = useState(null);

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
        const sanitizedData = { ...recipeData, collectionId: selectedCollection?.id || null };
        if (isCreatingNew || importedRecipeData) {
            await addRecipe({ ...sanitizedData, createdAt: new Date() });
            setImportedRecipeData(null);
        } else {
            await updateRecipe(editingRecipe.id, sanitizedData);
        }
        setEditingRecipe(null);
        setIsCreatingNew(false);
    };

    const handleImportRecipe = async (url) => {
        // ... (import logic remains the same)
    };

    // --- Data Memoization ---
    const recipesInView = useMemo(() => {
        if (!cookbook) return [];
        if (selectedCollection?.id === 'unassigned') {
            return cookbook.filter(recipe => !recipe.collectionId);
        }
        return cookbook.filter(recipe => recipe.collectionId === selectedCollection?.id);
    }, [cookbook, selectedCollection]);

    // --- Render Logic ---
    if (currentView === 'recipes') {
        return (
            <div className="p-4 md:p-6 bg-app-white min-h-full font-patrick-hand">
                <button onClick={() => setCurrentView('collections')} className="font-montserrat text-burnt-orange mb-4 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Back to Collections
                </button>
                <h1 className="text-4xl font-bold text-burnt-orange mb-6">{selectedCollection.name}</h1>
                {/* ... (The existing recipe list, search, and filter UI would go here, using `recipesInView`) ... */}
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

            <div className="grid grid-cols-2 gap-4">
                {/* Unassigned Recipes Folder */}
                <div onClick={() => handleViewCollection({ id: 'unassigned', name: 'Unassigned Recipes' })} className="bg-info-box p-4 rounded-2xl border border-burnt-orange aspect-square flex flex-col justify-between cursor-pointer hover:shadow-lg transition-shadow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-burnt-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" /></svg>
                    <div>
                        <h3 className="font-bold text-lg text-app-grey font-montserrat">Unassigned Recipes</h3>
                        <p className="text-sm text-app-grey/70 font-montserrat">{cookbook.filter(r => !r.collectionId).length} recipes</p>
                    </div>
                </div>

                {/* Custom Collections */}
                {collections.map(col => (
                     <div key={col.id} onClick={() => handleViewCollection(col)} className="bg-info-box p-4 rounded-2xl border border-burnt-orange aspect-square flex flex-col justify-between cursor-pointer hover:shadow-lg transition-shadow">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-burnt-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                        <div>
                            <h3 className="font-bold text-lg text-app-grey font-montserrat">{col.name}</h3>
                            <p className="text-sm text-app-grey/70 font-montserrat">{cookbook.filter(r => r.collectionId === col.id).length} recipes</p>
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
        </div>
    );
};

export default MyCookbook;
