// Filename: src/components/Modal.js

import React from 'react';

const Modal = ({ children, onClose, size = 'md', showFooter = true }) => {
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
    };

    return (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 font-sans">
            {/* Clickaway closes the modal */}
            <div onClick={onClose} className="absolute inset-0"></div>

            <div className={`relative bg-white rounded-2xl p-6 w-full ${sizeClasses[size]} shadow-xl`}>
                {children}

                {/* THE FIX: The footer and its Close button are now conditional */}
                {showFooter && (
                    <div className="flex justify-center pt-4">
                        <button 
                            onClick={onClose} 
                            className="h-12 px-8 rounded-full bg-gray-100 text-gray-700 font-bold hover:bg-gray-200"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;