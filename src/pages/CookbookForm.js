import React, { useState } from 'react';
import Modal from '../components/Modal';

const journalCategories = ["Bread", "Cake", "Cupcake", "Cookie", "No-Bake", "Cheesecake", "Pastry", "Slice", "Tart"];
const recipeMeasurements = ["cup", "tbsp", "tsp", "g", "kg", "ml", "L", "oz", "lb", "pinch", "unit(s)"];

const CookbookForm = ({ recipe, onSave, onCancel, isNew = false, initialData }) => {
    const [formData, setFormData] = useState(initialData || recipe || { 
        recipeTitle: '', 
        sourceURL: '', 
        ingredients: [{ quantity: '', measurement: 'cup', name: '' }], 
        instructions: '', 
        categories: [] 
    });

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
            <div className="space-y-4 text-xl">
                <h2 className="text-4xl font-bold text-burnt-orange">{isNew ? 'Add New Recipe' : 'Edit Recipe'}</h2>
                <div><label className="block text-app-grey font-semibold mb-1">Recipe Title</label><input type="text" value={formData.recipeTitle} onChange={(e) => setFormData(p=>({...p, recipeTitle: e.target.value}))} className="w-full p-3 border border-gray-300 rounded-xl text-xl font-montserrat"/></div>
                <div><label className="block text-app-grey font-semibold mb-1">Source URL</label><input type="text" value={formData.sourceURL} onChange={(e) => setFormData(p=>({...p, sourceURL: e.target.value}))} className="w-full p-3 border border-gray-300 rounded-xl text-xl font-montserrat"/></div>
                <div><label className="block text-app-grey font-semibold mb-1">Categories</label><div className="flex flex-wrap gap-2">{journalCategories.map(cat => <button key={cat} onClick={() => handleCategoryToggle(cat)} className={`py-1 px-3 rounded-xl border text-base font-montserrat ${formData.categories && formData.categories.includes(cat) ? 'bg-burnt-orange text-light-peach border-burnt-orange' : 'bg-white text-app-grey border-gray-300'}`}>{cat}</button>)}</div></div>
                <div>
                    <label className="block text-app-grey font-semibold mb-1">Ingredients</label>
                    <div className="space-y-2 font-montserrat">
                        {formData.ingredients && formData.ingredients.map((ing, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input type="text" placeholder="Qty" value={ing.quantity || ''} onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)} className="w-1/4 p-2 border border-gray-300 rounded-xl text-sm" />
                                <select value={ing.measurement || 'unit(s)'} onChange={(e) => handleIngredientChange(index, 'measurement', e.target.value)} className="w-1/2 p-2 border border-gray-300 rounded-xl text-sm bg-white">
                                    <option value="">Unit</option>
                                    {recipeMeasurements.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <input type="text" placeholder="Name" value={ing.name || ''} onChange={(e) => handleIngredientChange(index, 'name', e.target.value)} className="w-full p-2 border border-gray-300 rounded-xl text-sm" />
                                <button onClick={() => removeIngredient(index)} className="text-red-500 hover:text-red-700">&times;</button>
                            </div>
                        ))}
                    </div>
                    <button onClick={addIngredient} className="mt-2 text-sm text-burnt-orange hover:underline">+ Add Ingredient</button>
                </div>
                <div><label className="block text-app-grey font-semibold mb-1">Instructions</label><textarea value={formData.instructions} onChange={(e) => setFormData(p=>({...p, instructions: e.target.value}))} rows="8" className="w-full p-3 border border-gray-300 rounded-lg text-lg font-montserrat"></textarea></div>
                <button onClick={() => onSave(formData)} className="w-full bg-burnt-orange text-light-peach py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity text-xl font-montserrat">Save Recipe</button>
            </div>
        </Modal>
    );
};

export default CookbookForm;
