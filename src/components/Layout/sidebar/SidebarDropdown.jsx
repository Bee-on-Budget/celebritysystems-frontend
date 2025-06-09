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
      setDropdownHeight(buttonHeight - 12 + (isOpen ? dropdownContentHeight : 0));
    }
  }, [isOpen]);

  return (
    <div className="relative w-full">
      {/* Vertical line */}
      {isOpen && (
        <div
          className="absolute -left-4 -top-4 w-1 bg-primary transition-all duration-300 rounded-full"
          style={{
            top: 0,
            height: `${dropdownHeight}px`,
          }}
        />
      )}

      {/* Toggle Button */}
      <button
        ref={buttonRef}
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2 pl-1 pr-2 rounded-md text-white hover:text-primary font-medium focus:outline-none focus:ring-primary-focus focus:ring-1 transition duration-200"
      >
        <div className="flex items-center space-x-2">
          <Icon />
          <span>{label}</span>
        </div>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {/* Dropdown Items */}
      <div
        ref={dropdownRef}
        className={`overflow-hidden transition-all duration-300 pr-2 pl-5 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        {items.map((item, idx) => {
          if(item.hideNavButton) return (<></>);
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