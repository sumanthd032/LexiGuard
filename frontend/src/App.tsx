/**
 * @file App.tsx
 * @description The root component of the application. It sets up the main router
 * and handles protected routes based on the user's authentication state.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { useAuth } from './AuthContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';

/**
 * The main App component that orchestrates the entire application's routing.
 */
const App: React.FC = () => {
    // useAuth hook provides the current user and the initial auth loading state.
    const { user, loading } = useAuth();

    // Display a simple loading indicator while Firebase checks the auth state.
    // This prevents a flicker between public and private routes on page load.
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                
                {/* The landing page is the default route for unauthenticated users.
                    If a logged-in user tries to access it, they are redirected to their dashboard. */}
                <Route 
                    path="/" 
                    element={!user ? <LandingPage /> : <Navigate to="/dashboard" />} 
                />

                {/* The authentication page is for signing in or up.
                    Logged-in users are redirected away from it. */}
                <Route 
                    path="/auth" 
                    element={!user ? <AuthPage /> : <Navigate to="/dashboard" />} 
                />
                
                {/* Protected Route */}

                {/* The dashboard is only accessible to authenticated users.
                    If an unauthenticated user tries to access it, they are redirected to the auth page. */}
                <Route 
                    path="/dashboard" 
                    element={user ? <Dashboard /> : <Navigate to="/auth" />} 
                />
            </Routes>
        </Router>
    );
};

export default App;