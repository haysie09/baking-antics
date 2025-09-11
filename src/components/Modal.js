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

            {/* Modal Panel: Now a flex column with a max height, preventing it from growing off-screen */}
            <div className={`relative bg-white rounded-2xl shadow-xl w-full ${sizeClasses[size]} flex flex-col max-h-[90vh]`}>
                
                {/* Content Area: This new div will grow and scroll if content overflows */}
                <div className="overflow-y-auto p-6">
                    {children}
                </div>

                {/* Footer Area: This stays at the bottom and does not scroll */}
                {showFooter && (
                    <div className="flex-shrink-0 flex justify-center p-4 border-t border-gray-200">
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