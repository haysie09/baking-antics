import React, 'useState } from 'react';
import Modal from '../components/Modal';

const journalCategories = ["Bread", "Cake", "Cupcake", "Cookie", "No-Bake", "Cheesecake", "Pastry", "Slice", "Tart"];

const IdeaForm = ({ onSave, onCancel }) => {
    const [newIdea, setNewIdea] = useState({ ideaName: '', notes: '', sourceURL: '', categories: [] });

    // This logic is unchanged
    const handleCategoryToggle = (cat) => {
        const categories = newIdea.categories.includes(cat)
            ? newIdea.categories.filter(c => c !== cat)
            : [...newIdea.categories, cat];
        setNewIdea(p => ({ ...p, categories }));
    };

    // This logic is unchanged
    const handleAdd = () => {
        if (newIdea.ideaName.trim()) {
            onSave(newIdea);
        }
    };

    return (
        <Modal onClose={onCancel} size="md">
            {/* UPDATED: Main container with new font and styling */}
            <div className="space-y-4 font-sans">
                <h2 className="text-xl font-bold text-center text-[#1b0d10]">Add New Idea</h2>
                
                <input 
                    type="text" 
                    value={newIdea.ideaName} 
                    onChange={(e) => setNewIdea(p => ({ ...p, ideaName: e.target.value }))} 
                    placeholder="Baking Idea Name*" 
                    className="w-full h-12 px-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#f0425f] focus:outline-none" 
                />
                <input 
                    type="text" 
                    value={newIdea.notes} 
                    onChange={(e) => setNewIdea(p => ({ ...p, notes: e.target.value }))} 
                    placeholder="Optional notes..." 
                    className="w-full h-12 px-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#f0425f] focus:outline-none" 
                />
                <input 
                    type="text" 
                    value={newIdea.sourceURL} 
                    onChange={(e) => setNewIdea(p => ({ ...p, sourceURL: e.target.value }))} 
                    placeholder="Optional link..." 
                    className="w-full h-12 px-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#f0425f] focus:outline-none" 
                />
                
                <div>
                    <label className="block text-[#1b0d10] font-semibold mb-2 text-base">Categories</label>
                    <div className="flex flex-wrap gap-2">
                        {journalCategories.map(cat => (
                            <button 
                                key={cat} 
                                onClick={() => handleCategoryToggle(cat)} 
                                // UPDATED: Category button styling
                                className={`py-1 px-3 rounded-full border text-sm ${newIdea.categories.includes(cat) ? 'bg-[#f0425f] text-white border-[#f0425f]' : 'bg-white text-gray-700 border-gray-300'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* UPDATED: Main action button styling */}
                <button 
                    onClick={handleAdd} 
                    className="w-full h-12 flex items-center justify-center rounded-full bg-[#f0425f] text-white font-bold text-base hover:opacity-90 transition-opacity"
                >
                    Add to List
                </button>
            </div>
        </Modal>
    );
};

export default IdeaForm;