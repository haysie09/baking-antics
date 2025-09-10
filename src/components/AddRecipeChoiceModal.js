import React from 'react';

const AddRecipeChoiceModal = ({ onImport, onManual, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 font-sans">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center space-y-4">
                <h2 className="text-xl font-bold text-[#1b0d10]">Add a Recipe</h2>
                <p className="text-sm text-gray-500 pb-2">How would you like to add a new recipe to your cookbook?</p>
                <div className="space-y-3">
                    <button 
                        onClick={onImport}
                        className="w-full h-12 flex items-center justify-center rounded-full bg-[#f0425f] text-white font-bold text-base hover:opacity-90"
                    >
                        Import from Website
                    </button>
                    <button 
                        onClick={onManual}
                        className="w-full h-12 flex items-center justify-center rounded-full bg-white text-[#1b0d10] font-bold text-base border border-pink-200 shadow-sm hover:bg-gray-50"
                    >
                        Add Manually
                    </button>
                </div>
                <button 
                    onClick={onCancel}
                    className="w-full text-center text-sm text-gray-500 hover:text-[#f0425f] pt-2"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default AddRecipeChoiceModal;