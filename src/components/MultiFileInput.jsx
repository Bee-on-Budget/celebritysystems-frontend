import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const MultiFileInput = ({ name, label, value = [], onChange, error }) => {
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList → Array
    onChange(files);
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium capitalize text-dark">
        {label} <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        {/* File Input */}
        <input
          type="file"
          name={name}
          multiple
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required
        />

        {/* Styled box */}
        <div
          className={`flex items-center justify-between px-3 py-2 border rounded-md shadow-sm bg-white ${
            isFocused
              ? "border-primary ring-1 ring-primary"
              : error
              ? "border-red-500"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <span className="text-sm text-gray-500 truncate">
            {value && value.length > 0
              ? value.map((file) => file.name).join(", ")
              : t("common.chooseFiles")}
          </span>

          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>

      {/* Preview file list */}
      {value && value.length > 0 && (
        <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
          {value.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultiFileInput;
