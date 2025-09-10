import React from 'react';

const LoadingSpinner = () => (
    // UPDATED: Background color
    <div className="flex items-center justify-center h-screen bg-[#fcf8f9]">
        {/* UPDATED: Spinner colors */}
        <div className="w-16 h-16 border-4 border-pink-100 border-t-[#f0425f] rounded-full animate-spin"></div>
    </div>
);

export default LoadingSpinner;