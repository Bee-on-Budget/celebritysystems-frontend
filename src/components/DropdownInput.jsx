import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

const DropdownInput = ({
  label,
  name,
  value,
  onChange,
  options,
  icon,
  error,
  required,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleOptionClick = (option) => {
    onChange({ target: { name, value: option.value } });
    setIsOpen(false);
  };

  const selected = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative mb-4" ref={dropdownRef}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-dark">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative mt-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between rounded-md border px-4 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary ${error ? "border-red-500" : "border-gray-300"
            } bg-white`}
        >
          <div className="flex items-center space-x-2">
            {icon && <span className="text-gray-400 w-5">{icon}</span>}
            <span className="text-dark-light">
              {selected ? selected.label : "Select an option"}
            </span>
          </div>
          <FaChevronDown
            className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"
              }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
            {options.map((option) => (
              <div
                key={option.value}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-primary hover:text-white rounded-md transition-colors duration-150 ${value === option.value ? "bg-gray-100" : ""
                  }`}
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default DropdownInput;
