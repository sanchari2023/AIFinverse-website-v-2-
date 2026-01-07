import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useState } from "react";
import { api } from "@/services/api";
import { CheckCircle } from "lucide-react"; // Import an icon

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setShowWelcome(false);

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      console.log("🔄 Starting login process...");
      console.log("📧 Email:", email);
      
      // Login API call
      const response = await api.post("/login", {
        email,
        password,
      });

      const data = response.data;
      console.log("✅ Login API response:", data);
      console.log("📊 Response status:", response.status);

      // Success handling - UPDATED CONDITION
      // Check for 200 status AND the message indicates success
      if (response.status === 200 && data.message === "Login successful") {
        console.log("🔑 User ID received:", data.user_id);
        
        // Generate a token since API doesn't provide one
        const token = `token_${data.user_id}_${Date.now()}`;
        
        localStorage.setItem("authToken", token);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userId", data.user_id);
        
        // Store user name - extract from email or use from API if available
        let extractedUserName = email.split('@')[0]; // Get username from email
        
        // Check if API returns a name field and use it if available
        if (data.name) {
          extractedUserName = data.name;
        } else if (data.first_name) {
          extractedUserName = data.first_name;
          if (data.last_name) {
            extractedUserName += ` ${data.last_name}`;
          }
        }
        
        localStorage.setItem("userName", extractedUserName);
        setUserName(extractedUserName);
        
        console.log("📦 LocalStorage set:");
        console.log("  - userName:", localStorage.getItem("userName"));
        
        // Show welcome message
        setShowWelcome(true);
        setIsLoading(false);
        
        // Redirect to home after 2 seconds
        setTimeout(() => {
          console.log("🚀 Redirecting to /home...");
          setLocation("/home");
        }, 2000);
        
      } else {
        const errorMsg = data.message || "Login failed. Please check your credentials.";
        console.error("❌ Login failed:", errorMsg);
        setError(errorMsg);
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error("❌ Login error:", err);

      if (err.response) {
        console.error("📊 Server response:", err.response.status, err.response.data);
        
        // Handle specific error cases
        if (err.response.status === 401) {
          setError("Invalid email or password.");
        } else if (err.response.status === 422) {
          // Parse validation errors
          if (err.response.data.detail) {
            const validationErrors = err.response.data.detail.map((err: any) => 
              `${err.loc ? err.loc.join('.') : 'field'}: ${err.msg}`
            ).join(', ');
            setError(`Validation error: ${validationErrors}`);
          } else {
            setError("Invalid input. Please check your email and password.");
          }
        } else {
          setError(
            err.response.data?.message ||
            `Server error: ${err.response.status}`
          );
        }
      } else if (err.request) {
        console.error("🌐 Network error - no response received");
        setError("Network error. Please check your connection.");
      } else {
        console.error("⚙️ Request setup error:", err.message);
        setError("An unexpected error occurred. Please try again.");
      }
      setIsLoading(false);
    }
  };

  // Test function to check current state
  const testNavigation = () => {
    console.log("🧪 Testing navigation...");
    console.log("Current path:", window.location.pathname);
    console.log("Router location function:", setLocation);
    setLocation("/home");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Debug button (remove in production) */}
      <button 
        onClick={testNavigation}
        className="fixed top-4 right-4 z-50 bg-red-500 text-white px-3 py-1 rounded text-xs"
      >
        Test Nav
      </button>

      {/* ================= BACKGROUND ================= */}
      <div
        className="flex-1 flex items-center justify-center relative bg-cover bg-center"
        style={{ backgroundImage: "url('/images/login.png')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-slate-900/70 z-0" />

        {/* Logo */}
        <img
          src="/images/icon.png"
          alt="Logo"
          className="absolute top-6 left-6 w-50 h-50 object-contain z-20"
        />

        {/* ================= WELCOME MESSAGE ================= */}
        {showWelcome && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm">
            <div className="w-full max-w-md bg-transparent border border-cyan-500/40 rounded-2xl p-8 shadow-2xl">
              <div className="text-center">
                {/* Success Icon */}
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                
                {/* Welcome Message */}
                <h1 className="text-3xl font-bold text-white mb-3">
                  Welcome Back!
                </h1>
                
                <div className="mb-6">
                  <p className="text-xl text-cyan-300 font-medium">
                    Good to see you again,
                  </p>
                  <p className="text-2xl font-bold text-white mt-2">
                    {userName}!
                  </p>
                </div>
                
                {/* Redirecting Message */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-slate-300">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    <span className="ml-2">Redirecting to dashboard...</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-full rounded-full animate-progress"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= LOGIN CARD ================= */}
        <div className="w-full max-w-md z-30">
          <div className="bg-transparent border border-slate-500/40 rounded-xl p-6 sm:p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-300 text-sm">
                Sign in to your account
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold py-2 rounded-lg disabled:opacity-50"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Register */}
            <div className="mt-6 text-center text-sm text-gray-400">
              <p>
                Don&apos;t have an account?{" "}
                <span
                  onClick={() => setLocation("/register")}
                  className="text-cyan-400 hover:text-cyan-300 cursor-pointer font-medium"
                >
                  Sign up
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-900 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-3 text-center">
          <p className="text-sm text-slate-400">
            © 2025 All rights reserved to AIFinverse.{" | "}
            <a
              href="/privacy-policy"
              className="text-cyan-400 hover:text-cyan-300 hover:underline ml-1"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </footer>

      {/* Add animation styles */}
      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
        .animate-progress {
          animation: progress 2s ease-in-out;
        }
      `}</style>
    </div>
  );
}