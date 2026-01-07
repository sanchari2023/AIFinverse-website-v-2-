import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

/**
 * Navbar Component
 * Design: Dark Fintech Minimalism
 * Layout: Logo (Left) | Menu (Center) | Profile + Logout (Right)
 */

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/home" },
    { label: "Live Alerts India", path: "/live-alerts-india" },
    { label: "Live Alerts US", path: "/live-alerts-us" },
    { label: "Market Insights", path: "/newsletter" },
    { label: "Contact us", path: "/contact" },
    { label: "About us", path: "/about" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    setLocation("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto pl-2 pr-4 sm:pl-4 sm:pr-6 lg:pl-6 lg:pr-8">
        <div className="flex items-center h-16">

          {/* LEFT: Logo + Beta */}
          <div className="flex items-center space-x-2">
            <img
              src="/images/icon.png"
              alt="Aifinverse Logo"
              className="h-40 w-40 object-contain cursor-pointer"
              onClick={() => setLocation("/home")}
            />

            {/* Beta Badge */}
            <div className="relative">
              <span className="px-2 py-1 text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-md shadow-lg">
                BETA
              </span>
              <div className="absolute inset-0 bg-cyan-500/20 blur-sm rounded-md -z-10"></div>
            </div>
          </div>

          {/* CENTER: Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => setLocation(item.path)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  location === item.path
                    ? "bg-cyan-500/20 text-cyan-400 border-b-2 border-cyan-500"
                    : "text-gray-300 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* RIGHT: Profile + Logout (Desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => setLocation("/profile")}>
              <img
                src="/images/profile.png"
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover cursor-pointer"
              />
            </button>

            <Button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-2 rounded-lg"
            >
              Logout
            </Button>
          </div>

          {/* MOBILE: Hamburger */}
          <div className="md:hidden ml-auto">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-slate-800/50"
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-900/95 backdrop-blur-md z-50 border-b border-slate-700/50 shadow-xl">
          <div className="flex flex-col p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  setLocation(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-3 rounded-md text-base font-medium text-left transition-all ${
                  location === item.path
                    ? "bg-cyan-500/20 text-cyan-400 border-l-4 border-cyan-500"
                    : "text-gray-300 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                {item.label}
              </button>
            ))}

            <Button
              onClick={handleLogout}
              className="mt-3 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg"
            >
              Logout
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
