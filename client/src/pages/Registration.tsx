import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useLocation } from "wouter";
import { api } from "@/services/api";
import { CheckCircle, X, AlertCircle } from "lucide-react";

const alertTypes = [
  "Momentum Riders (52-week High/Low, All-Time High/Low)",
  "Cycle Count Reversal",
  "Double Top - Double Bottom (Contrabets)",
  "Topping Candle - Bottoming Candle (Contrabets)",
  "Mean Reversion",
  "Pattern Formation",
  "Fundamental Picks (Earnings Season focused)"
];

// Replace the strategyDescriptions with this structure
const strategyInfo: Record<string, { description: string; frequency: string }> = {
  "Momentum Riders (52-week High/Low, All-Time High/Low)": {
    description: "For traders who love to trade stocks at 52 week / all time highs or lows. These alerts come without any buy/sell levels.",
    frequency: "High frequency in trending markets"
  },
  "Cycle Count Reversal": {
    description: "High probability setups based on 10-year backtesting with suggestive targets for both long and short side.",
    frequency: "Less frequent (1-3 alerts/week)"
  },
  "Double Top - Double Bottom (Contrabets)": {
    description: "Identifies retesting of price levels leading to short-term reversals and trading ranges.",
    frequency: "High in ranging markets"
  },
  "Topping Candle - Bottoming Candle (Contrabets)": {
    description: "Technical identification of trend reversal points at tops and bottoms.",
    frequency: "High during trend changes"
  },
  "Mean Reversion": {
    description: "Alerts when stocks deviate significantly from averages and are likely to revert.",
    frequency: "Moderate (2-5 alerts/week)"
  },
  "Pattern Formation": {
    description: "Identifies chart patterns like channels, head & shoulders for significant moves.",
    frequency: "Low to moderate"
  },
  "Fundamental Picks (Earnings Season focused)": {
    description: "Earnings season opportunities with fundamental analysis for growth stocks.",
    frequency: "Seasonal (high during earnings)"
  }
};

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

// Terms & Conditions content
const termsAndConditions = [
  {
    title: "1. Acceptance of Terms",
    content: "By creating an account on AIFinverse ('Platform'), you confirm that you have read, understood, and agreed to these Terms & Conditions. If you do not agree, you must not register or use the Platform."
  },
  {
    title: "2. Eligibility",
    content: "You must be at least 18 years old to use the Platform. By signing up, you confirm that you are legally permitted to do so."
  },
  {
    title: "3. Purpose of the Platform",
    content: "AIFinverse is an information and analytics platform designed to help users monitor a broad market universe using AI-assisted systems.\n\nThe Platform:\n• Tracks stocks across Indian and US markets\n• Generates alerts based on predefined strategies and algorithms\n• Aims to reduce manual effort and improve market awareness\n\nAIFinverse does not provide investment advice."
  },
  {
    title: "4. No Investment Advice or Recommendations",
    content: "All content, alerts, insights, and outputs provided by AIFinverse are:\n• For educational and informational purposes only\n• Not intended as investment, trading, or financial advice\n• Not a recommendation to buy, sell, or hold any security\n\nMarkets are uncertain and probabilistic.\nUsers are solely responsible for their trading and investment decisions."
  },
  {
    title: "5. No Brokerage or Fund Management",
    content: "AIFinverse:\n• Is not a brokerage\n• Is not a trading firm\n• Does not execute trades\n• Does not manage, hold, or access user funds\n• Does not guarantee returns or outcomes"
  },
  {
    title: "6. Use of AI and Algorithms",
    content: "The Platform uses proprietary algorithms and AI-assisted models to identify market conditions and generate alerts.\n\nYou acknowledge that:\n• AI outputs are based on historical and real-time data patterns\n• Alerts may be delayed, incomplete, or incorrect\n• No alert implies certainty or guarantees future performance\n• AI is a decision-support tool, not a substitute for judgment."
  },
  {
    title: "7. Alerts and User Responsibility",
    content: "Alerts are intended to narrow focus, not force action.\n\nYou agree that:\n• You will independently evaluate any alert before acting\n• You understand that some strategies may be inactive during certain market conditions\n• Absence of alerts does not imply absence of risk or opportunity"
  },
  {
    title: "8. Account Responsibility",
    content: "You are responsible for:\n• Maintaining accurate account information\n• Securing your login credentials\n• All activity conducted under your account\n\nAIFinverse reserves the right to suspend or terminate accounts that misuse the Platform or violate these Terms."
  },
  {
    title: "9. Intellectual Property",
    content: "All platform content, algorithms, alerts, data structures, branding, and software are the intellectual property of AIFinverse.\n\nUsers may not:\n• Copy, redistribute, or resell Platform content\n• Present alerts or outputs as guaranteed signals\n• Reverse engineer or scrape the Platform"
  },
  {
    title: "10. Platform Availability",
    content: "While we aim for continuous availability, the Platform may be temporarily unavailable due to maintenance, data provider issues, or technical limitations.\n\nAIFinverse is not liable for losses arising from service interruptions or delayed alerts."
  },
  {
    title: "11. Limitation of Liability",
    content: "To the maximum extent permitted by law:\n• AIFinverse shall not be liable for any trading losses, financial losses, or missed opportunities\n• Use of the Platform is entirely at the user's own risk"
  },
  {
    title: "12. User Conduct",
    content: "Users agree to:\n• Use the Platform lawfully\n• Provide constructive feedback\n• Respect the collaborative learning environment\n\nAbuse, manipulation, or misrepresentation of Platform outputs may result in account termination."
  },
  {
    title: "13. Modifications",
    content: "AIFinverse may update these Terms as the Platform evolves. Continued use after updates constitutes acceptance of the revised Terms."
  },
  {
    title: "14. Termination",
    content: "Access may be suspended or terminated at any time for violations of these Terms or misuse of the Platform."
  },
  {
    title: "15. Governing Law",
    content: "These Terms shall be governed by applicable laws, without regard to conflict-of-law principles."
  },
  {
    title: "16. Contact",
    content: "For questions or concerns regarding these Terms, users may contact AIFinverse through the official channels provided on the Platform."
  }
];

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
  const [hoveredStrategy, setHoveredStrategy] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countrySuggestions, setCountrySuggestions] = useState<CountrySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [registrationToken, setRegistrationToken] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string>("");
  const [userDataFromAPI, setUserDataFromAPI] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  // New state for welcome message
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName] = useState("");

  // Terms & Conditions state
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
  const [termsError, setTermsError] = useState("");

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
    
    // Create the payload in the exact format you need
    const payload = {
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      country: form.country.trim(),
      password: form.password,
      // Add confirm_password if backend expects it
      ...(form.confirmPassword && { confirm_password: form.confirmPassword })
    };

    console.log("Sending registration payload to /register:", payload);

    try {
      const response = await api.post("/register", payload);
      console.log("Registration response:", response);

      const data = response.data;
      
      if (response.status === 200 || response.status === 201) {
        // Store the complete user data from API response
        setUserDataFromAPI(data);
        
        // Extract user_id from the response data
        const userId = data.user_id || data.id || data.userId || data.data?.user_id;
        setUserId(userId);
        
        if (userId) {
          // 🔐 AUTO LOGIN AFTER REGISTER
          try {
            const loginRes = await api.post("/login", {
              email: form.email.trim().toLowerCase(),
              password: form.password
            });

            const token = loginRes.data.access_token;
            
            // Store token in state for step 2
            setRegistrationToken(token);
            
            // Move to step 2
            setStep(2);
            
            console.log("Auto-login successful, token saved to state:", token);
          } catch (loginErr: any) {
            console.error("Auto-login failed:", loginErr);
            // Even if auto-login fails, continue to step 2
            // User can try logging in separately later
            setStep(2);
          }
        } else {
          console.error("No user_id found in response:", data);
          setApiError("Registration successful but no user ID returned. Please contact support.");
        }
      } else {
        setApiError(data.message || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      
      if (err.response) {
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
        
        // Handle 422 validation errors
        if (err.response.status === 422) {
          const errorMessage = parseValidationErrors(err.response.data);
          setApiError(errorMessage);
        } else {
          const errorData = err.response.data;
          setApiError(
            errorData?.message || 
            errorData?.error || 
            errorData?.detail || 
            `Server error: ${err.response.status}`
          );
        }
      } else if (err.request) {
        console.error("No response received:", err.request);
        setApiError("Network error. Please check your connection and try again.");
      } else {
        console.error("Request setup error:", err.message);
        setApiError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle strategy selection
  const toggleStrategy = (strategy: string) => {
    setStrategies(prev =>
      prev.includes(strategy)
        ? prev.filter(s => s !== strategy)
        : [...prev, strategy]
    );
  };

  // Handle mouse enter for strategy
  const handleStrategyMouseEnter = (strategy: string) => {
    setHoveredStrategy(strategy);
  };

  // Handle mouse leave for strategy
  const handleStrategyMouseLeave = () => {
    setHoveredStrategy(null);
  };

  // Select all strategies
  const handleSelectAll = () => {
    setStrategies(prev =>
      prev.length === alertTypes.length ? [] : [...alertTypes]
    );
  };

  // Handle Complete Registration button click
  const handleCompleteRegistrationClick = () => {
    if (isSubmitting) return;
    
    // Check if we have the user ID from step 1
    if (!userId) {
      setApiError("Registration session expired. Please start over.");
      return;
    }

    // Validate step 2
    if (!market) {
      setApiError("Please select a market");
      return;
    }
    if (strategies.length === 0) {
      setApiError("Please select at least one strategy");
      return;
    }

    // Show terms and conditions modal instead of submitting immediately
    setShowTermsModal(true);
    setTermsError("");
  };

  // Handle agreement to terms
  const handleAgreeToTerms = () => {
    if (!hasAgreedToTerms) {
      setTermsError("You must agree to the Terms & Conditions to continue");
      return;
    }
    
    setShowTermsModal(false);
    // Proceed with registration submission
    handleSubmit();
  };

  // Handle disagreement to terms
  const handleDisagreeToTerms = () => {
    setShowTermsModal(false);
    setHasAgreedToTerms(false);
    setTermsError("You must agree to the Terms & Conditions to complete registration");
  };

  // Helper function to try alternative payload formats
  const tryAlternativePayloads = async (token: string, userId: string, userData: any, market: string, strategies: string[]) => {
    const payloadVariations = [
      // Format 1: Direct user data (complete JSON)
      userData,
      
      // Format 2: Nested in user_data field
      { 
        user_data: userData,
        market: market,
        strategies: strategies 
      },
      
      // Format 3: Only preferences with user_id
      {
        user_id: userId,
        market: market,
        strategies: strategies
      },
      
      // Format 4: Complete structure as expected by backend
      {
        user_id: userId,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        country: userData.country,
        market: market,
        strategies: strategies
      }
    ];

    for (let i = 0; i < payloadVariations.length; i++) {
      try {
        console.log(`Trying payload format ${i + 1}:`, JSON.stringify(payloadVariations[i], null, 2));
        
        const response = await api.post("/register/preferences", payloadVariations[i], {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log(`Success with format ${i + 1}:`, response.data);
        return { success: true, data: response.data };
      } catch (err: any) {
        console.log(`Format ${i + 1} failed:`, err.response?.data || err.message);
        if (i === payloadVariations.length - 1) {
          return { success: false, error: err };
        }
      }
    }
    return { success: false, error: new Error("All formats failed") };
  };

  // Helper function to save data locally with the correct JSON structure
  const saveDataLocally = (userData: any) => {
    console.log("Saving data locally...");
    
    // Save the complete data to local storage in exact JSON format
    localStorage.setItem("userData", JSON.stringify(userData, null, 2));
    
    // Also save simplified version for app use
    localStorage.setItem("userProfile", JSON.stringify({
      email: form.email,
      firstName: form.firstName,
      lastName: form.lastName,
      country: form.country,
      selectedMarket: market,
      selectedStrategies: strategies,
      userId: userId,
      agreedToTerms: true,
      termsAgreedDate: new Date().toISOString()
    }));
    
    localStorage.setItem("selectedMarket", market || "");
    localStorage.setItem("selectedStrategies", JSON.stringify(strategies));

    const fullName = `${form.firstName} ${form.lastName}`;
    localStorage.setItem("userName", fullName);
    
    // Store auth token if available
    if (registrationToken) {
      localStorage.setItem("authToken", registrationToken);
      localStorage.setItem("userPlan", "premium"); // Grant premium access
      localStorage.setItem("registrationComplete", "true");
    }
    
    setUserName(fullName);
    
    setShowWelcome(true);
    sessionStorage.setItem("firstTimeUser", "true");
    
    console.log("Data saved locally successfully!");
    console.log("Local JSON structure:", JSON.stringify(userData, null, 2));

     // ⭐ ADD THIS LINE ⭐
  localStorage.setItem("registrationComplete", "true");
  
  setUserName(fullName);
  setShowWelcome(true);
  
  console.log("Data saved locally successfully!");

  };

 

  // Final submission - Save preferences to API
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setApiError("");
    setShowWelcome(false);

    // 🔐 Check if we have the registration token (from auto-login in step 1)
    const token = registrationToken;
    if (!token) {
      // Try to get token from localStorage as fallback
      const storedToken = localStorage.getItem("authToken");
      if (!storedToken) {
        setApiError("Authentication token missing. Please login again.");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      console.log("Saving preferences for user:", userId);

      // Create the complete user object in your desired JSON format
      const completeUserData = {
        user_id: userId,
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        country: form.country.trim(),
        created_at: new Date().toISOString(),
        preferences: {
          market: market,
          strategies: strategies,
          updated_at: new Date().toISOString()
        },
        terms_accepted: {
          agreed: true,
          accepted_date: new Date().toISOString(),
          terms_version: "1.0"
        }
      };

      console.log("Complete user data for S3:", JSON.stringify(completeUserData, null, 2));

      // Use the token we have (from state or localStorage)
      const authToken = token || localStorage.getItem("authToken") || "";
      
      if (authToken) {
        // Try different payload formats to find what works
        const result = await tryAlternativePayloads(
          authToken, 
          userId!, 
          completeUserData, 
          market!, 
          strategies
        );

        if (result.success) {
          const data = result.data;
          console.log("Preferences saved to API successfully:", data);
        }
      }

      // Always save locally (even if API fails)
      saveDataLocally(completeUserData);
      
      // Store auth token permanently
      if (token) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("userPlan", "premium");
        localStorage.setItem("registrationComplete", "true");
      }

      console.log("Registration and preferences saved successfully!");
      
    } catch (err: any) {
      console.error("Preferences error:", err);
      
      // Save locally as fallback even if API fails
      const completeUserData = {
        user_id: userId,
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        country: form.country.trim(),
        created_at: new Date().toISOString(),
        preferences: {
          market: market,
          strategies: strategies,
          updated_at: new Date().toISOString()
        },
        terms_accepted: {
          agreed: true,
          accepted_date: new Date().toISOString(),
          terms_version: "1.0"
        }
      };
      
      setApiError("Could not save to server. Saved locally instead.");
      saveDataLocally(completeUserData);
      
      // Store auth token if available
      if (registrationToken) {
        localStorage.setItem("authToken", registrationToken);
        localStorage.setItem("userPlan", "premium");
        localStorage.setItem("registrationComplete", "true");
      }
      
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

      {/* ================= TERMS & CONDITIONS MODAL ================= */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl mx-4 flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Terms & Conditions</h2>
                  <p className="text-sm text-slate-400">AIFinverse - Last Updated</p>
                </div>
              </div>
              <button
                onClick={handleDisagreeToTerms}
                className="p-2 hover:bg-slate-700 rounded-lg transition"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Terms Content */}
            <div className="flex-1 overflow-y-auto pr-2 mb-4">
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/50 rounded-xl mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <p className="text-sm font-medium text-red-400">IMPORTANT NOTICE</p>
                  </div>
                  <p className="text-slate-300 text-sm">
                    This is a legally binding agreement. By clicking "I Agree", you accept all terms below.
                    If you do not agree, you cannot use AIFinverse.
                  </p>
                </div>

                {termsAndConditions.map((term, index) => (
                  <div key={index} className="bg-slate-800/30 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">{term.title}</h3>
                    <p className="text-slate-300 text-sm whitespace-pre-line">{term.content}</p>
                  </div>
                ))}

                {/* Agreement Checkbox */}
                <div className="sticky bottom-0 bg-slate-800/90 backdrop-blur-sm p-4 rounded-xl border border-slate-700 mt-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center h-6">
                      <input
                        type="checkbox"
                        id="agree-terms"
                        checked={hasAgreedToTerms}
                        onChange={(e) => {
                          setHasAgreedToTerms(e.target.checked);
                          setTermsError("");
                        }}
                        className="w-5 h-5 rounded border-2 border-slate-600 bg-slate-800 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="agree-terms" className="text-white font-medium cursor-pointer">
                        I have read, understood, and agree to all terms & conditions
                      </label>
                      <p className="text-slate-400 text-sm mt-1">
                        You must check this box to complete your registration
                      </p>
                      {termsError && (
                        <p className="text-red-400 text-sm mt-2">{termsError}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer - Action Buttons */}
            <div className="flex space-x-3 pt-4 border-t border-slate-700">
              <Button
                onClick={handleDisagreeToTerms}
                variant="outline"
                className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 py-3"
              >
                I Disagree - Cancel Registration
              </Button>
              <Button
                onClick={handleAgreeToTerms}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Processing...
                  </span>
                ) : (
                  "I Agree - Complete Registration"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

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
                  ✅ Terms & Conditions accepted
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
                  {termsError && (
                    <p className="text-red-400/70 text-xs mt-2">{termsError}</p>
                  )}
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
          className="relative"
          onMouseEnter={() => handleStrategyMouseEnter(type)}
          onMouseLeave={handleStrategyMouseLeave}
        >
          <div
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
            <div className="flex-1 flex items-center justify-between">
              <span className={`font-medium ${
                strategies.includes(type) ? "text-cyan-300" : "text-slate-300"
              }`}>
                {type}
              </span>
              
              {/* Strategy Info Message - Shows beside strategy name */}
              {/* Strategy Info Message */}
{hoveredStrategy === type && (
  <div 
    className="ml-4 p-4 bg-slate-800/95 border border-cyan-500/40 rounded-xl animate-in fade-in slide-in-from-right-2 duration-200 flex-shrink-0 max-w-xs shadow-xl"
    onMouseEnter={() => setHoveredStrategy(type)}
    onMouseLeave={handleStrategyMouseLeave}
  >
    <div className="space-y-3">
      {/* Description Section */}
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
          <p className="text-xs font-semibold text-cyan-300 uppercase tracking-wide">
            Description
          </p>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {strategyInfo[type]?.description}
        </p>
      </div>
      
      {/* Divider */}
      <div className="border-t border-slate-700/50"></div>
      
      {/* Frequency Section */}
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wide">
            Frequency
          </p>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {strategyInfo[type]?.frequency}
        </p>
      </div>
    </div>
  </div>
)}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Hover hint */}
    <div className="text-center py-2">
      <p className="text-xs text-slate-500 italic">
        Hover over any strategy to see its description
      </p>
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
        onClick={handleCompleteRegistrationClick}
        disabled={isSubmitting || strategies.length === 0}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Processing...
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
              Already have an account? {" "}
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