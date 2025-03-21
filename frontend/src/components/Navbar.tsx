import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation(); // Get the current location

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to check if the link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-gray-100 p-2 shadow-md">
      <div className="flex justify-between items-center max-w-screen-2xl container mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link to="/HomePage" className="flex items-center space-x-2">
            <img src="/images/logoARoma.gif" alt="logo" className="w-12 h-12" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">AROMA</h1>
          </Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-700 hover:text-red-500 focus:outline-none"
          >
            {isMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav
          className={`${isMenuOpen ? "block" : "hidden"} lg:flex lg:items-center lg:space-x-6 text-lg font-semibold absolute lg:static top-16 left-0 w-full lg:w-auto bg-gray-100 lg:bg-transparent z-50 p-4 lg:p-0`}
        >
          <Link
            to="/HomePage"
            className={`block lg:inline-block hover:text-red-500 py-2 lg:py-0 ${
              isActive("/HomePage") ? "text-red-500" : ""
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/digital-menu"
            className={`block lg:inline-block hover:text-red-500 py-2 lg:py-0 ${
              isActive("/digital-menu") ? "text-red-500" : ""
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Menu
          </Link>
          <Link
            to="/restaurant-selection"
            className={`block lg:inline-block hover:text-red-500 py-2 lg:py-0 ${
              isActive("/restaurant-selection") ? "text-red-500" : ""
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Restaurants
          </Link>
          <Link
            to="/FAQ"
            className={`block lg:inline-block hover:text-red-500 py-2 lg:py-0 ${
              isActive("/FAQ") ? "text-red-500" : ""
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            FAQ
          </Link>
          <Link
            to="/feedback"
            className={`block lg:inline-block hover:text-red-500 py-2 lg:py-0 ${
              isActive("/feedback") ? "text-red-500" : ""
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Feedback
          </Link>
          <Link
            to="/foryou"
            className={`block lg:inline-block hover:text-red-500 py-2 lg:py-0 ${
              isActive("/foryou") ? "text-red-500" : ""
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            For you
          </Link>

          {/* Mobile Login Button */}
          <Link
            to="/signIn"
            className="block lg:hidden w-full text-center px-6 py-2 text-white bg-red-500 rounded-full text-lg font-semibold hover:bg-green-500 mt-4"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Link>

          {/* Mobile Profile Icon */}
          <Link
            to="/userProfilePage"
            className="block lg:hidden w-full text-center text-gray-700 hover:text-red-500 mt-4"
            onClick={() => setIsMenuOpen(false)}
          >
            <User className="h-6 w-6 inline-block" /> Profile
          </Link>
        </nav>

        {/* Desktop User Options */}
        <div className="hidden lg:flex items-center space-x-4">
          {/* Login Button */}
          <Link
            to="/signIn"
            className="px-6 py-2 text-white bg-red-500 rounded-full text-lg font-semibold hover:bg-green-500"
          >
            Login
          </Link>

          {/* Profile Icon */}
          <Link to="/userProfilePage" className="text-gray-700 hover:text-red-500">
            <User className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;