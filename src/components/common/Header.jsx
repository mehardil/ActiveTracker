import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/reports', label: 'Reports' },
    { path: '/team', label: 'Team' },
  ];

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          
          {/* Logo + Brand */}
          <div className="flex items-center space-x-3">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-10 w-10 rounded-full shadow-md object-cover"
            />
            <span className="text-2xl font-bold text-blue-700 tracking-wide">
              ActiveATracker
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User Profile Section */}
          <div className="flex items-center space-x-3">
            <img
              src="/user.png"
              alt="User avatar"
              className="h-9 w-9 rounded-full border border-gray-300 shadow-sm object-cover"
            />
            <span className="text-sm font-semibold text-gray-800">
              Mehar Dil
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
