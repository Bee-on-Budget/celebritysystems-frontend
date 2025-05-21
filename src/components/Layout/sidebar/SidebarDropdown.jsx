import React, { useState, useRef, useLayoutEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import NavButton from "../../NavButton";

const SidebarDropdown = ({ icon: Icon, label, items }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [dropdownHeight, setDropdownHeight] = useState(0);
  const buttonRef = useRef(null);

  useLayoutEffect(() => {
    if (dropdownRef.current && buttonRef.current) {
      const dropdownContentHeight = dropdownRef.current.scrollHeight;
      const buttonHeight = buttonRef.current.offsetHeight;
      setDropdownHeight(buttonHeight - 24 + (open ? dropdownContentHeight : 0));
    }
  }, [open]);

  return (
    <div className="relative w-full">
      {/* Vertical line */}
      {open && (
        <div
          className="absolute -left-6 top-3 w-1 bg-primary transition-all duration-300"
          style={{
            top: 0,
            height: `${dropdownHeight}px`,
          }}
        />
      )}

      {/* Toggle Button */}
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-white hover:text-primary font-medium py-2 pr-2 transition duration-200"
      >
        <div className="flex items-center space-x-2">
          <Icon />
          <span>{label}</span>
        </div>
        {open ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {/* Dropdown Items */}
      <div
        ref={dropdownRef}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {items.map((item, idx) => (
          <NavButton
            key={idx}
            to={item.href}
            label={item.label}
            className="font-normal pl-6 py-1"
          />
        ))}
      </div>
    </div>
  );
};

export default SidebarDropdown;
