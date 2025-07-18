const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
     <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 font-patrick-hand">
        <div className="bg-app-white rounded-2xl p-8 w-full max-w-sm shadow-xl text-center">
            <p className="text-app-grey text-2xl mb-6">{message}</p>
            <div className="flex justify-center space-x-4">
                <button onClick={onConfirm} className="bg-burnt-orange text-light-peach py-3 px-8 rounded-xl hover:opacity-90 transition-opacity text-xl font-montserrat">Yes</button>
                <button onClick={onCancel} className="bg-gray-100 text-app-grey py-3 px-8 rounded-xl hover:bg-gray-200 transition-colors text-xl font-montserrat">No</button>
            </div>
        </div>
    </div>
);