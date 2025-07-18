import React, { useState, useMemo } from 'react';
import CookbookForm from './CookbookForm';
import ConfirmationModal from '../components/ConfirmationModal';

// Note: This constant will be moved later. For now, we'll copy it here.
const journalCategories = ["Bread", "Cake", "Cupcake", "Cookie", "No-Bake", "Cheesecake", "Pastry", "Slice", "Tart"];

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
            {(editingRecipe || isCreatingNew) && <CookbookForm recipe={editingRecipe} isNew={isCreatingNew} onSave={handleSave} onCancel={() => { setEditingRecipe(null); setIsCreatingNew(false); }} />}
            {showConfirmModal && <ConfirmationModal message="Delete this recipe?" onConfirm={() => { deleteRecipe(showConfirmModal); setShowConfirmModal(null); }} onCancel={() => setShowConfirmModal(null)} />}
        </div>
    );
};

export default MyCookbook;