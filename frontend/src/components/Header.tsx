import React from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Header: React.FC = () => {
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
            {user ? (
              <div className="flex items-center space-x-4">
                <p className="text-sm text-brand-text hidden sm:block">
                  Welcome, <span className="font-semibold">{user.email}</span>
                </p>
                <button 
                  onClick={handleSignOut} 
                  className="bg-white hover:bg-gray-100 text-brand-text font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button className="bg-white hover:bg-gray-100 text-brand-text font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm">
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;