import React from 'react';

const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-screen bg-app-white">
        <div className="w-16 h-16 border-4 border-light-peach border-t-add-idea rounded-full animate-spin"></div>
    </div>
);

export default LoadingSpinner;