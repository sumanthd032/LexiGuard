/**
 * @file Header.tsx
 * @description The main site header, showing the logo and handling user authentication display.
 */

import React, { Fragment } from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';
import { UserCircleIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';

import { useAuth } from '../AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

// The main header component for the application.
const Header: React.FC = () => {
  const { user } = useAuth();

  // A simple function to handle user sign-out with Firebase.
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo and Title - links back to the homepage */}
          <Link to="/" className="flex items-center space-x-2">
            <ShieldCheckIcon className="h-8 w-8 text-brand-green" />
            <h1 className="text-2xl font-bold text-brand-blue font-display">
              LexiGuard
            </h1>
          </Link>
          
          {/* User Authentication Section */}
          <div className="flex items-center">
            {user ? (
              // If the user is logged in, show a dropdown menu.
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="flex items-center rounded-full bg-gray-100 text-sm hover:ring-2 hover:ring-brand-green hover:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2">
                    <span className="sr-only">Open user menu</span>
                     <UserCircleIcon className="h-9 w-9 text-gray-500 p-1" />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-64 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1 ">
                       <div className="px-4 py-3">
                          <p className="text-sm text-gray-500">Signed in as</p>
                          <p className="truncate text-sm font-medium text-brand-blue">
                            {user.email}
                          </p>
                        </div>
                    </div>
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleSignOut}
                            className={`${
                              active ? 'bg-brand-green text-white' : 'text-gray-900'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            <ArrowLeftOnRectangleIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                            Sign Out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              // If the user is not logged in, show a simple "Sign In" button.
              <Link
                to="/auth"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-green hover:bg-opacity-90 shadow-sm transition-transform hover:-translate-y-0.5"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;