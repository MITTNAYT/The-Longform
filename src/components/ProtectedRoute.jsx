import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuthInitialized, selectIsAuthenticated, selectProfile } from '../store/authSlice';

const ProtectedRoute = ({ children, requireOnboarding = true }) => {
  const isInitialized = useSelector(selectAuthInitialized);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const profile = useSelector(selectProfile);
  const location = useLocation();

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#F9F7F1] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-4 border-stone-800 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-lato text-stone-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login but save the attempted URL
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If user is authenticated but hasn't completed onboarding (e.g. no username set)
  // and they aren't currently on the onboarding page
  if (requireOnboarding && profile && !profile.username && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

export default ProtectedRoute;
