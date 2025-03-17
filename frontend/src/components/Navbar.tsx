import React from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

const Navbar: React.FC = () => {
  return (
    <header className="bg-gray-100 p-2 shadow-md">
      <div className="flex justify-between items-center max-w-screen-2xl container mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/images/logoARoma.gif" alt="logo" className="w-12 h-12" />
            <h1 className="text-4xl font-bold">AROMA</h1>
          </Link>
        </div>
        
        {/* Navigation Links */}
        <nav className="hidden lg:flex space-x-6 text-lg font-semibold">
          <Link to="/" className="hover:text-red-500">Home</Link>
          <Link to="/add-restaurant" className="hover:text-red-500">Add Restaurant</Link>
          <Link to="/menu" className="hover:text-red-500">Menu</Link>
          <Link to="/restaurants" className="hover:text-red-500">Restaurants</Link>
          <Link to="/service" className="hover:text-red-500">Service Requests</Link>
        </nav>
        
        {/* User Options */}
        <div className="flex items-center space-x-4">
          {/* Login Button */}
          <Link to="/login" className="px-6 py-2 text-white bg-red-500 rounded-full text-lg font-semibold hover:bg-green-500">Login</Link>
          
          {/* Profile Icon */}
          <Link to="/userprofile" className="text-gray-700 hover:text-red-500">
            <User className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
