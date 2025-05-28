import React from "react";

const Input = ({
  label,
  id,
  required,
  className = "",
  error,
  value = "",
  onChange,
  type = "text",
  disabled = false,
  ...props
}) => {
  return (
    <div className="relative">
      {label && (
        <label 
          htmlFor={id} 
          className={`block text-sm font-medium capitalize ${
            disabled ? "text-gray-400" : "text-dark"
          }`}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-2 mt-2 border rounded focus:outline-none focus:ring-2 ${
          disabled 
            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" 
            : error 
              ? "border-red-500 focus:ring-red-200" 
              : "border-gray-300 focus:ring-primary"
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;