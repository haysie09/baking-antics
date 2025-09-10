import React, { useState } from 'react';
import Modal from '../components/Modal';

const UpcomingBakeForm = ({ onSave, onCancel, bakeToEdit, cookbook }) => {
    // Corrected initial state keys to match data model ('bakeName', 'bakeDate')
    const [formData, setFormData] = useState(bakeToEdit || {
        bakeName: '',
        link: '',
        notes: '',
        bakeDate: ''
    });

    const handleSave = () => {
        if (formData.bakeName && formData.bakeDate) {
            onSave(formData);
        } else {
            alert('Please provide a title and a date.');
        }
    };

    const handleCookbookSelect = (e) => {
        const recipeId = e.target.value;
        if (!recipeId) return;

        const selectedRecipe = cookbook.find(r => r.id === recipeId);
        if (selectedRecipe) {
            setFormData(prev => ({
                ...prev,
                bakeName: selectedRecipe.recipeTitle || '', // Sets correct field
                link: selectedRecipe.sourceURL || '',
                notes: selectedRecipe.instructions || ''
            }));
        }
    };
    
    const today = new Date().toISOString().split('T')[0];

    return (
        <Modal onClose={onCancel} size="md">
            <div className="space-y-4 font-sans">
                <h2 className="text-xl font-bold text-center text-[#1b0d10]">
                    {bakeToEdit ? 'Edit Upcoming Bake' : 'Schedule a Bake'}
                </h2>
                
                {!bakeToEdit && cookbook && cookbook.length > 0 && (
                    <div className="relative">
                        <select
                            onChange={handleCookbookSelect}
                            className="w-full h-12 px-4 appearance-none rounded-full border border-pink-200 bg-white text-base font-medium text-[#1b0d10] shadow-sm focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-300"
                            defaultValue=""
                        >
                            <option value="" disabled>Or, pick from My Recipes</option>
                            {cookbook.map(recipe => (
                                <option key={recipe.id} value={recipe.id}>
                                    {recipe.recipeTitle}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#1b0d10]">
                           <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                )}
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                    <input type="text" value={formData.bakeName} onChange={(e) => setFormData(p => ({ ...p, bakeName: e.target.value }))} className="w-full h-12 px-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#f0425f] focus:outline-none" />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Planned Date*</label>
                    <input type="date" min={today} value={formData.bakeDate} onChange={(e) => setFormData(p => ({ ...p, bakeDate: e.target.value }))} className="w-full h-12 px-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#f0425f] focus:outline-none" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Link (Optional)</label>
                    <input type="text" value={formData.link} onChange={(e) => setFormData(p => ({ ...p, link: e.target.value }))} className="w-full h-12 px-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#f0425f] focus:outline-none" />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                    <textarea value={formData.notes} onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))} rows="3" className="w-full p-4 border border-gray-300 rounded-2xl text-base focus:ring-2 focus:ring-[#f0425f] focus:outline-none"></textarea>
                </div>

                <button onClick={handleSave} className="w-full h-12 flex items-center justify-center rounded-full bg-[#f0425f] text-white font-bold text-base hover:opacity-90 transition-opacity">
                    Save Bake
                </button>
            </div>
        </Modal>
    );
};

export default UpcomingBakeForm;