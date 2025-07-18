const Modal = ({ children, onClose, size = 'sm' }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
        <div className={`bg-app-white rounded-2xl flex flex-col w-full max-w-${size} shadow-xl max-h-[90vh]`}>
            <div className="p-6 overflow-y-auto font-patrick-hand">
                {children}
            </div>
            <div className="p-4 border-t border-gray-200">
                 <button onClick={onClose} className="w-full bg-gray-100 text-app-grey py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors text-xl font-montserrat">Close</button>
            </div>
        </div>
    </div>
);