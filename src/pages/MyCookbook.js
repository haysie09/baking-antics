import React, { useState, useMemo } from 'react';
import CookbookForm from './CookbookForm';
import ConfirmationModal from '../components/ConfirmationModal';
import FilterComponent from '../components/FilterComponent';
import AddFromURLModal from '../components/AddFromURLModal'; // 1. Import the new modal

const journalCategories = ["Bread", "Cake", "Cupcake", "Cookie", "No-Bake", "Cheesecake", "Pastry", "Slice", "Tart"];

const MyCookbook = ({ cookbook, addRecipe, updateRecipe, deleteRecipe }) => {
    const [editingRecipe, setEditingRecipe] = useState(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(null);
    const [expandedCookbookId, setExpandedCookbookId] = useState(null);
    const [activeFilters, setActiveFilters] = useState({
        categories: [],
        month: 'all',
        year: 'all'
    });
    
    // --- NEW: State for the AI import flow ---
    const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
    const [importedRecipeData, setImportedRecipeData] = useState(null);

    const handleSave = async (recipeData) => {
        if (isCreatingNew || importedRecipeData) {
            await addRecipe({ ...recipeData, createdAt: new Date() });
            setImportedRecipeData(null); // Clear imported data after saving
        } else {
            await updateRecipe(editingRecipe.id, recipeData);
        }
        setEditingRecipe(null);
        setIsCreatingNew(false);
    };

    const handleFilterChange = (filters) => {
        setActiveFilters(filters);
    };

    // --- NEW: Function to handle the AI import ---
    const handleImportRecipe = async (url) => {
        // NOTE: In a production app, this fetch call should be made from a serverless function
        // to avoid CORS issues from recipe websites. For now, we'll use a proxy.
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        
        try {
            const response = await fetch(proxyUrl);
            if (!response.ok) {
                throw new Error('Could not fetch the website content.');
            }
            const siteHtml = await response.text();

            // Extract visible text to send to the AI
            const parser = new DOMParser();
            const doc = parser.parseFromString(siteHtml, 'text/html');
            const pageText = doc.body.innerText;

            const apiKey = ""; // The API key will be provided by the environment
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

            const payload = {
                contents: [{
                    parts: [{
                        text: `Analyze the following website text and extract the recipe details. Provide the output in a valid JSON format. Here is the website content: "${pageText}"`
                    }]
                }],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "OBJECT",
                        properties: {
                            recipeTitle: { type: "STRING" },
                            ingredients: {
                                type: "ARRAY",
                                items: {
                                    type: "OBJECT",
                                    properties: {
                                        quantity: { type: "STRING" },
                                        measurement: { type: "STRING" },
                                        name: { type: "STRING" }
                                    },
                                    required: ["name"]
                                }
                            },
                            instructions: { type: "STRING" }
                        },
                        required: ["recipeTitle", "ingredients", "instructions"]
                    }
                }
            };

            const aiResponse = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!aiResponse.ok) {
                throw new Error('The AI model could not process the request.');
            }

            const result = await aiResponse.json();
            const recipeJsonText = result.candidates[0].content.parts[0].text;
            const recipeData = JSON.parse(recipeJsonText);

            // Set the extracted data and open the pre-filled form
            setImportedRecipeData(recipeData);
            setIsUrlModalOpen(false); // Close the URL modal
            
        } catch (error) {
            console.error("Import Error:", error);
            throw new Error("Failed to import recipe. The website might be blocking requests, or no recipe was found.");
        }
    };


    const filteredCookbook = useMemo(() => {
        // ... (existing filter logic)
        return cookbook; // Placeholder
    }, [cookbook, activeFilters]);

    return (
        <div className="p-4 md:p-6 bg-app-white min-h-full font-patrick-hand">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-burnt-orange">My Cookbook</h1>
                <div className="flex gap-2">
                    {/* --- NEW: "Add from Website" Button --- */}
                    <button onClick={() => setIsUrlModalOpen(true)} className="bg-add-idea text-white py-2 px-4 rounded-xl text-sm font-normal font-montserrat hover:opacity-90 transition-opacity">Add from Website</button>
                    <button onClick={() => setIsCreatingNew(true)} className="bg-add-idea text-white py-2 px-4 rounded-xl text-sm font-normal font-montserrat hover:opacity-90 transition-opacity">Add Recipe</button>
                </div>
            </div>
            
            <FilterComponent 
                categories={journalCategories}
                onFilterChange={handleFilterChange}
            />

            <div className="space-y-4">
                {/* ... (existing cookbook list mapping) ... */}
            </div>

            {/* --- MODALS --- */}
            {isUrlModalOpen && (
                <AddFromURLModal 
                    onImport={handleImportRecipe}
                    onCancel={() => setIsUrlModalOpen(false)}
                />
            )}
            
            {(isCreatingNew || importedRecipeData) && (
                <CookbookForm 
                    initialData={importedRecipeData} // Pass the AI data to the form
                    isNew={true}
                    onSave={handleSave} 
                    onCancel={() => {
                        setIsCreatingNew(false);
                        setImportedRecipeData(null);
                    }} 
                />
            )}

            {editingRecipe && (
                 <CookbookForm 
                    recipe={editingRecipe} 
                    onSave={handleSave} 
                    onCancel={() => setEditingRecipe(null)} 
                />
            )}

            {showConfirmModal && <ConfirmationModal message="Delete this recipe?" onConfirm={() => { deleteRecipe(showConfirmModal); setShowConfirmModal(null); }} onCancel={() => setShowConfirmModal(null)} />}
        </div>
    );
};

export default MyCookbook;
