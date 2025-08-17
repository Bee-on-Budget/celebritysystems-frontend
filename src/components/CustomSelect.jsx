import Select, { components } from "react-select";
import { FaChevronDown } from "react-icons/fa";

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <FaChevronDown
        className="text-gray-400 transition-transform duration-200"
        style={{
          transform: props.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)'
        }}
      />
    </components.DropdownIndicator>
  );
};

const CustomSelect = ({
  name,
  required,
  label,
  options,
  value,
  onChange,
  error,
  placeholder,
}) => {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      padding: "2px 4px",
      color: '#2B3237',
      borderRadius: '0.375rem',
      borderColor: error 
        ? '#ef4444' 
        : state.isFocused 
          ? "#E83D29" 
          : "#D1D5DB",
      boxShadow: error 
        ? '0 0 0 1px #ef4444' 
        : state.isFocused 
          ? '0 0 0 1px #E83D29' 
          : '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      "&:hover": {
        borderColor: error ? '#ef4444' : state.isFocused ? "#E83D29" : "#D1D5DB"
      },
      cursor: "pointer",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: error ? '#ef4444' : '#2B3237',
      padding: "0",
      margin: "0",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? "#f3f4f6" 
        : state.isFocused 
          ? "#E83D29" 
          : provided.backgroundColor,
      color: state.isSelected 
        ? "#000"
        : state.isFocused 
          ? "#fff"
          : provided.color,
      borderRadius: '0.375rem',
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      "&:hover": {
        backgroundColor: "#E83D29",
        color: "#fff",
      },
      "&:active": {
        backgroundColor: "#E83D29",
        color: "#fff",
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '0.375rem',
      border: '1px solid #d1d5db',
      boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      marginTop: '0.25rem',
      zIndex: 10,
    }),
    menuList: (provided) => ({
      ...provided,
      padding: 0,
      borderRadius: '0.375rem',
      borderColor: "#d1d5db",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: error ? '#ef4444' : "#717274FF",
    }),
  };

  return (
    <div className="relative mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-dark">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="mt-2">
        <Select
          id={name}
          name={name}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${name}-error` : undefined}
          components={{ DropdownIndicator }}
          options={options}
          value={value}
          onChange={onChange}
          styles={customStyles}
          isClearable
          placeholder={placeholder}
          classNamePrefix="react-select"
        />
      </div>
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default CustomSelect;