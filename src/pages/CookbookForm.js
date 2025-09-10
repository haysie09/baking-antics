import React, { useState } from 'react';
import Modal from '../components/Modal';

const journalCategories = ["Bread", "Cake", "Cupcake", "Cookie", "No-Bake", "Cheesecake", "Pastry", "Slice", "Tart"];
const recipeMeasurements = ["cup", "tbsp", "tsp", "g", "kg", "ml", "L", "oz", "lb", "pinch", "unit(s)"];

const CookbookForm = ({ onSave, onCancel, initialData, collections }) => {

    const [formData, setFormData] = useState(initialData || { 
        recipeTitle: '', 
        sourceURL: '',
        collectionId: '',
        ingredients: [{ quantity: '', measurement: 'cup', name: '' }], 
        instructions: '', 
        categories: [] 
    });

    // All handler logic is preserved
    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...formData.ingredients];
        newIngredients[index][field] = value;
        setFormData(p => ({ ...p, ingredients: newIngredients }));
    };
    const addIngredient = () => {
        setFormData(p => ({ ...p, ingredients: [...p.ingredients, { quantity: '', measurement: 'cup', name: '' }] }));
    };
    const removeIngredient = (index) => {
        setFormData(p => ({ ...p, ingredients: p.ingredients.filter((_, i) => i !== index) }));
    };
    const handleCategoryToggle = (cat) => {
        const categories = formData.categories?.includes(cat)
            ? formData.categories.filter(c => c !== cat)
            : [...(formData.categories || []), cat];
        setFormData(p => ({ ...p, categories }));
    };

    return (
        <Modal onClose={onCancel} size="lg">
            <div className="space-y-4 font-sans">
                <h2 className="text-xl font-bold text-center text-[#1b0d10]">{initialData?.recipeTitle ? 'Edit Recipe' : 'Add New Recipe'}</h2>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Title</label>
                    <input type="text" value={formData.recipeTitle} onChange={(e) => setFormData(p=>({...p, recipeTitle: e.target.value}))} className="w-full h-12 px-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#f0425f] focus:outline-none"/>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Source URL</label>
                    <input type="text" value={formData.sourceURL} onChange={(e) => setFormData(p=>({...p, sourceURL: e.target.value}))} className="w-full h-12 px-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#f0425f] focus:outline-none"/>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Collection</label>
                    <select
                        value={formData.collectionId || ''}
                        onChange={(e) => setFormData(p => ({ ...p, collectionId: e.target.value }))}
                        className="w-full h-12 px-4 appearance-none rounded-full border border-gray-300 bg-white text-base focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    >
                        <option value="">Unassigned</option>
                        {collections && collections.map(col => (
                            <option key={col.id} value={col.id}>{col.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                    <div className="flex flex-wrap gap-2">
                        {journalCategories.map(cat => (
                            <button key={cat} onClick={() => handleCategoryToggle(cat)} className={`py-1 px-3 rounded-full border text-sm ${formData.categories && formData.categories.includes(cat) ? 'bg-[#f0425f] text-white border-[#f0425f]' : 'bg-white text-gray-700 border-gray-300'}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
                    <div className="space-y-2">
                        {formData.ingredients && formData.ingredients.map((ing, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input type="text" placeholder="Qty" value={ing.quantity || ''} onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)} className="w-1/4 h-10 px-2 rounded-full border border-gray-300 text-sm" />
                                <select value={ing.measurement || 'unit(s)'} onChange={(e) => handleIngredientChange(index, 'measurement', e.target.value)} className="w-1/2 h-10 px-2 rounded-full border border-gray-300 text-sm bg-white">
                                    <option value="">Unit</option>
                                    {recipeMeasurements.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <input type="text" placeholder="Name" value={ing.name || ''} onChange={(e) => handleIngredientChange(index, 'name', e.target.value)} className="w-full h-10 px-2 rounded-full border border-gray-300 text-sm" />
                                <button onClick={() => removeIngredient(index)} className="text-red-500 hover:text-red-700 text-2xl">&times;</button>
                            </div>
                        ))}
                    </div>
                    <button onClick={addIngredient} className="mt-2 text-sm text-[#f0425f] hover:underline">+ Add Ingredient</button>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                    <textarea value={formData.instructions} onChange={(e) => setFormData(p=>({...p, instructions: e.target.value}))} rows="6" className="w-full p-4 border border-gray-300 rounded-2xl text-base focus:ring-2 focus:ring-[#f0425f] focus:outline-none"></textarea>
                </div>
                
                <button onClick={() => onSave(formData)} className="w-full h-12 flex items-center justify-center rounded-full bg-[#f0425f] text-white font-bold text-base hover:opacity-90 transition-opacity">Save Recipe</button>
            </div>
        </Modal>
    );
};

export default CookbookForm;