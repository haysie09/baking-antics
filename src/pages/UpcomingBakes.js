import React, { useState } from 'react';
import UpcomingBakeForm from './UpcomingBakeForm'; // 1. Import the new form

const UpcomingBakes = ({ upcomingBakes, addUpcomingBake, updateUpcomingBake, deleteUpcomingBake }) => {
    // 2. Add state to manage the form's visibility
    const [isFormOpen, setIsFormOpen] = useState(false);

    // 3. Define the save handler
    const handleSaveBake = async (bakeData) => {
        await addUpcomingBake(bakeData);
        setIsFormOpen(false); // Close the modal after saving
    };

    return (
        <div className="bg-info-box p-4 rounded-2xl border border-burnt-orange">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-burnt-orange">Upcoming Bakes</h3>
                {/* 4. Update the button's onClick handler */}
                <button onClick={() => setIsFormOpen(true)} className="text-add-idea" title="Add Upcoming Bake">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
            </div>
            <div className="space-y-3">
                {upcomingBakes && upcomingBakes.length > 0 ? (
                    upcomingBakes.map(bake => (
                        <div key={bake.id} className="p-2 bg-app-white rounded-lg">
                            <p className="text-app-grey text-lg">{bake.title}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-app-grey/70 py-4">No upcoming bakes scheduled.</p>
                )}
            </div>

            {/* 5. Conditionally render the form modal */}
            {isFormOpen && (
                <UpcomingBakeForm 
                    onSave={handleSaveBake}
                    onCancel={() => setIsFormOpen(false)}
                />
            )}
        </div>
    );
};

export default UpcomingBakes;