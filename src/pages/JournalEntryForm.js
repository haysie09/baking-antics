import React, { useState } from 'react';
import Modal from '../components/Modal';
import StarRating from '../components/StarRating';

const journalCategories = ["Bread", "Cake", "Cupcake", "Cookie", "No-Bake", "Cheesecake", "Pastry", "Slice", "Tart"];

const JournalEntryForm = ({ entry, onSave, onCancel, isNew = false, cookbook }) => {
    const [formData, setFormData] = useState(entry || { entryTitle: '', bakingDate: new Date().toISOString().split('T')[0], tasteRating: 0, difficultyRating: 0, personalNotes: '', photoURLs: [], categories: [], sourceURL: '', timeHours: '', timeMinutes: '' });

    // All handler logic is preserved
    const handleCategoryToggle = (cat) => {
        const categories = formData.categories.includes(cat)
            ? formData.categories.filter(c => c !== cat)
            : [...formData.categories, cat];
        setFormData(p => ({ ...p, categories }));
    };
    const handleCookbookSelect = (e) => {
        const recipeId = e.target.value;
        if (!recipeId) {
            setFormData(p => ({ ...p, entryTitle: '', sourceURL: '' }));
            return;
        };
        const selectedRecipe = cookbook.find(r => r.id === recipeId);
        if (selectedRecipe) {
            setFormData(p => ({
                ...p,
                entryTitle: selectedRecipe.recipeTitle,
                sourceURL: selectedRecipe.sourceURL,
                categories: selectedRecipe.categories || []
            }));
        }
    };

    return (
        <Modal onClose={onCancel} size="md">
            <div className="space-y-4 font-sans">
                <h2 className="text-xl font-bold text-center text-[#1b0d10]">{isNew ? 'Add a Past Bake' : 'Edit Journal Entry'}</h2>

                {isNew && cookbook && cookbook.length > 0 && (
                    <div className="relative">
                        <select
                            onChange={handleCookbookSelect}
                            className="w-full h-12 px-4 appearance-none rounded-full border border-pink-200 bg-white text-base font-medium text-[#1b0d10] shadow-sm focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-300"
                            defaultValue=""
                        >
                            <option value="" disabled>Or, pick from My Recipes</option>
                            {cookbook.map(recipe => (
                                <option key={recipe.id} value={recipe.id}>{recipe.recipeTitle}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#1b0d10]">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bake Name</label>
                    <input type="text" name="entryTitle" value={formData.entryTitle} onChange={(e) => setFormData(p => ({ ...p, entryTitle: e.target.value }))} className="w-full h-12 px-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#f0425f] focus:outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Baking Date</label>
                    <input type="date" name="bakingDate" value={formData.bakingDate} onChange={(e) => setFormData(p => ({ ...p, bakingDate: e.target.value }))} className="w-full h-12 px-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#f0425f] focus:outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Source URL</label>
                    <input type="text" name="sourceURL" value={formData.sourceURL} onChange={(e) => setFormData(p => ({ ...p, sourceURL: e.target.value }))} className="w-full h-12 px-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#f0425f] focus:outline-none" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Spent</label>
                    <div className="flex gap-2">
                        <input type="number" min="0" placeholder="Hour(s)" value={formData.timeHours} onChange={e => setFormData(p => ({ ...p, timeHours: Number(e.target.value) }))} className="w-1/2 h-12 px-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#f0425f] focus:outline-none" />
                        <input type="number" min="0" max="59" placeholder="Minute(s)" value={formData.timeMinutes} onChange={(e) => setFormData(p => ({ ...p, timeMinutes: Number(e.target.value) }))} className="w-1/2 h-12 px-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#f0425f] focus:outline-none" />
                    </div>
                </div>

                <div className="flex justify-between items-center py-2 px-2"><label className="text-base text-gray-700 font-semibold">Taste</label><StarRating rating={formData.tasteRating} setRating={(r) => setFormData(p => ({ ...p, tasteRating: r }))} /></div>
                <div className="flex justify-between items-center py-2 px-2"><label className="text-base text-gray-700 font-semibold">Difficulty</label><StarRating rating={formData.difficultyRating} setRating={(r) => setFormData(p => ({ ...p, difficultyRating: r }))} /></div>
                
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Personal Notes</label>
                    <textarea name="personalNotes" value={formData.personalNotes} onChange={(e) => setFormData(p => ({ ...p, personalNotes: e.target.value }))} rows="4" className="w-full p-4 border border-gray-300 rounded-2xl text-base focus:ring-2 focus:ring-[#f0425f] focus:outline-none"></textarea>
                </div>
                
                <button onClick={() => onSave(formData)} className="w-full h-12 flex items-center justify-center rounded-full bg-[#f0425f] text-white font-bold text-base hover:opacity-90 transition-opacity">Save Entry</button>
            </div>
        </Modal>
    );
};

export default JournalEntryForm;