import React, { useState, useMemo } from 'react';
import CookbookForm from './CookbookForm';
import ConfirmationModal from '../components/ConfirmationModal';
import FilterComponent from '../components/FilterComponent';
import AddFromURLModal from '../components/AddFromURLModal';
import AddRecipeChoiceModal from '../components/AddRecipeChoiceModal'; // Import the choice modal

const journalCategories = ["Bread", "Cake", "Cupcake", "Cookie", "No-Bake", "Cheesecake", "Pastry", "Slice", "Tart"];

const MyCookbook = ({ cookbook, addRecipe, updateRecipe, deleteRecipe }) => {
    const [editingRecipe, setEditingRecipe] = useState(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(null);
    const [expandedCookbookId, setExpandedCookbookId] = useState(null);
    const [activeFilters, setActiveFilters] = useState({
        categories: [],
        month: 'all',
        year: 'all'
    });
    
    const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
    const [importedRecipeData, setImportedRecipeData] = useState(null);
    
    // --- NEW: State for the recipe choice modal ---
    const [isRecipeChoiceModalOpen, setIsRecipeChoiceModalOpen] = useState(false);

    const handleSave = async (recipeData) => {
        const sanitizedData = {
            ...recipeData,
            ingredients: recipeData.ingredients.map(ing => ({
                ...ing,
                name: ing.name.charAt(0).toUpperCase() + ing.name.slice(1)
            }))
        };

        if (isCreatingNew || importedRecipeData) {
            await addRecipe({ ...sanitizedData, createdAt: new Date() });
            setImportedRecipeData(null);
        } else {
            await updateRecipe(editingRecipe.id, sanitizedData);
        }
        setEditingRecipe(null);
        setIsCreatingNew(false);
    };

    const handleFilterChange = (filters) => {
        setActiveFilters(filters);
    };

    const handleImportRecipe = async (url) => {
        const functionUrl = `/.netlify/functions/fetch-recipe?url=${encodeURIComponent(url)}`;
        try {
            const response = await fetch(functionUrl);
            const recipeData = await response.json();
            if (!response.ok) {
                throw new Error(recipeData.error || 'An unknown error occurred during import.');
            }
            const finalRecipeData = { ...recipeData, sourceURL: url, categories: [] };
            setImportedRecipeData(finalRecipeData);
            setIsUrlModalOpen(false);
        } catch (error) {
            console.error("Import Error:", error);
            throw new Error(error.message);
        }
    };

    // --- NEW: Handlers for the choice modal ---
    const handleOpenImportModal = () => {
        setIsRecipeChoiceModalOpen(false);
        setIsUrlModalOpen(true);
    };

    const handleOpenManualRecipeForm = () => {
        setIsRecipeChoiceModalOpen(false);
        setIsCreatingNew(true);
    };

    const filteredCookbook = useMemo(() => {
        let recipes = cookbook || [];
        if (activeFilters.categories.length > 0) {
            recipes = recipes.filter(recipe => 
                activeFilters.categories.every(filterCat => recipe.categories?.includes(filterCat))
            );
        }
        if (activeFilters.month !== 'all') {
            recipes = recipes.filter(recipe => recipe.createdAt && new Date(recipe.createdAt.toDate()).getMonth() === parseInt(activeFilters.month));
        }
        if (activeFilters.year !== 'all') {
            recipes = recipes.filter(recipe => recipe.createdAt && new Date(recipe.createdAt.toDate()).getFullYear() === parseInt(activeFilters.year));
        }
        return recipes;
    }, [cookbook, activeFilters]);

    return (
        <div className="p-4 md:p-6 bg-app-white min-h-full font-patrick-hand">
            <div className="text-center mb-6">
                <h1 className="text-4xl font-bold text-burnt-orange">My Recipes</h1>
                {/* --- NEW BUTTON LAYOUT --- */}
                <div className="flex justify-center gap-2 mt-4">
                    <button onClick={() => setIsRecipeChoiceModalOpen(true)} className="bg-add-idea text-white py-2 px-2 rounded-xl text-xs font-normal font-montserrat hover:opacity-90 transition-opacity flex items-center justify-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        Recipe
                    </button>
                    <button onClick={() => alert('Coming soon!')} className="bg-add-idea text-white py-2 px-2 rounded-xl text-xs font-normal font-montserrat hover:opacity-90 transition-opacity flex items-center justify-center gap-1 opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        Collection
                    </button>
                </div>
            </div>
            
            <FilterComponent 
                categories={journalCategories}
                onFilterChange={handleFilterChange}
            />

            <div className="space-y-4">
                {filteredCookbook.length === 0 ? <div className="text-center py-16 bg-info-box rounded-xl border border-burnt-orange"><p className="text-app-grey text-2xl">{cookbook && cookbook.length > 0 ? "No recipes match filters" : "Save your favorite recipes"}</p></div> : [...filteredCookbook].sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate()).map(recipe => (
                    <div key={recipe.id} className="bg-info-box p-4 rounded-xl border border-burnt-orange">
                        {/* ... (rest of the recipe display logic) ... */}
                    </div>
                ))}
            </div>

            {/* --- MODALS --- */}
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
                    onSave={handleSave} 
                    onCancel={() => {
                        setIsCreatingNew(false);
                        setImportedRecipeData(null);
                    }} 
                />
            )}
            {editingRecipe && (
                 <CookbookForm 
                    recipe={editingRecipe}
                    onSave={handleSave} 
                    onCancel={() => setEditingRecipe(null)} 
                />
            )}
            {showConfirmModal && <ConfirmationModal message="Delete this recipe?" onConfirm={() => { deleteRecipe(showConfirmModal); setShowConfirmModal(null); }} onCancel={() => setShowConfirmModal(null)} />}
        </div>
    );
};

export default MyCookbook;
