import React, { useState } from 'react';
import Modal from '../components/Modal';

const UpcomingBakeForm = ({ onSave, onCancel, bakeToEdit }) => {
    // Set initial state from bakeToEdit prop if it exists, otherwise use defaults
    const [formData, setFormData] = useState(bakeToEdit || {
        title: '',
        link: '',
        notes: '',
        bakeDate: ''
    });

    const handleSave = () => {
        // Basic validation to ensure title and date are filled
        if (formData.title && formData.bakeDate) {
            onSave(formData);
        } else {
            alert('Please provide a title and a date.');
        }
    };
    
    // Prevent users from selecting a past date
    const today = new Date().toISOString().split('T')[0];

    return (
        <Modal onClose={onCancel} size="md">
            <div className="space-y-4 text-xl">
                <h2 className="text-4xl font-bold text-burnt-orange">
                    {bakeToEdit ? 'Edit Upcoming Bake' : 'Add Upcoming Bake'}
                </h2>
                
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