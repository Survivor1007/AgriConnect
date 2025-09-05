import { NavLink } from "react-router-dom";

const Navbar = () => {
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md transition-colors duration-200 ${
      isActive ? "bg-green-700 text-white font-semibold" : "hover:text-green-300"
    }`;

  return (
    <nav className="bg-[#0C4A1E] text-white px-6 py-4 flex justify-between items-center shadow-lg">
      {/* Left: App Name */}
      <div className="text-2xl font-extrabold tracking-wide">
        <NavLink to="/" className="hover:text-green-300">
          AgriConnect
        </NavLink>
      </div>

      {/* Right: Links */}
      <div className="flex gap-4 items-center">
        <NavLink to="/" className={linkClasses}>Home</NavLink>
        <NavLink to="/login" className={linkClasses}>Login</NavLink>
        <NavLink to="/signup" className={linkClasses}>Sign Up</NavLink>
        <NavLink to="/products" className={linkClasses}>Products</NavLink>
        <NavLink to="/orders" className={linkClasses}>Orders</NavLink>
        <NavLink to="/weather" className={linkClasses}>Weather</NavLink>
        <NavLink to="/updates" className={linkClasses}>Updates</NavLink>
        <NavLink to="/ask-ai" className={linkClasses}>Ask AI</NavLink>
        <NavLink to="/dashboard" className={linkClasses}>Dashboard</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
