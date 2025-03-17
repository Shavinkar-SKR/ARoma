import React from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <div className="bg-gray-100 mt-1">
      {/* Main Footer Section */}
      <footer className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-screen-2xl container mx-auto px-10 py-16 text-gray-700">
        {/* Learn More */}
        <nav className="text-center md:text-left md:ml-20">
          <h6 className="text-lg font-semibold mb-6">Learn More</h6>
          <a href="/privacy" className="block mb-6 hover:text-red-500 transition-transform transform hover:scale-110">Privacy Policy</a>
          <a href="/terms" className="block mb-6 hover:text-red-500 transition-transform transform hover:scale-110">Terms & Conditions</a>
          <a href="/security" className="block mb-6 hover:text-red-500 transition-transform transform hover:scale-110">Security</a>
        </nav>
        {/* Quick Links */}
        <nav className="text-center">
          <h6 className="text-lg font-semibold mb-6">Quick Links</h6>
          <a href="/about" className="block mb-6 hover:text-red-500 transition-transform transform hover:scale-110">About Us</a>
          <a href="/contact" className="block mb-6 hover:text-red-500 transition-transform transform hover:scale-110">Contact Us</a>
          <a href="/us" className="block mb-6 hover:text-red-500 transition-transform transform hover:scale-110">Who we are</a>
        </nav>
        {/* Social Media */}
        <nav className="text-center md:text-right md:mr-20">
          <h6 className="text-lg font-semibold mb-6 mr-16">Follow Us</h6>
          <div className="flex flex-row items-center justify-center space-x-6 -mr-14">
            <a href="https://facebook.com" className="hover:text-red-500 transition-transform transform hover:scale-125">
              <FaFacebook className="w-8 h-8" />
            </a>
            <a href="https://x.com/ARoma_2025" className="hover:text-red-500 transition-transform transform hover:scale-125">
              <FaTwitter className="w-8 h-8" />
            </a>
            <a href="https://www.instagram.com/aroma_offcial?igsh=YzljYTk1ODg3Zg== " className="hover:text-red-500 transition-transform transform hover:scale-125">
              <FaInstagram className="w-8 h-8" />
            </a>
          </div>
        </nav>
      </footer>
      {/* Bottom Copyright Section */}
      <hr className="border-gray-300" />
      <footer className="py-6 text-center text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} - All rights reserved by ARoma</p>
      </footer>
    </div>
  );
};

export default Footer;
