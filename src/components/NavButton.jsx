import { NavLink } from 'react-router-dom';

const NavButton = ({
  to,
  icon,
  label,
  className,
  onClick,
  size = "md",
  variant = "sidebar",
  fullWidth = true,
  rounded = "md", // 'sm', 'md', 'lg', 'full'
}) => {
  const baseClasses = "flex items-center font-medium focus:outline-none focus:ring-primary-focus focus:ring-1 transition duration-200";
  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary-hover",
    sidebar: "space-x-2 text-white hover:text-primary pl-1"
  };

  const sizeClasses = {
    sm: "px-3 py-1 text-sm h-8",
    md: "px-4 py-2",
    lg: "px-5 py-3 text-lg h-12",
  };

  const roundedClasses = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={[
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        roundedClasses[rounded],
        fullWidth ? "w-full" : "",
        className
      ].join(" ").trim()}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};
export default NavButton;