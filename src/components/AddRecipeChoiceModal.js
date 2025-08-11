import React from 'react';

const AddRecipeChoiceModal = ({ onImport, onManual, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 font-patrick-hand">
            <div className="bg-app-white rounded-2xl p-8 w-full max-w-sm shadow-xl text-center space-y-4">
                <h2 className="text-3xl text-burnt-orange">How would you like to add a recipe?</h2>
                <button 
                    onClick={onImport}
                    className="w-full bg-add-idea text-white py-3 px-4 rounded-xl text-lg font-normal font-montserrat hover:opacity-90 transition-opacity"
                >
                    Import from Website
                </button>
                <button 
                    onClick={onManual}
                    className="w-full bg-add-idea text-white py-3 px-4 rounded-xl text-lg font-normal font-montserrat hover:opacity-90 transition-opacity"
                >
                    Add Manually
                </button>
                <button 
                    onClick={onCancel}
                    className="w-full text-center text-app-grey hover:text-burnt-orange text-lg pt-2"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default AddRecipeChoiceModal;
