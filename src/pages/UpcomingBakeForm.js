import React, { useState } from 'react';
import Modal from '../components/Modal';

const UpcomingBakeForm = ({ onSave, onCancel, bakeToEdit, cookbook }) => {
    const [formData, setFormData] = useState(bakeToEdit || {
        title: '',
        link: '',
        notes: '',
        bakeDate: ''
    });

    const handleSave = () => {
        if (formData.title && formData.bakeDate) {
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
                title: selectedRecipe.recipeTitle || '',
                link: selectedRecipe.sourceURL || '',
                notes: selectedRecipe.instructions || ''
            }));
        }
    };
    
    const today = new Date().toISOString().split('T')[0];

    return (
        <Modal onClose={onCancel} size="md">
            <div className="space-y-4 text-xl">
                <h2 className="text-4xl font-bold text-burnt-orange">
                    {bakeToEdit ? 'Edit Upcoming Bake' : 'Add Upcoming Bake'}
                </h2>
                
                {!bakeToEdit && cookbook && cookbook.length > 0 && (
                    <div className="relative">
                        <select
                            onChange={handleCookbookSelect}
                            className="w-full bg-white text-add-idea font-bold py-3 px-4 rounded-xl text-lg hover:bg-light-peach transition-colors shadow-sm font-montserrat appearance-none text-center"
                            defaultValue=""
                        >
                            <option value="" disabled>Pick from My Recipes</option>
                            {cookbook.map(recipe => (
                                <option key={recipe.id} value={recipe.id} className="font-montserrat text-app-grey">
                                    {recipe.recipeTitle}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-add-idea">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                )}
                
                <div>
                    <label className="block text-app-grey font-semibold mb-1">Title*</label>
                    <input type="text" value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-xl text-xl font-montserrat" />
                </div>
                
                <div>
                    <label className="block text-app-grey font-semibold mb-1">Planned Date*</label>
                    <input type="date" min={today} value={formData.bakeDate} onChange={(e) => setFormData(p => ({ ...p, bakeDate: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-xl text-xl font-montserrat" />
                </div>

                <div>
                    <label className="block text-app-grey font-semibold mb-1">Link (Optional)</label>
                    <input type="text" value={formData.link} onChange={(e) => setFormData(p => ({ ...p, link: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-xl text-xl font-montserrat" />
                </div>
                
                <div>
                    <label className="block text-app-grey font-semibold mb-1">Notes (Optional)</label>
                    <textarea value={formData.notes} onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))} rows="3" className="w-full p-3 border border-gray-300 rounded-lg text-lg font-montserrat"></textarea>
                </div>

                <button onClick={handleSave} className="w-full bg-burnt-orange text-light-peach py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity text-xl font-montserrat">
                    Save Bake
                </button>
            </div>
        </Modal>
    );
};

export default UpcomingBakeForm;
