// components/ConfirmationModal.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from './Button';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    cancelText
}) => {
    const { t } = useTranslation();
    
    // Use translations as defaults if props are not provided
    const modalTitle = title || t('common.confirmTitle');
    const modalMessage = message || t('common.confirmMessage');
    const modalConfirmText = confirmText || t('common.confirm');
    const modalCancelText = cancelText || t('common.cancel');
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{modalTitle}</h3>
                    <p className="text-gray-600 mb-6">{modalMessage}</p>

                    <div className="flex justify-end space-x-3 gap-3">
                        <Button
                            onClick={onClose}
                            variant='outline'
                            size='sm'
                        >
                            {modalCancelText}
                        </Button>
                        <Button
                            onClick={onConfirm}
                            size='sm'
                        >
                            {modalConfirmText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;