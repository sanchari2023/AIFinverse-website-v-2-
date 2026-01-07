import { useLocation } from "wouter";
import { useEffect, useState } from "react";

/**
 * ProtectedRoute Component
 * 
 * Protects internal pages from unauthorized access.
 * - Checks if user is logged in (stored in localStorage)
 * - If not logged in, redirects to landing page
 * - If logged in, renders the requested component
 */

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
}

export default function ProtectedRoute({ component: Component }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in by looking for auth token in localStorage
    const authToken = localStorage.getItem("authToken");
    
    if (!authToken) {
      // No auth token found, redirect to landing page
      setLocation("/");
    } else {
      // User is authenticated
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, [setLocation]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, render the component
  if (isAuthenticated) {
    return <Component />;
  }

  // Fallback (should not reach here due to redirect)
  return null;
}
