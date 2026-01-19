// hooks/usePremiumInterceptor.ts
import { useEffect } from "react";
import { useLocation } from "wouter";

const PREMIUM_PATHS = [
  '/live-alerts-us',
  '/live-alerts-india',
  '/alerts-us',
  '/alerts-india'
];

export function usePremiumInterceptor() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if it's a link or button
      const link = target.closest('a') || target.closest('button');
      if (!link) return;
      
      // Get the intended destination
      let destination = '';
      
      if (link.tagName === 'A') {
        destination = (link as HTMLAnchorElement).getAttribute('href') || '';
      } else if (link.tagName === 'BUTTON') {
        // Check data attributes or text content
        const dataHref = link.getAttribute('data-href');
        if (dataHref) destination = dataHref;
        
        // Also check if button text suggests it's a premium feature
        const text = link.textContent?.toLowerCase() || '';
        if (text.includes('live alerts') || text.includes('premium')) {
          const market = text.includes('us') ? 'us' : 'india';
          destination = `/live-alerts-${market}`;
        }
      }
      
      // Check if it's a premium path
      const isPremiumPath = PREMIUM_PATHS.some(path => 
        destination.includes(path)
      );
      
      if (isPremiumPath) {
        e.preventDefault();
        e.stopPropagation();
        
        const isLoggedIn = !!localStorage.getItem("authToken");
        const hasPremium = localStorage.getItem("userPlan") === "premium";
        
        if (!isLoggedIn) {
          sessionStorage.setItem('redirectAfterLogin', destination);
          sessionStorage.setItem('premiumFeatureAttempted', 'true');
          setLocation("/login");
        } else if (!hasPremium) {
          sessionStorage.setItem('redirectAfterLogin', destination);
          setLocation("/upgrade");
        } else {
          setLocation(destination);
        }
      }
    };

    document.addEventListener('click', handleClick, true); // Use capture phase
    
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [setLocation]);
}