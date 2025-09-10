// Filename: src/components/MoveToJournalModal.js

import React from 'react';
import Modal from './Modal';

const MoveToJournalModal = ({ bake, onConfirm, onCancel }) => {
    return (
        <Modal onClose={onCancel} size="sm">
            <div className="text-center font-sans p-4">
                <h2 className="text-xl font-bold text-[#1b0d10]">Move to Journal?</h2>
                <p className="text-gray-600 mt-2">
                    This will mark <span className="font-bold">{bake.bakeName}</span> as complete and move it to your journal.
                </p>
                <div className="flex justify-center space-x-2 pt-4 mt-4">
                    <button onClick={onCancel} className="h-12 px-8 rounded-full bg-gray-100 text-gray-700 font-bold hover:bg-gray-200">Cancel</button>
                    <button onClick={onConfirm} className="h-12 px-8 rounded-full bg-[#f0425f] text-white font-bold hover:opacity-90">Confirm</button>
                </div>
            </div>
        </Modal>
    );
};

export default MoveToJournalModal;