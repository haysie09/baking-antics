import React, { useState } from 'react';
import Modal from '../components/Modal';

// Note: These constants will be moved later. For now, we'll copy them here.
const journalCategories = ["Bread", "Cake", "Cupcake", "Cookie", "No-Bake", "Cheesecake", "Pastry", "Slice", "Tart"];

const IdeaForm = ({ onSave, onCancel }) => {
    const [newIdea, setNewIdea] = useState({ ideaName: '', notes: '', sourceURL: '', categories: [] });

    const handleCategoryToggle = (cat) => {
        const categories = newIdea.categories.includes(cat)
            ? newIdea.categories.filter(c => c !== cat)
            : [...newIdea.categories, cat];
        setNewIdea(p => ({ ...p, categories }));
    };

    const handleAdd = () => {
        if (newIdea.ideaName.trim()) {
            onSave(newIdea);
        }
    };

    return (
        <Modal onClose={onCancel} size="md">
            <div className="space-y-4 text-xl">
                <h2 className="text-4xl font-bold text-burnt-orange">Add New Idea</h2>
                <input type="text" value={newIdea.ideaName} onChange={(e) => setNewIdea(p => ({ ...p, ideaName: e.target.value }))} placeholder="Baking Idea Name*" className="w-full p-3 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-burnt-orange focus:outline-none font-montserrat" />
                <input type="text" value={newIdea.notes} onChange={(e) => setNewIdea(p => ({ ...p, notes: e.target.value }))} placeholder="Optional notes..." className="w-full p-3 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-burnt-orange focus:outline-none font-montserrat" />
                <input type="text" value={newIdea.sourceURL} onChange={(e) => setNewIdea(p => ({ ...p, sourceURL: e.target.value }))} placeholder="Optional link..." className="w-full p-3 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-burnt-orange focus:outline-none font-montserrat" />
                <div>
                    <label className="block text-app-grey font-semibold mb-2 text-xl">Categories</label>
                    <div className="flex flex-wrap gap-2">{journalCategories.map(cat => <button key={cat} onClick={() => handleCategoryToggle(cat)} className={`py-1 px-3 rounded-xl border text-base font-montserrat ${newIdea.categories.includes(cat) ? 'bg-burnt-orange text-light-peach border-burnt-orange' : 'bg-white text-app-grey border-gray-300'}`}>{cat}</button>)}</div>
                </div>
                <button onClick={handleAdd} className="w-full bg-burnt-orange text-light-peach py-3 px-6 rounded-xl text-lg hover:opacity-90 transition-opacity font-montserrat">Add to List</button>
            </div>
        </Modal>
    );
};

export default IdeaForm;