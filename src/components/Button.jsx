// src/components/Button.jsx
import React from "react";
// import clsx from "clsx";

const Button = ({
  children,
  icon,
  iconPosition = "left", // or 'right'
  className = "",
  variant = "primary",
  size = "md",
  isLoading = false,
  isDisabled = false,
  fullWidth = false,
  rounded = "md", // 'sm', 'md', 'lg', 'full'
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all transition-colors duration-200";

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary-hover focus:ring-primary-focus",
    danger: "bg-transparent text-red-700 hover:bg-gray-200 focus:ring-red-600",
    outline: "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-200 focus:ring-gray",
    ghost: "bg-transparent text-dark hover:bg-gray-200 font-normal border-none focus:ring-dark-light",
    icon: "bg-transparent text-dark hover:bg-gray-200 font-normal border-none focus:ring-dark-light rounded-full w-10 h-10"
  };

  const roundedClasses = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  const content = isLoading ? (
    <span className="flex items-center gap-2">
      <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      Loading...
    </span>
  ) : (
    <span className="flex items-center gap-2">
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </span>
  );

  return (
    <button
      className={[
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        roundedClasses[rounded],
        fullWidth ? "w-full" : "",
        (isLoading || isDisabled) ? "opacity-70 cursor-not-allowed" : "",
        className
      ].join(" ")}
      disabled={isLoading || isDisabled}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;
