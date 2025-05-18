import { NavLink } from 'react-router-dom';

const NavButton = ({ to, icon, label, className }) => {
    return (
        <NavLink 
            to={to} 
            className={`flex items-center space-x-2 text-white hover:text-primary font-medium py-2 ${className}`}
        >
            {icon}
            <span>{label}</span>
        </NavLink>
    );
};
export default NavButton;