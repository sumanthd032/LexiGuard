/**
 * @file AuthContext.tsx
 * @description This file sets up a React Context to provide global access
 * to the current user's authentication state throughout the application.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from './firebase';

/**
 * @interface AuthContextType
 * @description Defines the shape of the data stored in our authentication context.
 */
interface AuthContextType {
  user: User | null; // The Firebase user object if logged in, otherwise null.
  loading: boolean;  // True while the initial authentication check is running.
}

// Create the context with a default value.
const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

/**
 * The AuthProvider component is a wrapper that provides the authentication context
 * to all of its children. It handles listening for changes in the user's auth state.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered.
 */
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // This effect hook sets up the Firebase auth state listener when the component mounts.
  useEffect(() => {
    // onAuthStateChanged returns an unsubscribe function that we can use for cleanup.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // This callback fires whenever the user's sign-in state changes.
      setUser(currentUser);
      setLoading(false); // The initial check is complete.
    });

    // Cleanup: Unsubscribe from the listener when the component unmounts to prevent memory leaks.
    return () => unsubscribe();
  }, []); // The empty dependency array ensures this effect runs only once.

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {/* We only render the children once the initial loading is false.
          This prevents a "flicker" effect where protected routes might
          briefly show a public page before the user is confirmed. */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

/**
 * A custom hook that provides a convenient way for components to access
 * the authentication context (user and loading state).
 * @returns {AuthContextType} The current authentication context.
 */
export const useAuth = () => useContext(AuthContext);