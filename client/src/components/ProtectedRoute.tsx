import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-code text-text-secondary">Authenticating Session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface p-4">
        <div className="max-w-md w-full bg-surface-base border border-border-subtle rounded-xl p-6 text-center shadow-md">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Access Restricted</h2>
          <p className="text-xs text-text-secondary mb-4">
            Your current role (<span className="font-code uppercase font-semibold">{user.role}</span>) does not have permission to view this section.
          </p>
          <Navigate to="/courses" replace />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
