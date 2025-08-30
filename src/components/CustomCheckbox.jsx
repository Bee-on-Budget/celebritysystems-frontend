import React, { forwardRef } from 'react';

const CustomCheckbox = forwardRef(({
  id,
  name,
  label,
  checked = false,
  onChange,
  disabled = false,
  className = '',
  labelClassName = '',
  size = 'md',
  ...props
}, ref) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const baseClasses = `
    appearance-none
    border-2
    border-gray-300
    rounded
    cursor-pointer
    transition-all
    duration-200
    ease-in-out
    focus:outline-none
    focus:ring-2
    focus:ring-offset-2
    focus:ring-primary
    disabled:opacity-50
    disabled:cursor-not-allowed
    relative
    after:content-['']
    after:absolute
    after:inset-0
    after:bg-no-repeat
    after:bg-center
    after:bg-[length:70%]
    after:opacity-0
    after:transition-opacity
    after:duration-200
    checked:after:opacity-100
    checked:border-primary
    checked:bg-primary
    after:bg-[url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")]
  `;

  const hoverClasses = !disabled && `
    hover:border-primary-hover
    checked:hover:bg-primary-hover
    checked:hover:border-primary-hover
  `;

  return (
    <div className={`flex items-center ${className}`}>
      <input
        ref={ref}
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`
          ${baseClasses}
          ${sizes[size]}
          ${hoverClasses}
        `}
        {...props}
      />
      {label && (
        <label
          htmlFor={id}
          className={`
            ml-3
            text-dark
            cursor-pointer
            select-none
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${labelClassName}
          `}
        >
          {label}
        </label>
      )}
    </div>
  );
});

CustomCheckbox.displayName = 'Checkbox';

export default CustomCheckbox;