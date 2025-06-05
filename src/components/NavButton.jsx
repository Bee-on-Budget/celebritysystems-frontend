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
  const baseClasses = "flex items-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200";
  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary-hover focus:ring-primary-focus",
    sidebar: "space-x-2 text-white hover:text-primary py-2 px-0"
  };

  const sizeClasses = {
    sm: "px-3 py-1 text-sm h-8",
    md: "px-4 py-2 text-base h-10",
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