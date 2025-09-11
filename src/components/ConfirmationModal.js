import React from 'react';

// A simple warning icon for visual feedback
const WarningIcon = () => (
    <svg className="w-12 h-12 text-red-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);


const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
    return (
        // Overlay for the modal
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 font-sans">
            
            {/* Modal Card */}
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
                
                <WarningIcon />
                
                {/* Typography */}
                <h3 className="text-xl font-bold text-[#1b0d10]">{message}</h3>
                <p className="text-sm text-gray-500 mt-2 mb-6">This action cannot be undone.</p>
                
                {/* Action Buttons */}
                <div className="flex justify-center space-x-4">
                    <button 
                        onClick={onCancel} 
                        className="flex-1 py-3 px-4 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
                    >
                        No, Keep It
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="flex-1 py-3 px-4 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
                    >
                        Yes, Delete
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ConfirmationModal;