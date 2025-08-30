import React, { useRef, useLayoutEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import NavButton from "../../NavButton";

const SidebarDropdown = ({ icon: Icon, label, items, isOpen, onToggle }) => {
  const dropdownRef = useRef(null);
  const [dropdownHeight, setDropdownHeight] = useState(0);
  const buttonRef = useRef(null);

  useLayoutEffect(() => {
    if (dropdownRef.current && buttonRef.current) {
      const dropdownContentHeight = dropdownRef.current.scrollHeight;
      const buttonHeight = buttonRef.current.offsetHeight;
      setDropdownHeight(
        buttonHeight - 12 + (isOpen ? dropdownContentHeight : 0)
      );
    }
  }, [isOpen]);

  return (
    <div className="relative w-full">
      {/* Vertical line */}
      {isOpen && (
        <div
          className="absolute ltr:-left-4 rtl:-right-4 top-0 w-1 bg-primary transition-all duration-300 rounded-full"
          style={{
            height: `${dropdownHeight}px`,
          }}
        />
      )}

      {/* Toggle Button */}
      <button
        ref={buttonRef}
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2 px-2 rounded-md text-white hover:text-primary font-medium focus:outline-none focus:ring-primary-focus focus:ring-1 transition duration-200"
      >
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Icon />
          <span>{label}</span>
        </div>
        {/* Chevron flips based on direction */}
        <div className="rtl:rotate-180 transition-transform">
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </button>

      {/* Dropdown Items */}
      <div
        ref={dropdownRef}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } ltr:pl-5 ltr:pr-2 rtl:pr-5 rtl:pl-2`}
      >
        {items.map((item, idx) => {
          if (item.hideNavButton) return null;
          return (
            <NavButton
              key={idx}
              to={item.href}
              label={item.label}
              onClick={item.onClick}
              className="font-normal py-1 m-1"
            />
          );
        })}
      </div>
    </div>
  );
};

export default SidebarDropdown;
