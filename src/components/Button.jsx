import React from "react";

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
  loadingText = "Loading...", // optional loading text
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200";

  const sizeClasses = {
    sm: "px-3 py-1 text-sm h-8",
    md: "px-4 py-2 text-base h-10",
    lg: "px-5 py-3 text-lg h-12",
  };

  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary-hover focus:ring-primary-focus",
    danger: "bg-transparent text-red-700 hover:bg-gray-200 focus:ring-red-600",
    outline: "bg-transparent border border-dark-light text-dark hover:bg-gray-200 focus:ring-primary",
    ghost: "bg-transparent text-dark hover:bg-gray-200 font-semibold border-none focus:ring-primary",
    icon: "bg-transparent text-dark hover:bg-gray-200 font-normal border-none focus:ring-primary rounded-full w-10 h-10"
  };

  const roundedClasses = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

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
      ].join(" ").trim()}
      disabled={isLoading || isDisabled}
      aria-busy={isLoading ? "true" : undefined}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5 shrink-0"
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
          {loadingText && <span>{loadingText}</span>}
        </span>
      ) : (
        <span className="flex items-center gap-2">
          {icon && iconPosition === "left" && icon}
          {children}
          {icon && iconPosition === "right" && icon}
        </span>
      )}
    </button>
  );
};

export default Button;