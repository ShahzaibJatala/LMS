import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-black text-gray-300 py-10 px-6 md:px-16 lg:px-24 rounded-2xl">
      <div className="w-full mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
        
        {/* Left Section */}
        <div>
          {/* Logo + Title */}
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-white text-black font-bold text-xl w-10 h-10 flex items-center justify-center rounded">
              VC
            </div>
            <h2 className="text-lg font-semibold text-white">Virtual Courses</h2>
          </div>
          {/* Description */}
          <p className="text-sm text-gray-400 max-w-xs">
            AI-powered learning platform to help you grow smarter. Learn
            anything, anytime, anywhere.
          </p>
        </div>

        {/* Right Section - Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/allcourses" className="hover:text-white transition">
                All Courses
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white transition">
                Login
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-white transition">
                My Profile
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
