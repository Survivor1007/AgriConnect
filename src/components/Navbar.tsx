import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-[#0C4A1E] text-white px-6 py-4 flex justify-between items-center shadow-lg">
      {/* Left: App Name */}
      <div className="text-2xl font-extrabold tracking-wide">
        <Link to="/">
            AgriConnect
        </Link>
      </div>

      {/* Right: Production-Level Desktop Links */}
      <div className="flex gap-4 items-center">
        <Link to="/" className="hover:text-green-300 transition-colors duration-200 px-3 py-2 rounded-md">Home</Link>
        <Link to="/login" className="hover:text-green-300 transition-colors duration-200 px-3 py-2 rounded-md">Login</Link>
        <Link to="/signup" className="hover:text-green-300 transition-colors duration-200 px-3 py-2 rounded-md">Sign Up</Link>
        <Link to="/orders" className="hover:text-green-300 transition-colors duration-200 px-3 py-2 rounded-md">Orders</Link>
        <Link to="/products" className="hover:text-green-300 transition-colors duration-200 px-3 py-2 rounded-md">Products</Link>
        <Link to="/weather" className="hover:text-green-300 transition-colors duration-200 px-3 py-2 rounded-md">Weather</Link>
        <Link to="/updates" className="hover:text-green-300 transition-colors duration-200 px-3 py-2 rounded-md">Updates</Link>
        <Link to="/ask-ai" className="hover:text-green-300 transition-colors duration-200 px-3 py-2 rounded-md">Ask AI</Link>
        <Link to="/dashboard" className="hover:text-green-300 transition-colors duration-200 px-3 py-2 rounded-md">Dashboard</Link>
      </div>
    </nav>
  );
};

export default Navbar;

