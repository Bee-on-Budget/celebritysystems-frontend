const Input = ({ label, id, className = "", trainling=null,...props }) => {
  return (
    <div className="relative">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium capitalize text-gray-500">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-4 py-2 mt-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
        {...props}
      />
      {trainling}
    </div>
  );
};

export default Input;
