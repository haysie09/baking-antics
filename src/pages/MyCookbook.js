import React, { useState, useMemo } from 'react';
import CookbookForm from './CookbookForm';
import ConfirmationModal from '../components/ConfirmationModal';
import FilterComponent from '../components/FilterComponent';
import AddFromURLModal from '../components/AddFromURLModal'; // 1. Import the URL modal

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
        // Check if we are saving a new recipe (either manually or imported)
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
        // 1. Call our Netlify serverless function to fetch the website content
        const functionUrl = `/.netlify/functions/fetch-recipe?url=${encodeURIComponent(url)}`;
        
        try {
            const response = await fetch(functionUrl);
            if (!response.ok) {
                throw new Error('Could not fetch the website content.');
            }
            const { content: siteHtml } = await response.json();

            // 2. Extract visible text to send to the AI
            const parser = new DOMParser();
            const doc = parser.parseFromString(siteHtml, 'text/html');
            // We take the text content of the body, which is a good approximation of the visible text
            const pageText = doc.body.textContent || "";

            // 3. Send the extracted text to the Gemini AI
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

            // 4. Set the extracted data and open the pre-filled form
            setImportedRecipeData(recipeData);
            setIsUrlModalOpen(false); // Close the URL modal
            
        } catch (error) {
            console.error("Import Error:", error);
            // Re-throw the error so the modal can display it
            throw new Error("Failed to import recipe. The website might be blocking requests, or no recipe was found.");
        }
    };


    const filteredCookbook = useMemo(() => {
        let recipes = cookbook || [];
        if (activeFilters.categories.length > 0) {
            recipes = recipes.filter(recipe => 
                activeFilters.categories.every(filterCat => recipe.categories?.includes(filterCat))
            );
        }
        if (activeFilters.month !== 'all') {
            recipes = recipes.filter(recipe => recipe.createdAt && new Date(recipe.createdAt.toDate()).getMonth() === parseInt(activeFilters.month));
        }
        if (activeFilters.year !== 'all') {
            recipes = recipes.filter(recipe => recipe.createdAt && new Date(recipe.createdAt.toDate()).getFullYear() === parseInt(activeFilters.year));
        }
        return recipes;
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
                {filteredCookbook.length === 0 ? <div className="text-center py-16 bg-info-box rounded-xl border border-burnt-orange"><p className="text-app-grey text-2xl">{cookbook && cookbook.length > 0 ? "No recipes match filters" : "Save your favorite recipes"}</p></div> : [...filteredCookbook].sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate()).map(recipe => (
                    <div key={recipe.id} className="bg-info-box p-4 rounded-xl border border-burnt-orange">
                        {/* ... (existing recipe display logic) ... */}
                    </div>
                ))}
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
