// hooks/useFeatureInterceptor.ts
import { useEffect } from "react";
import { useLocation } from "wouter";

const PREMIUM_FEATURES = [
  "/live-alerts-india",
  "/live-alerts-us",
  "/alerts-india",
  "/alerts-us"
];

export function useFeatureInterceptor() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link) {
        const href = link.getAttribute('href');
        
        // Check if it's a premium feature link
        if (href && PREMIUM_FEATURES.some(path => href.startsWith(path))) {
          e.preventDefault();
          
          const isLoggedIn = !!localStorage.getItem("authToken");
          const hasPremium = localStorage.getItem("userPlan") === "premium";
          
          if (!isLoggedIn) {
            // Store what they were trying to access
            sessionStorage.setItem('redirectAfterLogin', href);
            sessionStorage.setItem('premiumFeatureAttempted', 'true');
            setLocation("/login");
          } else if (!hasPremium) {
            // User logged in but needs upgrade
            sessionStorage.setItem('redirectAfterLogin', href);
            setLocation("/upgrade");
          } else {
            // User has access, allow navigation
            setLocation(href);
          }
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [setLocation]);
}