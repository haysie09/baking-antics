// Filename: src/components/CreateNewModal.js

import React from 'react';

const CreateNewModal = ({ 
    onClose, 
    onAddRecipe, 
    onAddIdea, 
    onAddBake, 
    onScheduleBake 
}) => {
    // Helper component for the list items
    const ActionButton = ({ onClick, icon, text }) => (
        <button 
            onClick={onClick} 
            className="flex items-center w-full gap-4 p-4 rounded-xl hover:bg-[#F3E7E9] transition-colors duration-200"
        >
            <div className="text-[#f0425f] flex items-center justify-center rounded-full bg-[#FCE9EC] shrink-0 size-12">
                {icon}
            </div>
            <p className="text-[#1B0D10] text-lg font-medium">{text}</p>
        </button>
    );
    
    // Icons for the buttons
    const icons = {
        recipe: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
        idea: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
        bake: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.8c0 .7-.3 1.3-.8 1.8-.5.4-1.1.6-1.7.6H5.5c-.6 0-1.2-.2-1.7-.6-.5-.5-.8-1.1-.8-1.8v-1.2c0-.7.3-1.3.8-1.8.5-.4 1.1-.6 1.7-.6h13c.6 0 1.2.2 1.7.6.5.5.8 1.1.8 1.8v1.2zM20 8.2v2.2M16 4.2v6.2M12 6.2v4.2M8 4.2v6.2M4 8.2v2.2" /></svg>,
        schedule: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end font-sans">
            {/* Backdrop */}
            <div onClick={onClose} className="absolute inset-0 bg-black/30"></div>
            
            {/* Modal Panel */}
            <div className="relative z-50 w-full bg-[#FCF8F9] rounded-t-3xl pb-4">
                <div className="flex justify-center py-3">
                    <div className="h-1.5 w-10 rounded-full bg-gray-300"></div>
                </div>
                <div className="px-6 py-4">
                    <h1 className="text-[#1B0D10] text-xl font-bold text-center mb-6">Create New</h1>
                    <div className="space-y-2">
                        <ActionButton onClick={onAddRecipe} icon={icons.recipe} text="Add Recipe" />
                        <ActionButton onClick={onAddIdea} icon={icons.idea} text="Add Idea" />
                        <ActionButton onClick={onAddBake} icon={icons.bake} text="Add Bake" />
                        <ActionButton onClick={onScheduleBake} icon={icons.schedule} text="Schedule a Bake" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateNewModal;