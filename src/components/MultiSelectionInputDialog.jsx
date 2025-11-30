import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import Button from "./Button";
import { FaCheck } from "react-icons/fa";

const MultiSelectionInputDialog = ({
  label,
  id,
  required,
  className = "",
  error,
  value = [],
  onChange,
  disabled = false,
  isOpen,
  onClose,
  onConfirm,
  fetchItems,
  getItemLabel = (item) => item?.name || item?.label || String(item),
  getItemValue = (item) => item?.id || item?.value || item,
  placeholder = "",
  searchPlaceholder = "",
  ...props
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedValues, setSelectedValues] = useState(new Set(value || []));
  const searchInputRef = useRef(null);
  const listRef = useRef(null);

  // Initialize selected values from prop
  useEffect(() => {
    if (isOpen) {
      setSelectedValues(new Set(value || []));
    }
  }, [isOpen, value]);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setItems([]);
      setSearchError("");
      setSelectedIndex(-1);
      // Focus search input when dialog opens
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  // Fetch items when search query has 3+ characters
  useEffect(() => {
    const trimmedQuery = searchQuery.trim();
    
    if (trimmedQuery.length >= 3) {
      const fetchData = async () => {
        setIsLoading(true);
        setSearchError("");
        try {
          const results = await fetchItems(trimmedQuery);
          const itemsArray = Array.isArray(results) ? results : (results?.content || results?.data || []);
          setItems(itemsArray);
        } catch (err) {
          setSearchError(err?.message || t('common.errorFetchingData'));
          setItems([]);
        } finally {
          setIsLoading(false);
        }
      };

      // Debounce the search
      const timeoutId = setTimeout(fetchData, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setItems([]);
      setSearchError("");
    }
  }, [searchQuery, fetchItems, t]);

  const handleToggleItem = useCallback((item) => {
    const itemValue = getItemValue(item);
    setSelectedValues(prev => {
      const newSet = new Set(prev);
      if (newSet.has(String(itemValue))) {
        newSet.delete(String(itemValue));
      } else {
        newSet.add(String(itemValue));
      }
      return newSet;
    });
  }, [getItemValue]);

  const handleConfirm = useCallback(() => {
    const selectedArray = Array.from(selectedValues);
    
    // Update the input value
    if (onChange) {
      onChange({ target: { name: id, value: selectedArray } });
    }
    
    // Call onConfirm callback if provided
    if (onConfirm) {
      onConfirm(selectedArray);
    }
    
    onClose();
  }, [selectedValues, onChange, onConfirm, onClose, id]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;

    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => 
        prev < items.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex >= 0 && items[selectedIndex]) {
      e.preventDefault();
      handleToggleItem(items[selectedIndex]);
    }
  }, [isOpen, items, selectedIndex, onClose, handleToggleItem]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [selectedIndex]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const selectedCount = selectedValues.size;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              {label || t('common.selectItems')}
              {required && <span className="text-red-500 ml-1">*</span>}
            </h3>
            {selectedCount > 0 && (
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {selectedCount} {selectedCount === 1 ? t('common.itemSelected') : t('common.itemsSelected')}
              </span>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <label 
              htmlFor={`${id}-search`} 
              className={`block text-sm font-medium capitalize ${
                disabled ? "text-gray-400" : "text-dark"
              }`}
            >
              {t('common.search')}
            </label>
            <input
              ref={searchInputRef}
              id={`${id}-search`}
              name={`${id}-search`}
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder={searchPlaceholder || t('common.typeToSearch')}
              disabled={disabled}
              className={`w-full px-4 py-2 mt-2 border rounded focus:outline-none focus:ring-2 ${
                disabled 
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" 
                  : searchError 
                    ? "border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:ring-primary"
              } ${className}`}
            />
            {searchError && <p className="mt-1 text-sm text-red-500">{searchError}</p>}
            {searchQuery.trim().length > 0 && searchQuery.trim().length < 3 && (
              <p className="mt-1 text-sm text-gray-500">
                {t('common.typeAtLeast3Characters')}
              </p>
            )}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-8 h-8 border-4 border-primary border-dashed rounded-full animate-spin"></div>
                <p className="text-dark font-medium text-sm">{t('common.loading')}</p>
              </div>
            </div>
          ) : searchQuery.trim().length < 3 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <p className="text-gray-500 text-sm">
                {t('common.typeAtLeast3CharactersToSearch')}
              </p>
            </div>
          ) : items.length === 0 && !searchError ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <p className="text-gray-500 text-sm">
                {t('common.noResultsFound')}
              </p>
            </div>
          ) : (
            <div 
              ref={listRef}
              className="flex-1 overflow-y-auto p-2"
            >
              {items.map((item, index) => {
                const itemLabel = getItemLabel(item);
                const itemValue = getItemValue(item);
                const isSelected = selectedIndex === index;
                const isChecked = selectedValues.has(String(itemValue));

                return (
                  <div
                    key={itemValue}
                    onClick={() => handleToggleItem(item)}
                    className={`px-4 py-3 cursor-pointer rounded-md transition-colors duration-150 flex items-center justify-between ${
                      isSelected
                        ? "bg-primary text-white"
                        : isChecked
                          ? "bg-blue-50 text-gray-900 border border-blue-200"
                          : "hover:bg-gray-100 text-gray-900"
                    }`}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                        isChecked 
                          ? "bg-primary border-primary" 
                          : "border-gray-300"
                      } ${isSelected && !isChecked ? "border-white" : ""}`}>
                        {isChecked && (
                          <FaCheck className={`text-xs ${isSelected ? "text-white" : "text-white"}`} />
                        )}
                      </div>
                      <span className={isChecked ? "font-medium" : ""}>
                        {itemLabel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-between items-center">
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleConfirm}
            size="sm"
          >
            {t('common.done')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MultiSelectionInputDialog;






