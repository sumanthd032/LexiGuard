import React from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';

const Header: React.FC = () => {
  return (
    <header className="bg-brand-gray border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-8 w-8 text-brand-green" />
            <h1 className="ml-2 text-2xl font-bold text-brand-blue font-display">
              LexiGuard
            </h1>
          </div>
          <div className="flex items-center">
            {/* Placeholder for future Login/User Profile button */}
            <button className="bg-white hover:bg-gray-100 text-brand-text font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;