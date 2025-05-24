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
  ...props
}) => {
  return (
    <div className="relative mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium capitalize text-dark">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 mt-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;