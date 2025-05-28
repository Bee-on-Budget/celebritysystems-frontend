import React, { useState } from 'react';

const FileInput = ({ name, label, value, onChange, error }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type="file"
          name={name}
          onChange={onChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <div className={`flex items-center justify-between px-3 py-2 border rounded-md shadow-sm bg-white ${isFocused
          ? "border-primary ring-1 ring-primary"
          : error ? "border-red-500" : "border-gray-300 hover:border-gray-400"
          }`}>
          <span className="text-sm text-gray-500 truncate">
            {value ? value.name : "Choose file"}
          </span>
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default FileInput;