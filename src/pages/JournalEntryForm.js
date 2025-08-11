import React, { useState } from 'react';
import Modal from '../components/Modal';
import StarRating from '../components/StarRating';

const journalCategories = ["Bread", "Cake", "Cupcake", "Cookie", "No-Bake", "Cheesecake", "Pastry", "Slice", "Tart"];

const JournalEntryForm = ({ entry, onSave, onCancel, isNew = false, cookbook }) => {
    const [formData, setFormData] = useState(entry || { entryTitle: '', bakingDate: new Date().toISOString().split('T')[0], tasteRating: 0, difficultyRating: 0, personalNotes: '', photoURLs: [], categories: [], sourceURL: '', timeHours: '', timeMinutes: '' });

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
            <div className="space-y-4 text-xl">
                <h2 className="text-4xl font-bold text-burnt-orange">{isNew ? 'Add a Past Bake' : 'Edit Journal Entry'}</h2>

                {isNew && cookbook && cookbook.length > 0 && (
                    <div className="relative">
                        <select
                            onChange={handleCookbookSelect}
                            className="w-full bg-white text-add-idea font-bold py-3 px-4 rounded-xl text-lg hover:bg-light-peach transition-colors shadow-sm font-montserrat appearance-none text-center"
                            defaultValue=""
                        >
                            <option value="" disabled>Pick from My Recipes</option>
                            {cookbook.map(recipe => (
                                <option key={recipe.id} value={recipe.id} className="font-montserrat text-app-grey">{recipe.recipeTitle}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-add-idea">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                )}

                <div><label className="block text-app-grey font-semibold mb-1">Bake Name</label><input type="text" name="entryTitle" value={formData.entryTitle} onChange={(e) => setFormData(p => ({ ...p, entryTitle: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-xl text-xl font-montserrat" /></div>
                <div><label className="block text-app-grey font-semibold mb-1">Baking Date</label><input type="date" name="bakingDate" value={formData.bakingDate} onChange={(e) => setFormData(p => ({ ...p, bakingDate: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-xl text-xl font-montserrat" /></div>
                <div><label className="block text-app-grey font-semibold mb-1">Recipe Source URL</label><input type="text" name="sourceURL" value={formData.sourceURL} onChange={(e) => setFormData(p => ({ ...p, sourceURL: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-xl text-xl font-montserrat" /></div>

                <div>
                    <label className="block text-app-grey font-semibold mb-1">Time Spent</label>
                    <div className="flex gap-4">
                        <input type="number" min="0" placeholder="Hour(s)" value={formData.timeHours} onChange={e => setFormData(p => ({ ...p, timeHours: Number(e.target.value) }))} className="w-1/2 p-3 border border-gray-300 rounded-xl text-lg font-montserrat" />
                        <input type="number" min="0" max="59" placeholder="Minute(s)" value={formData.timeMinutes} onChange={e => setFormData(p => ({ ...p, timeMinutes: Number(e.target.value) }))} className="w-1/2 p-3 border border-gray-300 rounded-xl text-lg font-montserrat" />
                    </div>
                </div>

                <div className="flex justify-between items-center py-2"><label className="text-app-grey font-semibold">Taste</label><StarRating rating={formData.tasteRating} setRating={(r) => setFormData(p => ({ ...p, tasteRating: r }))} /></div>
                <div className="flex justify-between items-center py-2"><label className="text-app-grey font-semibold">Difficulty</label><StarRating rating={formData.difficultyRating} setRating={(r) => setFormData(p => ({ ...p, difficultyRating: r }))} /></div>
                <div><label className="block text-app-grey font-semibold mb-1">Categories</label><div className="flex flex-wrap gap-2">{journalCategories.map(cat => <button key={cat} onClick={() => handleCategoryToggle(cat)} className={`py-1 px-3 rounded-xl border text-base font-montserrat ${formData.categories && formData.categories.includes(cat) ? 'bg-burnt-orange text-light-peach border-burnt-orange' : 'bg-white text-app-grey border-gray-300'}`}>{cat}</button>)}</div></div>
                <div><label className="block text-app-grey font-semibold mb-1">Personal Notes</label><textarea name="personalNotes" value={formData.personalNotes} onChange={(e) => setFormData(p => ({ ...p, personalNotes: e.target.value }))} rows="4" className="w-full p-3 border border-gray-300 rounded-lg text-lg font-montserrat"></textarea></div>
                <div><label className="block text-app-grey font-semibold mb-1">Photos</label><div className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-app-grey/70">Photo upload coming soon!</div></div>
                <button onClick={() => onSave(formData)} className="w-full bg-burnt-orange text-light-peach py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity text-xl font-montserrat">Save Entry</button>
            </div>
        </Modal>
    );
};

export default JournalEntryForm;
