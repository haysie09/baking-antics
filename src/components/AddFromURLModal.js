import React, { useState } from 'react';

const AddFromURLModal = ({ onSave, onCancel }) => {
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

        try {
            // This calls the Netlify function directly
            const response = await fetch(`/.netlify/functions/fetch-recipe?url=${encodeURIComponent(url)}`);
            if (!response.ok) {
                // This will catch errors from the function itself (e.g., 404, 500)
                throw new Error('Server responded with an error.');
            }
            const recipeData = await response.json();
            
            // Pass the successfully fetched data up to App.js to be saved
            onSave({ ...recipeData, sourceURL: url });
            
        } catch (err) {
            // The new friendly error message is here
            setError("Sorry, we were unable to import from that website. Feel free to add the recipe manually and include the link for reference.");
            console.error(err); // Log the technical error for debugging
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 font-sans">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center space-y-4">
                <h2 className="text-xl font-bold text-[#1b0d10]">Import Recipe from Website</h2>
                <p className="text-sm text-gray-500">
                    Paste the URL of a recipe and we'll try to import it for you!
                </p>
                
                <input 
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full h-12 px-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#f0425f] focus:outline-none"
                    disabled={isLoading}
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex justify-center space-x-2 pt-2">
                    <button 
                        onClick={handleImportClick}
                        disabled={isLoading}
                        className="h-12 px-8 rounded-full bg-[#f0425f] text-white font-bold flex items-center justify-center disabled:opacity-50"
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
                        className="h-12 px-8 rounded-full bg-gray-100 text-gray-700 font-bold hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddFromURLModal;