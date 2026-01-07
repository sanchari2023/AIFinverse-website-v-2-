import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  User, Mail, ShieldCheck, Zap, ChevronRight, Globe,
  Target, RefreshCw, Bell, Check, Plus, Trash2
} from "lucide-react";
import { useUserPreferences } from "@/hooks/useUserPreferences";

type TabType = "account" | "subscription" | "manage-markets";

const MARKET_CONFIG = {
  india: { name: "India", flag: "🇮🇳", key: "alertPreferencesIndia" },
  us: { name: "US", flag: "🇺🇸", key: "alertPreferencesUS" },
  both: { name: "Both", flag: "🌐", key: "alertPreferencesBoth" }
};

const REAL_TIME_UPDATE_INTERVAL = 2000;

export default function Profile() {
  const [activeTab, setActiveTab] = useState<TabType>("account");
  
  // Updated alert types as per requirement
  const alertTypes = [
    "Momentum Riders (52-week High/Low, All-Time High/Low)",
    "Cycle Count Reversal",
    "Mean Reversion",
    "Contrabets",
    "Pattern Formation",
    "Fundamental Picks (Earnings Season focused)"
  ];

  const isEditingMarkets = activeTab === "manage-markets";

  const [userProfile, setUserProfile] = useState({
    email: "",
    firstName: "",
    lastName: "",
    country: "",
    selectedMarket: "", // Store ORIGINAL selected market from registration (never changes)
    selectedStrategies: [], // Store ORIGINAL selected strategies from registration (never changes)
    selectedMarkets: ["india"], // Current market selections (can be modified)
    marketPreferences: { india: [], us: [], both: [] }, // Current market preferences
    updatedAt: new Date().toISOString()
  });

  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  /* ---------------- HELPER FUNCTIONS ---------------- */

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const isAllSelected = (marketId: string) => {
    const selectedStrategies = userProfile.marketPreferences[marketId] || [];
    return selectedStrategies.length === alertTypes.length;
  };

  /* ---------------- LOAD PROFILE ---------------- */

  const loadUserProfile = () => {
    if (isEditingMarkets) return;

    setIsLoading(true);
    try {
      const saved = localStorage.getItem("userProfile");
      
      // Load ORIGINAL registration data (never changes after registration)
      const originalSelectedMarket = localStorage.getItem("selectedMarket") || "";
      const originalSelectedStrategies = JSON.parse(localStorage.getItem("selectedStrategies") || "[]");
      
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // Ensure marketPreferences structure exists
        const marketPreferences = parsed.marketPreferences || {};
        const enhancedMarketPreferences = {
          india: marketPreferences.india || originalSelectedStrategies,
          us: marketPreferences.us || originalSelectedStrategies,
          both: marketPreferences.both || []
        };
        
        // Determine selected markets based on CURRENT selection
        let selectedMarkets = parsed.selectedMarkets || ["india"];
        if (selectedMarkets.length === 0 && originalSelectedMarket) {
          // If no current selection, use original registration selection as default
          if (originalSelectedMarket === "US") {
            selectedMarkets = ["us"];
          } else if (originalSelectedMarket === "Both") {
            selectedMarkets = ["india", "us"];
          }
        }
        
        setUserProfile({
          ...parsed,
          // Keep ORIGINAL registration data (never changes)
          selectedMarket: originalSelectedMarket,
          selectedStrategies: originalSelectedStrategies,
          
          // Current preferences (can be modified)
          marketPreferences: enhancedMarketPreferences,
          selectedMarkets: selectedMarkets,
          updatedAt: parsed.updatedAt || new Date().toISOString()
        });
        
        // Update localStorage for consistency
        localStorage.setItem("userProfile", JSON.stringify({
          ...parsed,
          marketPreferences: enhancedMarketPreferences,
          selectedMarkets: selectedMarkets,
          updatedAt: new Date().toISOString()
        }));
      } else {
        // Try to load from registration data
        let selectedMarkets = ["india"];
        if (originalSelectedMarket === "US") {
          selectedMarkets = ["us"];
        } else if (originalSelectedMarket === "Both") {
          selectedMarkets = ["india", "us"];
        }
        
        const newProfile = {
          email: "",
          firstName: "",
          lastName: "",
          country: "",
          selectedMarket: originalSelectedMarket, // Original registration market
          selectedStrategies: originalSelectedStrategies, // Original registration strategies
          selectedMarkets: selectedMarkets,
          marketPreferences: {
            india: originalSelectedMarket === "India" || originalSelectedMarket === "Both" ? originalSelectedStrategies : [],
            us: originalSelectedMarket === "US" || originalSelectedMarket === "Both" ? originalSelectedStrategies : [],
            both: []
          },
          updatedAt: new Date().toISOString()
        };
        
        setUserProfile(newProfile);
        localStorage.setItem("userProfile", JSON.stringify(newProfile));
      }
    } catch (e) {
      console.error("Profile load error", e);
    } finally {
      setIsLoading(false);
      setLastUpdateTime(new Date());
    }
  };

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    if (isEditingMarkets) return;

    const interval = setInterval(loadUserProfile, REAL_TIME_UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [isEditingMarkets]);

  useEffect(() => {
    const onStorage = () => {
      if (!isEditingMarkets) loadUserProfile();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [isEditingMarkets]);

  /* ---------------- EDIT ACTIONS ---------------- */

  const handleRefresh = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    loadUserProfile();
  };

  const toggleMarket = (marketId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setUserProfile(prev => ({
      ...prev,
      selectedMarkets: prev.selectedMarkets.includes(marketId)
        ? prev.selectedMarkets.filter(m => m !== marketId)
        : [...prev.selectedMarkets, marketId]
    }));
  };

  const toggleStrategy = (marketId: string, strategy: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setUserProfile(prev => {
      const list = prev.marketPreferences[marketId] || [];
      return {
        ...prev,
        marketPreferences: {
          ...prev.marketPreferences,
          [marketId]: list.includes(strategy)
            ? list.filter(s => s !== strategy)
            : [...list, strategy]
        }
      };
    });
  };

  const handleSelectAll = (marketId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAllSelected(marketId)) {
      setUserProfile(prev => ({
        ...prev,
        marketPreferences: {
          ...prev.marketPreferences,
          [marketId]: []
        }
      }));
    } else {
      setUserProfile(prev => ({
        ...prev,
        marketPreferences: {
          ...prev.marketPreferences,
          [marketId]: [...alertTypes]
        }
      }));
    }
  };

  const handleRemoveMarket = (marketId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm(`Are you sure you want to remove all strategies for ${MARKET_CONFIG[marketId].name}?`)) {
      setUserProfile(prev => ({
        ...prev,
        marketPreferences: {
          ...prev.marketPreferences,
          [marketId]: []
        }
      }));
    }
  };

  const handleSavePreferences = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (userProfile.selectedMarkets.length === 0) {
      alert("Please select at least one market to continue.");
      return;
    }

    const updatedProfile = {
      ...userProfile,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));

    // Save each market's preferences
    userProfile.selectedMarkets.forEach((marketId) => {
      if (!MARKET_CONFIG[marketId]) return;

      localStorage.setItem(
        MARKET_CONFIG[marketId].key,
        JSON.stringify(userProfile.marketPreferences[marketId] || [])
      );
    });

    // Clear preferences for unselected markets
    Object.keys(MARKET_CONFIG).forEach(marketId => {
      if (!userProfile.selectedMarkets.includes(marketId)) {
        localStorage.removeItem(MARKET_CONFIG[marketId].key);
      }
    });

    // Update CURRENT market selection (not registration market)
    const currentMarketSelection = 
      userProfile.selectedMarkets.length === 2 ? "Both" :
      userProfile.selectedMarkets[0] === "india" ? "India" : "US";
    
    // Save current market selection separately (not overwriting registration)
    localStorage.setItem('currentMarketSelection', currentMarketSelection);

    // Notify other components
    window.dispatchEvent(new Event("storage"));
    
    alert("Preferences saved successfully!");
    setActiveTab("subscription");
  };

  /* ---------------- SIDEBAR ITEMS ---------------- */

  const sidebarItems = [
    { id: "account" as TabType, label: "Account", icon: User },
    { id: "subscription" as TabType, label: "Subscription", icon: Zap },
    { id: "manage-markets" as TabType, label: "Manage Markets", icon: Globe },
  ];

  /* ---------------- RENDER ---------------- */

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <div className="pt-24 text-center text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">

          {/* SIDEBAR */}
          <aside className="w-full md:w-64">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-2 sticky top-24">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveTab(item.id);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                    activeTab === item.id
                      ? "bg-cyan-500/10 text-cyan-400"
                      : "text-slate-400 hover:bg-slate-800/50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {activeTab === item.id && <ChevronRight className="ml-auto w-4 h-4" />}
                </button>
              ))}
            </div>
          </aside>

          {/* CONTENT */}
          <div className="flex-grow space-y-6">

            {/* ACCOUNT TAB */}
            {activeTab === "account" && (
              <>
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold text-white">Account Settings</h1>
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-slate-500">
                      Updated: {formatTime(lastUpdateTime)}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefresh}
                      className="flex items-center gap-2 border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh Data
                    </Button>
                  </div>
                </div>

                <Card className="bg-slate-900/40 border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-cyan-400" />
                      Account Information
                    </CardTitle>
                    <CardDescription>Your registered details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm text-slate-400">Email Address</label>
                      <Input value={userProfile.email || "Not set"} readOnly className="bg-slate-800 mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-slate-400">First Name</label>
                        <Input value={userProfile.firstName || "Not set"} readOnly className="bg-slate-800 mt-1" />
                      </div>
                      <div>
                        <label className="text-sm text-slate-400">Last Name</label>
                        <Input value={userProfile.lastName || "Not set"} readOnly className="bg-slate-800 mt-1" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400">Country</label>
                      <Input value={userProfile.country || "Not set"} readOnly className="bg-slate-800 mt-1" />
                    </div>
                  </CardContent>
                </Card>

                {/* MARKET & ALERT SUMMARY */}
                <Card className="bg-slate-900/40 border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-cyan-400" />
                      Market & Alert Summary
                    </CardTitle>
                    <CardDescription>Your registration preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm text-slate-400">Selected Market</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input 
                          value={userProfile.selectedMarket || "Not set"} 
                          readOnly 
                          className="bg-slate-800" 
                        />
                        {userProfile.selectedMarket === "India" && (
                          <span className="text-2xl">🇮🇳</span>
                        )}
                        {userProfile.selectedMarket === "US" && (
                          <span className="text-2xl">🇺🇸</span>
                        )}
                        {userProfile.selectedMarket === "Both" && (
                          <div className="flex">
                            <span className="text-2xl">🇮🇳</span>
                            <span className="text-2xl ml-1">🇺🇸</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400">Selected Alert Types</label>
                      <div className="mt-2">
                        {userProfile.selectedStrategies.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {userProfile.selectedStrategies.map((strategy, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm"
                              >
                                {strategy}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-slate-400">No alert types selected</p>
                        )}
                      </div>
                    </div>
                    <div className="pt-2">
                      <Button
                        onClick={() => setActiveTab("manage-markets")}
                        variant="outline"
                        className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        Manage Markets & Alerts
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* SUBSCRIPTION TAB */}
            {activeTab === "subscription" && (
              <div className="space-y-6">
                <header className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-bold text-white">
                      Your Subscription
                    </h1>
                    <p className="text-slate-400">
                      Review your current market and alert selections
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Bell className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs text-slate-500">
                        Live updates • Last refresh: {formatTime(lastUpdateTime)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 rounded-full">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-cyan-400">Live</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefresh}
                      className="flex items-center gap-2 border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </Button>
                  </div>
                </header>

                {/* Registration Summary - Shows ORIGINAL registration data */}
                <Card className="bg-slate-900/40 border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-cyan-400" />
                      Registration Summary
                    </CardTitle>
                    <CardDescription>
                      Your initial market and alert selections from registration
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          {userProfile.selectedMarket === "India" && <span className="text-2xl">🇮🇳</span>}
                          {userProfile.selectedMarket === "US" && <span className="text-2xl">🇺🇸</span>}
                          {userProfile.selectedMarket === "Both" && (
                            <div className="flex">
                              <span className="text-2xl">🇮🇳</span>
                              <span className="text-2xl ml-1">🇺🇸</span>
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-cyan-300">Selected Market</h3>
                            <p className="text-sm text-slate-400">
                              {userProfile.selectedMarket || "Not set"}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              Original selection from registration
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Target className="w-6 h-6 text-cyan-400" />
                          <div>
                            <h3 className="font-semibold text-cyan-300">Alert Types</h3>
                            <p className="text-sm text-slate-400">
                              {userProfile.selectedStrategies.length} type(s) selected
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              Original selection from registration
                            </p>
                          </div>
                        </div>
                        {userProfile.selectedStrategies.length > 0 && (
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-1">
                              {userProfile.selectedStrategies.slice(0, 3).map((strategy, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-cyan-500/10 text-cyan-300 rounded text-xs"
                                >
                                  {strategy}
                                </span>
                              ))}
                              {userProfile.selectedStrategies.length > 3 && (
                                <span className="px-2 py-1 bg-slate-700 text-slate-400 rounded text-xs">
                                  +{userProfile.selectedStrategies.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Active Markets Summary - Shows CURRENT preferences */}
                <Card className="bg-slate-900/40 border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-cyan-400" />
                      Current Active Markets
                    </CardTitle>
                    <CardDescription>
                      {userProfile.selectedMarkets.length} {userProfile.selectedMarkets.length === 1 ? 'market' : 'markets'} active
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {userProfile.selectedMarkets.map(marketId => {
                        const market = MARKET_CONFIG[marketId];
                        const strategies = userProfile.marketPreferences[marketId] || [];
                        
                        return (
                          <div 
                            key={marketId} 
                            className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-cyan-500/30 transition-colors"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <span className="text-2xl">{market.flag}</span>
                              <div>
                                <h3 className="font-semibold text-cyan-300">{market.name}</h3>
                                <p className="text-xs text-slate-400">
                                  {strategies.length} {strategies.length === 1 ? 'strategy' : 'strategies'}
                                </p>
                              </div>
                            </div>
                            
                            {strategies.length > 0 && (
                              <div className="space-y-1">
                                {strategies.slice(0, 2).map(strategy => (
                                  <div key={strategy} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                                    <span className="text-sm text-slate-300">{strategy}</span>
                                  </div>
                                ))}
                                {strategies.length > 2 && (
                                  <p className="text-xs text-slate-500 mt-1">
                                    +{strategies.length - 2} more strategies
                                  </p>
                                )}
                              </div>
                            )}
                            
                            {strategies.length === 0 && (
                              <p className="text-sm text-slate-500 italic">
                                No strategies selected
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-slate-700">
                      <Button
                        onClick={() => setActiveTab("manage-markets")}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-semibold hover:from-cyan-600 hover:to-blue-600"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Manage Markets & Strategies
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* MANAGE MARKETS TAB */}
            {activeTab === "manage-markets" && (
              <div className="space-y-6">
                <header>
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-white">
                        Manage Markets & Strategies
                      </h1>
                      <p className="text-slate-400">
                        Select markets and configure strategies for each
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab("subscription")}
                        className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                      >
                        Back to Overview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        className="flex items-center gap-2 border-slate-700 text-slate-300 hover:bg-slate-800"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </header>

                {/* Market Selection */}
                <Card className="bg-slate-900/40 border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-cyan-400" />
                      Available Markets
                    </CardTitle>
                    <CardDescription>
                      Select the markets you want to receive alerts for
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(MARKET_CONFIG).map(([marketId, market]) => {
                        const isSelected = userProfile.selectedMarkets.includes(marketId);
                        const strategyCount = userProfile.marketPreferences[marketId]?.length || 0;
                        
                        return (
                          <div
                            key={marketId}
                            className={`border-2 rounded-xl p-5 transition-all duration-300 ${
                              isSelected
                                ? "border-cyan-500 bg-cyan-500/10"
                                : "border-slate-700 bg-slate-900/50"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={(e) => toggleMarket(marketId, e)}
                                  className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                                    isSelected
                                      ? "border-cyan-500 bg-cyan-500"
                                      : "border-slate-500 bg-slate-800"
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3 text-white" />}
                                </button>
                                <span className="text-2xl">{market.flag}</span>
                                <div>
                                  <h3 className="font-semibold">{market.name}</h3>
                                  <p className="text-xs text-slate-400">
                                    {strategyCount} strategies
                                  </p>
                                </div>
                              </div>
                              
                              {isSelected && strategyCount > 0 && (
                                <button
                                  onClick={(e) => handleRemoveMarket(marketId, e)}
                                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                  title="Remove all strategies"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            
                            {isSelected && (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-medium text-cyan-300">
                                    Select Strategies
                                  </h4>
                                  <button
                                    type="button"
                                    onClick={(e) => handleSelectAll(marketId, e)}
                                    className="text-xs text-cyan-400 hover:text-cyan-300"
                                  >
                                    {isAllSelected(marketId) ? "Deselect All" : "Select All"}
                                  </button>
                                </div>
                                
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                  {alertTypes.map((strategy) => {
                                    const isStrategySelected = 
                                      userProfile.marketPreferences[marketId]?.includes(strategy) || false;
                                    
                                    return (
                                      <div
                                        key={strategy}
                                        onClick={(e) => toggleStrategy(marketId, strategy, e)}
                                        className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center space-x-3 ${
                                          isStrategySelected
                                            ? "border-cyan-500 bg-cyan-500/10"
                                            : "border-slate-700 bg-slate-800/50 hover:bg-slate-700/50"
                                        }`}
                                      >
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                          isStrategySelected
                                            ? "border-cyan-500 bg-cyan-500"
                                            : "border-slate-500"
                                        }`}>
                                          {isStrategySelected && (
                                            <div className="w-1.5 h-1.5 bg-white rounded-sm" />
                                          )}
                                        </div>
                                        <span className={`text-sm ${
                                          isStrategySelected ? "text-cyan-300" : "text-slate-300"
                                        }`}>
                                          {strategy}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                            
                            {isSelected && strategyCount === 0 && (
                              <div className="text-center py-4">
                                <Target className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                                <p className="text-sm text-slate-400">
                                  No strategies selected
                                </p>
                                <p className="text-xs text-slate-500">
                                  Click strategies above to add
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Summary and Actions */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                      <h3 className="font-semibold text-white mb-2">Current Selection</h3>
                      <div className="flex items-center gap-3">
                        {userProfile.selectedMarkets.map(marketId => {
                          const market = MARKET_CONFIG[marketId];
                          const count = userProfile.marketPreferences[marketId]?.length || 0;
                          return (
                            <div key={marketId} className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full">
                              <span>{market.flag}</span>
                              <span className="text-sm">{market.name}</span>
                              <span className="text-xs bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded">
                                {count}
                              </span>
                            </div>
                          );
                        })}
                        
                        {userProfile.selectedMarkets.length === 0 && (
                          <p className="text-slate-400 italic">No markets selected</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        onClick={() => setActiveTab("subscription")}
                        variant="outline"
                        className="border-slate-700 text-slate-300 hover:bg-slate-800"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSavePreferences}
                        disabled={userProfile.selectedMarkets.length === 0}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:from-green-600 hover:to-emerald-600 disabled:opacity-50"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <p className="text-xs text-slate-400 text-center">
                      Note: Changes here will update your current preferences, but your original registration selection will remain unchanged.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-800 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-3 text-center">
          <p className="text-sm text-slate-400">
            © 2025 All rights reserved to AIFinverse.{" | "}
            <a href="/privacy-policy" className="text-cyan-400 hover:text-cyan-300 hover:underline ml-1">
              Privacy Policy
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}