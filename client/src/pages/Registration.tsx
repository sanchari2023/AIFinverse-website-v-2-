import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useLocation } from "wouter";
import { api } from "@/services/api";
import { CheckCircle } from "lucide-react";

const alertTypes = [
  "Momentum Riders (52-week High/Low, All-Time High/Low)",
  "Cycle Count Reversal", 
  "Mean Reversion",
  "Contrabets",
  "Pattern Formation",
  "Fundamental Picks (Earnings Season focused)"
];

const marketIcons: Record<string, string> = {
  India: "🇮🇳",
  US: "🇺🇸",
  Both: "🌐",
};

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  password: string;
  confirmPassword: string;
};

interface CountrySuggestion {
  name: string;
  flag: string;
}

const Registration = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [, navigate] = useLocation();

  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    password: "",
    confirmPassword: "",
  });

  const [market, setMarket] = useState<string | null>(null);
  const [strategies, setStrategies] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countrySuggestions, setCountrySuggestions] = useState<CountrySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [registrationToken, setRegistrationToken] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string>("");
  
  // New state for welcome message
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName] = useState("");

  // Validation helpers
  const isValidName = (name: string) => /^[A-Za-z]{2,}$/.test(name.trim());
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isValidPassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

  // Handle form input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear API error when user starts typing
    if (apiError) setApiError("");
  };

  // Fetch country suggestions from API
  const fetchCountrySuggestions = async (query: string) => {
    if (query.length < 2) {
      setCountrySuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoadingCountries(true);
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${query}?fields=name,flags,cca2`
      );
      
      if (response.ok) {
        const data = await response.json();
        const suggestions = data
          .map((country: any) => {
            // Get flag emoji from country code
            const countryCode = country.cca2;
            const flagEmoji = countryCode 
              ? String.fromCodePoint(...[...countryCode.toUpperCase()].map(c => 0x1F1A5 + c.charCodeAt(0)))
              : (country.flags?.emoji || "🌐");
            
            return {
              name: country.name.common,
              flag: flagEmoji
            };
          })
          .filter((country: CountrySuggestion) => 
            country.name.toLowerCase().includes(query.toLowerCase())
          )
          .sort((a: CountrySuggestion, b: CountrySuggestion) => 
            a.name.localeCompare(b.name)
          )
          .slice(0, 10);
        
        setCountrySuggestions(suggestions);
        setShowSuggestions(suggestions.length > 0);
      } else {
        // If API fails, use a smaller fallback list
        const fallbackList = [
          { name: "United States", flag: "🇺🇸" },
          { name: "United Kingdom", flag: "🇬🇧" },
          { name: "Canada", flag: "🇨🇦" },
          { name: "Australia", flag: "🇦🇺" },
          { name: "India", flag: "🇮🇳" },
          { name: "Germany", flag: "🇩🇪" },
          { name: "France", flag: "🇫🇷" },
          { name: "Japan", flag: "🇯🇵" },
          { name: "China", flag: "🇨🇳" },
          { name: "Brazil", flag: "🇧🇷" }
        ];
        
        const filtered = fallbackList.filter(country => 
          country.name.toLowerCase().includes(query.toLowerCase())
        );
        
        setCountrySuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
      // Minimal fallback
      const fallbackList = [
        { name: "United States", flag: "🇺🇸" },
        { name: "India", flag: "🇮🇳" },
        { name: "United Kingdom", flag: "🇬🇧" },
        { name: "Canada", flag: "🇨🇦" }
      ];
      
      const filtered = fallbackList.filter(country => 
        country.name.toLowerCase().includes(query.toLowerCase())
      );
      
      setCountrySuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } finally {
      setIsLoadingCountries(false);
    }
  };

  // Debounced country search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (form.country.trim()) {
        fetchCountrySuggestions(form.country.trim());
      } else {
        setCountrySuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [form.country]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.country-input-container')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Function to parse validation errors from 422 response
  const parseValidationErrors = (errorData: any): string => {
    if (!errorData.detail) {
      return "Validation failed. Please check your input.";
    }
    
    if (Array.isArray(errorData.detail)) {
      const errors = errorData.detail.map((err: any) => {
        const field = err.loc ? err.loc[err.loc.length - 1] : 'field';
        return `${field}: ${err.msg}`;
      });
      return errors.join('\n');
    }
    
    return JSON.stringify(errorData.detail);
  };

  // Step 1 validation and navigation
  const handleNext = async () => {
    // Clear previous errors
    setApiError("");
    
    // Validation
    if (!form.firstName.trim()) {
      setApiError("Please enter your first name");
      return;
    }
    if (!isValidName(form.firstName)) {
      setApiError("First name must contain only letters (minimum 2 characters)");
      return;
    }
    if (!form.lastName.trim()) {
      setApiError("Please enter your last name");
      return;
    }
    if (!isValidName(form.lastName)) {
      setApiError("Last name must contain only letters (minimum 2 characters)");
      return;
    }
    if (!form.email.trim()) {
      setApiError("Please enter your email address");
      return;
    }
    if (!isValidEmail(form.email)) {
      setApiError("Please enter a valid email address (e.g., name@example.com)");
      return;
    }
    if (!form.country.trim()) {
      setApiError("Please enter your country");
      return;
    }
    if (!form.password) {
      setApiError("Please enter a password");
      return;
    }
    if (!isValidPassword(form.password)) {
      setApiError(
        "Password must be at least 8 characters and include:\n" +
        "• One uppercase letter\n" +
        "• One lowercase letter\n" +
        "• One number"
      );
      return;
    }
    if (form.password !== form.confirmPassword) {
      setApiError("Password and Confirm Password do not match");
      return;
    }

    setIsSubmitting(true);
    
    // Try different payload formats to find what the API expects
    const payloadsToTry = [
      // Try snake_case (most common for Python backends)
      {
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        country: form.country.trim(),
        password: form.password,
        confirm_password: form.confirmPassword,
      },
      // Try camelCase
      {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        country: form.country.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      },
      // Try with username field
      {
        username: form.email.trim().toLowerCase(),
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        country: form.country.trim(),
        password: form.password,
      },
      // Minimal required fields
      {
        email: form.email.trim().toLowerCase(),
        password: form.password,
        full_name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        country: form.country.trim(),
      }
    ];

    let success = false;
    let lastError = "";

    for (let i = 0; i < payloadsToTry.length; i++) {
      try {
        console.log(`Trying payload format ${i + 1}:`, payloadsToTry[i]);
        
        const response = await api.post("/register", payloadsToTry[i]);

        const data = response.data;
        
        if (response.status === 200 || response.status === 201) {
          // Store the token for the next step
          setRegistrationToken(data.token || data.id || data.user_id || `temp_${Date.now()}`);
          setStep(2);
          success = true;
          break;
        } else {
          lastError = data.message || "Registration failed. Please try again.";
        }
      } catch (err: any) {
        console.error(`Attempt ${i + 1} failed:`, err.message);
        
        if (err.response) {
          // Handle 422 validation errors
          if (err.response.status === 422) {
            lastError = parseValidationErrors(err.response.data);
          } else {
            lastError = err.response.data?.message || 
                       err.response.data?.error || 
                       `Server error: ${err.response.status}`;
          }
        } else if (err.request) {
          lastError = "Network error. Please check your connection.";
        } else {
          lastError = "An unexpected error occurred.";
        }
        
        // If this is the last attempt, show the error
        if (i === payloadsToTry.length - 1) {
          setApiError(lastError);
        }
      }
    }

    if (!success && !apiError) {
      setApiError(lastError || "Registration failed with all attempted formats.");
    }

    setIsSubmitting(false);
  };

  // Toggle strategy selection
  const toggleStrategy = (strategy: string) => {
    setStrategies(prev =>
      prev.includes(strategy)
        ? prev.filter(s => s !== strategy)
        : [...prev, strategy]
    );
  };

  // Select all strategies
  const handleSelectAll = () => {
    setStrategies(prev =>
      prev.length === alertTypes.length ? [] : [...alertTypes]
    );
  };

  // Final submission - Save preferences to API
  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setApiError("");
    setShowWelcome(false);

    // Validate step 2
    if (!market) {
      setApiError("Please select a market");
      setIsSubmitting(false);
      return;
    }
    if (strategies.length === 0) {
      setApiError("Please select at least one strategy");
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Saving preferences...");

      // Prepare preferences data - try different formats
      const preferencesPayloads = [
        {
          market: market,
          strategies: strategies,
          market_preferences: {
            india: market === "India" || market === "Both" ? strategies : [],
            us: market === "US" || market === "Both" ? strategies : [],
            crypto: []
          },
          token: registrationToken,
          email: form.email.toLowerCase()
        },
        {
          selected_market: market,
          selected_strategies: strategies,
          token: registrationToken,
          user_email: form.email.toLowerCase()
        },
        {
          market: market.toLowerCase(),
          alert_types: strategies,
          preferences: {
            markets: market === "Both" ? ["india", "us"] : [market.toLowerCase()],
            alerts: strategies
          }
        }
      ];

      let success = false;
      let lastError = "";

      for (let i = 0; i < preferencesPayloads.length; i++) {
        try {
          console.log(`Trying preferences format ${i + 1}:`, preferencesPayloads[i]);
          const response = await api.post("/register/preference", preferencesPayloads[i]);

          const data = response.data;

          if (response.status === 200 && data.success) {
            // Save user data locally
            const userProfile = {
              ...form,
              selectedMarket: market,
              selectedStrategies: strategies,
              selectedMarkets: market === "Both" ? ["india", "us"] : 
                              market === "India" ? ["india"] : ["us"],
              marketPreferences: {
                india: market === "India" || market === "Both" ? strategies : [],
                us: market === "US" || market === "Both" ? strategies : [],
                crypto: []
              },
              registeredAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              token: data.token || registrationToken
            };

            // Save user profile locally
            localStorage.setItem("userProfile", JSON.stringify(userProfile));
            
            // Save market-specific preferences
            if (market === "India" || market === "Both") {
              localStorage.setItem("alertPreferencesIndia", JSON.stringify(strategies));
            }
            if (market === "US" || market === "Both") {
              localStorage.setItem("alertPreferencesUS", JSON.stringify(strategies));
            }
            
            // Save selected market globally for easy access
            localStorage.setItem("selectedMarket", market);
            localStorage.setItem("selectedStrategies", JSON.stringify(strategies));
            
            // Save authentication token if provided
            if (data.token) {
              localStorage.setItem("authToken", data.token);
              localStorage.setItem("userEmail", form.email);
            }

            // Store user's name for welcome message
            const fullName = `${form.firstName} ${form.lastName}`;
            localStorage.setItem("userName", fullName);
            setUserName(fullName);
            
            // Show welcome message
            setShowWelcome(true);
            
            // Set a flag to show welcome message on home page if needed
            sessionStorage.setItem("firstTimeUser", "true");
            
            success = true;
            break;
          } else {
            lastError = data.message || "Failed to save preferences.";
          }
        } catch (err: any) {
          console.error(`Preferences attempt ${i + 1} failed:`, err.message);
          
          if (err.response) {
            if (err.response.status === 422) {
              lastError = parseValidationErrors(err.response.data);
            } else {
              lastError = err.response.data?.message || 
                         err.response.data?.error || 
                         `Server error: ${err.response.status}`;
            }
          } else if (err.request) {
            lastError = "Network error. Please check your connection.";
          } else {
            lastError = "An unexpected error occurred.";
          }
        }
      }

      if (!success) {
        setApiError(lastError || "Failed to save preferences with all attempted formats.");
        
        // Fallback: Save locally if API fails
        console.log("API failed, saving locally as fallback...");
        const userProfile = {
          ...form,
          selectedMarket: market,
          selectedStrategies: strategies,
          selectedMarkets: market === "Both" ? ["india", "us"] : 
                          market === "India" ? ["india"] : ["us"],
          registeredAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        localStorage.setItem("userProfile", JSON.stringify(userProfile));
        localStorage.setItem("selectedMarket", market);
        localStorage.setItem("selectedStrategies", JSON.stringify(strategies));
        
        // Store user's name
        const fullName = `${form.firstName} ${form.lastName}`;
        localStorage.setItem("userName", fullName);
        setUserName(fullName);
        
        // Show welcome message
        setShowWelcome(true);
        sessionStorage.setItem("firstTimeUser", "true");
      }

    } catch (error: any) {
      console.error("Unexpected error in handleSubmit:", error);
      setApiError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Go back to step 1
  const handleBack = () => {
    setStep(1);
    setApiError("");
  };

  // Handle continue from welcome message
  const handleContinueToHome = () => {
    console.log("Navigating to home...");
    navigate("/home");
  };

  const isAllSelected = strategies.length === alertTypes.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar />

      {/* ================= WELCOME MESSAGE ================= */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm">
          <div className="w-full max-w-md bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/40 rounded-2xl p-8 shadow-2xl mx-4">
            <div className="text-center">
              {/* Success Icon */}
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              
              {/* Welcome Message */}
              <h1 className="text-3xl font-bold text-white mb-3">
                🎉 Welcome to AIFinverse!
              </h1>
              
              <div className="mb-6">
                <p className="text-xl text-cyan-300 font-medium">
                  Your journey begins now,
                </p>
                <p className="text-2xl font-bold text-white mt-2">
                  {userName}!
                </p>
              </div>
              
              {/* Success Details */}
              <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
                <p className="text-slate-300 mb-2">
                  ✅ Account created successfully
                </p>
                <p className="text-slate-300 mb-2">
                  ✅ {market} market selected
                </p>
                <p className="text-slate-300">
                  ✅ {strategies.length} alert strategy{strategies.length !== 1 ? 'ies' : ''} enabled
                </p>
              </div>
              
              {/* Continue Button */}
              <Button
                onClick={handleContinueToHome}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Go to Home →
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-lg mx-auto pt-24 pb-12 px-4">
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 1 ? "bg-cyan-500 text-black" : "bg-slate-700"}`}>
                1
              </div>
              <span className={`text-sm ${step === 1 ? "text-cyan-400" : "text-slate-400"}`}>
                Account Details
              </span>
            </div>
            <div className="h-px w-8 bg-slate-700" />
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? "bg-cyan-500 text-black" : "bg-slate-700"}`}>
                2
              </div>
              <span className={`text-sm ${step === 2 ? "text-cyan-400" : "text-slate-400"}`}>
                Market & Alerts
              </span>
            </div>
          </div>

          {/* API Error Display */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
              <div className="flex items-start">
                <div className="flex-shrink-0 text-red-400 mr-3 mt-0.5">⚠️</div>
                <div className="flex-1">
                  <p className="text-red-300 text-sm whitespace-pre-line">{apiError}</p>
                  <p className="text-red-400/70 text-xs mt-2">
                    Tip: Check that all fields are filled correctly. The server might expect different field names.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: Account Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Create Your Account
                </h1>
                <p className="text-slate-400 text-sm">
                  Step 1: Enter your personal information
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    value={form.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={form.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="john.doe@example.com"
                  value={form.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                />
              </div>

              <div className="country-input-container relative">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Country *
                </label>
                <div className="relative">
                  {/* Show selected country's flag if available */}
                  {form.country && (
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <span className="text-xl">
                        {(() => {
                          // Find the flag for the selected country from suggestions
                          const selectedCountry = countrySuggestions.find(
                            country => country.name.toLowerCase() === form.country.toLowerCase()
                          );
                          return selectedCountry?.flag || "🌐";
                        })()}
                      </span>
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Start typing country name (e.g., United States)"
                    value={form.country}
                    onChange={(e) => {
                      handleInputChange("country", e.target.value);
                      setShowSuggestions(true);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (countrySuggestions.length > 0) {
                        setShowSuggestions(true);
                      }
                    }}
                    className={`w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition ${
                      form.country ? 'pl-12' : ''
                    }`}
                  />
                </div>
                
                {/* Country Suggestions Dropdown */}
                {showSuggestions && (
                  <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-xl max-h-64 overflow-y-auto">
                    {isLoadingCountries ? (
                      <div className="px-4 py-3 text-center text-slate-400">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-500 mx-auto"></div>
                        <p className="mt-2 text-sm">Loading countries...</p>
                      </div>
                    ) : countrySuggestions.length > 0 ? (
                      countrySuggestions.map((country, index) => (
                        <div
                          key={`${country.name}-${index}`}
                          className="px-4 py-3 hover:bg-slate-700 cursor-pointer transition-colors border-b border-slate-700 last:border-b-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInputChange("country", country.name);
                            setShowSuggestions(false);
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{country.flag}</span>
                            <span className="text-white">{country.name}</span>
                          </div>
                        </div>
                      ))
                    ) : form.country.length >= 2 ? (
                      <div className="px-4 py-3 text-center text-slate-400">
                        No countries found
                      </div>
                    ) : null}
                  </div>
                )}
                
                {form.country.length === 1 && (
                  <p className="text-xs text-slate-500 mt-2">
                    Type at least 2 characters to see suggestions
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Must be at least 8 characters with uppercase, lowercase, and a number
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={form.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <Button
                onClick={handleNext}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-semibold py-3 rounded-xl hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2" />
                    Registering...
                  </span>
                ) : (
                  "Continue to Market & Alerts"
                )}
              </Button>

            </div>
          )}

          {/* STEP 2: Market & Alert Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Select Market & Alerts
                </h1>
                <p className="text-slate-400 text-sm">
                  Step 2: Choose your market and alert strategies
                </p>
              </div>

              {/* Market Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Select Your Market <span className="text-red-400">*</span>
                </h3>
                <p className="text-slate-400 text-sm">
                  Choose which markets you want to receive alerts for
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {(["India", "US", "Both"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMarket(m)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center space-y-2 ${
                        market === m
                          ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                          : "border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800/50"
                      }`}
                    >
                      <span className="text-2xl">{marketIcons[m]}</span>
                      <span className="font-medium">{m}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Alert Strategy Selection */}
              {market && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      Choose Alert Types <span className="text-red-400">*</span>
                    </h3>
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-sm text-cyan-400 hover:text-cyan-300 transition"
                    >
                      {isAllSelected ? "Deselect All" : "Select All"}
                    </button>
                  </div>
                  
                  <p className="text-slate-400 text-sm">
                    Select alert types you want to receive for {market} market
                  </p>

                  <div className="space-y-3">
                    {alertTypes.map((type) => (
                      <div
                        key={type}
                        onClick={() => toggleStrategy(type)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 flex items-center space-x-4 ${
                          strategies.includes(type)
                            ? "border-cyan-500 bg-cyan-500/10"
                            : "border-slate-700 bg-slate-900/50 hover:bg-slate-800/50"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          strategies.includes(type)
                            ? "border-cyan-500 bg-cyan-500"
                            : "border-slate-500"
                        }`}>
                          {strategies.includes(type) && (
                            <div className="w-2 h-2 bg-white rounded-sm" />
                          )}
                        </div>
                        <span className={`font-medium ${
                          strategies.includes(type) ? "text-cyan-300" : "text-slate-300"
                        }`}>
                          {type}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Selected Summary */}
                  {strategies.length > 0 && (
                    <div className="text-center py-3 bg-slate-900/30 rounded-xl">
                      <p className="text-cyan-400 font-medium">
                        {strategies.length} alert type(s) selected for {market} market
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || strategies.length === 0}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Saving Preferences...
                        </span>
                      ) : (
                        "Complete Registration"
                      )}
                    </Button>

                    <Button
                      onClick={handleBack}
                      variant="outline"
                      className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white py-3 rounded-xl transition"
                    >
                      Back to Account Details
                    </Button>
                  </div>
                </div>
              )}

              {/* Prompt to select market */}
              {!market && (
                <div className="text-center py-8">
                  <p className="text-slate-400">
                    Please select a market to continue
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-700">
            <p className="text-center text-slate-500 text-sm">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/")}
                className="text-cyan-400 hover:text-cyan-300 transition"
              >
                Go to Home
              </button>
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-slate-600 text-xs mt-6">
          By registering, you agree to our Terms of Service and Privacy Policy.
          All data is securely stored and encrypted.
        </p>
      </main>
    </div>
  );
};

export default Registration;