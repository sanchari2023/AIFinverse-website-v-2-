// pages/Upgrade.tsx
import { useLocation } from "wouter";
import { CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Upgrade() {
  const [, setLocation] = useLocation();

  const features = [
    "Live Alerts for US & Indian Markets",
    "Real-time Market Data Streaming",
    "Advanced Analytics Dashboard",
    "Custom Alert Configurations",
    "Priority Customer Support",
    "Historical Data Analysis"
  ];

  const handleUpgrade = () => {
    localStorage.setItem("userPlan", "premium");
    // Redirect back or to alerts
    const redirect = sessionStorage.getItem('redirectAfterLogin') || "/alerts-us";
    setLocation(redirect);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Upgrade to Premium</h1>
          <p className="text-xl text-gray-300">
            Unlock real-time Live Alerts and advanced market intelligence
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-2xl font-bold mb-4">Basic</h3>
              <p className="text-gray-400 mb-6">Free access to public features</p>
              <div className="space-y-3 mb-8">
                <p className="text-gray-300">✓ Market Signals</p>
                <p className="text-gray-300">✓ Learning Resources</p>
                <p className="text-gray-500 line-through">Live Alerts</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setLocation("/")}
              >
                Continue with Basic
              </Button>
            </div>
          </div>

          <div className="bg-gradient-to-b from-cyan-900/30 to-blue-900/30 rounded-2xl p-8 border-2 border-cyan-500 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-cyan-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                RECOMMENDED
              </span>
            </div>
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold text-white">$29</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="text-gray-300 mb-6">Full access to all features</p>
            </div>
            
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-400" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
            
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 py-3 text-lg"
            >
              Upgrade to Premium
            </Button>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/")}
            className="text-gray-400 hover:text-white"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}