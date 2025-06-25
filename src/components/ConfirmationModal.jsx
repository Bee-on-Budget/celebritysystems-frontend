// components/ConfirmationModal.jsx
import React from 'react';
import Button from './Button';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel"
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-600 mb-6">{message}</p>

                    <div className="flex justify-end space-x-3">
                        <Button
                            onClick={onClose}
                            variant='outline'
                        >
                            {cancelText}
                        </Button>
                        <Button
                            onClick={onConfirm}
                        >
                            {confirmText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;