import React, { useState } from 'react';

const AddFromURLModal = ({ onImport, onCancel }) => {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImportClick = async () => {
        if (!url || !url.startsWith('http')) {
            setError('Please enter a valid website URL.');
            return;
        }
        setError('');
        setIsLoading(true);

        // We will pass the import logic function 'onImport' from the parent.
        // This keeps the AI logic separate from this simple UI component.
        try {
            await onImport(url);
            // The parent component will handle closing this modal on success.
        } catch (err) {
            setError(err.message || 'Failed to import recipe. Please try another link.');
            setIsLoading(false); // Stop loading on error
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 font-patrick-hand">
            <div className="bg-app-white rounded-2xl p-8 w-full max-w-md shadow-xl text-center space-y-4">
                <h2 className="text-3xl text-burnt-orange">Import Recipe from Website</h2>
                <p className="font-montserrat text-app-grey/80 text-base">
                    Paste the URL of a recipe and we'll try to import it for you!
                </p>
                
                <input 
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://your-favorite-recipe-site.com/..."
                    className="w-full p-3 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-burnt-orange focus:outline-none font-montserrat"
                    disabled={isLoading}
                />

                {error && <p className="text-red-500 text-sm font-montserrat">{error}</p>}

                <div className="flex justify-center space-x-4 pt-2">
                    <button 
                        onClick={handleImportClick}
                        disabled={isLoading}
                        className="bg-add-idea text-white py-3 px-8 rounded-xl hover:opacity-90 transition-opacity text-xl font-montserrat disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            'Import'
                        )}
                    </button>
                    <button 
                        onClick={onCancel} 
                        disabled={isLoading}
                        className="bg-gray-100 text-app-grey py-3 px-8 rounded-xl hover:bg-gray-200 transition-colors text-xl font-montserrat"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddFromURLModal;
