import React from 'react';
import Button from './Button';

const Pagination = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNext,
    hasPrevious,
    onPageChange,
    className,
}) => {
    const startItem = currentPage * itemsPerPage + 1;
    const endItem = Math.min((currentPage + 1) * itemsPerPage, totalItems);

    return (
        <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 ${className}`}>
            <div className="text-sm text-dark-light">
                Showing {startItem}-{endItem} of {totalItems} items
            </div>
            <div className="flex items-center space-x-2">
                <Button variant='outline' size='sm' onClick={() => onPageChange(currentPage - 1)} isDisabled={!hasPrevious}>
                    Previous
                </Button>
                <span className="px-4 py-2 text-primary rounded">
                    Page {currentPage + 1} of {totalPages}
                </span>
                <Button variant='outline' size='sm' onClick={() => onPageChange(currentPage + 1)} isDisabled={!hasNext}>
                    Next
                </Button>
            </div>
        </div>
    );
};

export default Pagination;