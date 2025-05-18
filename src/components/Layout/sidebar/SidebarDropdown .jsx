import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import NavButton from "../../NavButton";

const SidebarDropdown = ({ icon: Icon, label, items }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="w-full">
            {/* Toggle Button */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between space-x-2 text-white hover:text-primary font-medium py-2 transition duration-200"
            >
                <div className="flex items-center space-x-2">
                    <Icon />
                    <span>{label}</span>
                </div>
                {open ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {/* Animated Dropdown Items */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                {items.map((item, idx) => (
                    <NavButton
                        key={idx}
                        to={item.href}
                        label={item.label}
                        className="font-normal ml-6 py-1"
                    />
                ))}
            </div>
        </div>
    );
};

export default SidebarDropdown;
