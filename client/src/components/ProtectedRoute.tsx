// components/ProtectedRoute.tsx
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  requireAuth?: boolean;
  requiredPlan?: string;
}

export default function ProtectedRoute({ 
  component: Component, 
  requireAuth = false,
  requiredPlan = null 
}: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // If no auth required, proceed immediately
        if (!requireAuth) {
          setIsLoading(false);
          return;
        }
        
        // Check for auth token (using your preferred method)
        const authToken = localStorage.getItem("authToken");
        const regComplete = localStorage.getItem("registrationComplete");
        
        // Check if user has completed registration
        if (!authToken || regComplete !== "true") {
          console.log("⚠️ Auth check failed:", { 
            hasToken: !!authToken, 
            regComplete 
          });
          
          // Store attempted URL for redirect after login/registration
          sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
          
          // Redirect based on what's missing
          if (!authToken) {
            setLocation("/login");
          } else if (regComplete !== "true") {
            // User has token but didn't complete registration
            console.log("User has token but registration incomplete, redirecting to registration");
            setLocation("/register");
          }
          return;
        }
        
        // Check if specific plan is required (for premium features)
        if (requiredPlan === "premium") {
          const userPlan = localStorage.getItem("userPlan");
          
          // If user doesn't have premium but is logged in, grant it automatically
          if (userPlan !== "premium") {
            console.log("🔓 Auto-granting premium access to logged-in user");
            localStorage.setItem("userPlan", "premium");
          }
        }
        
        // All checks passed
        setIsLoading(false);
        
      } catch (error) {
        console.error("Auth check error:", error);
        setLocation("/login");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAccess();
  }, [setLocation, requireAuth, requiredPlan]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 animate-spin rounded-full border-t-4 border-b-4 border-cyan-500"></div>
              <div className="absolute inset-2 animate-spin rounded-full border-t-4 border-b-4 border-emerald-500 animation-delay-200"></div>
              <div className="absolute inset-4 animate-spin rounded-full border-t-4 border-b-4 border-blue-500 animation-delay-400"></div>
            </div>
            <p className="text-white text-lg font-medium">Securing your session...</p>
            <p className="text-slate-400 text-sm mt-2">Checking authentication status</p>
          </div>
        </div>
      </div>
    );
  }

  return <Component />;
}