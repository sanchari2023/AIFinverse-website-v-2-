// components/PremiumLockModal.tsx
import { useState } from "react";
import { useLocation } from "wouter";
import { X, Lock, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PremiumLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  featureDescription: string;
}

export default function PremiumLockModal({
  isOpen,
  onClose,
  featureName,
  featureDescription,
}: PremiumLockModalProps) {
  const [, setLocation] = useLocation();
  const [showPricing, setShowPricing] = useState(false);

  if (!isOpen) return null;

  const handleLogin = () => {
    // Store the attempted premium feature
    sessionStorage.setItem('premiumFeatureAttempted', 'true');
    sessionStorage.setItem('premiumFeatureName', featureName);
    onClose();
    setLocation("/login");
  };

  const handleRegister = () => {
    // Store the attempted premium feature
    sessionStorage.setItem('premiumFeatureAttempted', 'true');
    sessionStorage.setItem('premiumFeatureName', featureName);
    onClose();
    setLocation("/register");
  };

  const premiumFeatures = [
    "Live Alerts for US & Indian Markets",
    "Real-time Market Intelligence",
    "Advanced Analytics Dashboard",
    "Custom Alert Configurations",
    "Priority Customer Support",
    "Historical Data Analysis"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl mx-4">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Premium Feature Locked
                  </h2>
                  <p className="text-slate-400">Upgrade to access {featureName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2">
            {/* Left Column - Feature Info */}
            <div className="p-8 border-r border-slate-700">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-3">
                  {featureName}
                </h3>
                <p className="text-slate-300">{featureDescription}</p>
              </div>

              <div className="space-y-4 mb-8">
                <h4 className="text-lg font-semibold text-white">
                  What you'll get:
                </h4>
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    <span className="text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleLogin}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                >
                  Log In
                </Button>
                <Button
                  onClick={handleRegister}
                  className="flex-1 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
                  variant="outline"
                >
                  Register
                </Button>
              </div>
            </div>

            {/* Right Column - Pricing */}
            <div className="p-8">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 mb-4">
                  <Star className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-medium text-cyan-300">
                    MOST POPULAR
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Premium Plan
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold text-white">$29</span>
                  <span className="text-slate-400">/month</span>
                </div>
                <p className="text-slate-400 mb-6">
                  Full access to all premium features including Live Alerts
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => {
                    onClose();
                    setLocation("/upgrade");
                  }}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 py-3 text-lg font-semibold"
                >
                  Upgrade to Premium
                </Button>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  className="w-full text-slate-400 hover:text-white"
                >
                  Continue Exploring Free Features
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-700">
                <p className="text-sm text-slate-500 text-center">
                  Start with free features, upgrade anytime
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}