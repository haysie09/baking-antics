// Filename: src/components/RecipeDetailModal.js

import React from 'react';
import Modal from './Modal';

const RecipeDetailModal = ({ recipe, onClose }) => {
    if (!recipe) return null;

    return (
        <Modal onClose={onClose} size="md">
            <div className="space-y-4 font-sans text-[#1b0d10]">
                <h2 className="text-2xl font-bold">{recipe.recipeTitle}</h2>
                
                {recipe.ingredients && recipe.ingredients.length > 0 && (
                    <div>
                        <h3 className="font-bold mb-1">Ingredients</h3>
                        <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                            {recipe.ingredients.map((ing, i) => (
                                <li key={i}>{ing.quantity} {ing.measurement} {ing.name}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {recipe.instructions && (
                     <div className="mt-4">
                        <h3 className="font-bold mb-1">Instructions</h3>
                        <p className="whitespace-pre-wrap text-gray-700 text-sm">{recipe.instructions}</p>
                    </div>
                )}

                <div className="flex justify-center pt-4">
                    <button 
                        onClick={onClose} 
                        className="h-12 px-8 rounded-full bg-gray-100 text-gray-700 font-bold hover:bg-gray-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default RecipeDetailModal;