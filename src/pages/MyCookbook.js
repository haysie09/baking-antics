import React, { useState, useMemo } from 'react';
import CookbookForm from './CookbookForm';
import ConfirmationModal from '../components/ConfirmationModal';
import FilterComponent from '../components/FilterComponent';
import AddFromURLModal from '../components/AddFromURLModal';

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
            
            // This check is crucial. If the response isn't OK, we'll parse the error message.
            if (!response.ok) {
                // Try to parse the error from the backend function's JSON response
                const errorData = await response.json().catch(() => ({ 
                    error: "The server returned an invalid response. The import feature may be temporarily down." 
                }));
                throw new Error(errorData.error || 'An unknown error occurred during import.');
            }

            const recipeData = await response.json();
            const finalRecipeData = { ...recipeData, sourceURL: url, categories: [] };
            setImportedRecipeData(finalRecipeData);
            setIsUrlModalOpen(false);
        } catch (error) {
            console.error("Import Error:", error);
            // This re-throws the error so the calling component (AddFromURLModal) can catch it and display it.
            // The error message is now more informative.
            throw new Error(error.message);
        }
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
                <div className="flex justify-center gap-2 mt-4">
                    <button onClick={() => setIsUrlModalOpen(true)} className="bg-add-idea text-white py-2 px-2 rounded-xl text-xs font-normal font-montserrat hover:opacity-90 transition-opacity flex items-center justify-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        Import Website
                    </button>
                    <button onClick={() => setIsCreatingNew(true)} className="bg-add-idea text-white py-2 px-2 rounded-xl text-xs font-normal font-montserrat hover:opacity-90 transition-opacity flex items-center justify-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        Own Recipe
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
                        <div className="flex justify-between items-start cursor-pointer" onClick={() => setExpandedCookbookId(expandedCookbookId === recipe.id ? null : recipe.id)}>
                            <h3 className="text-2xl font-bold text-burnt-orange">{recipe.recipeTitle}</h3>
                            <span className={`transform transition-transform text-burnt-orange ${expandedCookbookId === recipe.id ? 'rotate-180' : ''}`}>▼</span>
                        </div>
                        {expandedCookbookId === recipe.id && (
                            <div className="mt-4 pt-4 border-t border-burnt-orange/20">
                                <div className="flex justify-end space-x-2 text-burnt-orange mb-2">
                                    {recipe.sourceURL && <a href={recipe.sourceURL} target="_blank" rel="noopener noreferrer" className="hover:opacity-70"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg></a>}
                                    <button onClick={(e) => { e.stopPropagation(); setEditingRecipe(recipe) }} className="hover:opacity-70"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg></button>
                                    <button onClick={(e) => { e.stopPropagation(); setShowConfirmModal(recipe.id) }} className="hover:opacity-70"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
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