import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";

import NotFound from "@/pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";


// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Home from "./pages/Home";
import About from "./pages/About";
import Signals from "./pages/Signals";
import Live_Alerts_India from "@/pages/Live_Alerts_India";
import Live_Alerts_US from "@/pages/Live_Alerts_US";
import Alerts from "./pages/Alerts";
import Newsletter from "./pages/Newsletter";
import Learning from "./pages/Learning";
import RiskProfiling from "./pages/RiskProfiling";
import Affiliates from "./pages/Affiliates";
import Contact from "./pages/Contact";
import Profile from "./pages/profile";
import Telegram from "./pages/telegram";
import AlertsIndia from "./pages/alerts-india";
import AlertsUS from "./pages/alerts-us";


function Router() {
  return (
    <Switch>
      {/* Public Pages */}
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Registration} />

      {/* Main Pages */}
      <Route path="/home" component={Home} />
      <Route path="/signals" component={Signals} />

      {/* Live Alerts */}
      <Route path="/live-alerts-india" component={Live_Alerts_India} />
      <Route path="/live-alerts-us" component={Live_Alerts_US} />

      {/* Other Pages */}
      <Route path="/alerts" component={Alerts} />
      <Route path="/newsletter" component={Newsletter} />
      <Route path="/learning" component={Learning} />
      <Route path="/risk-profiling" component={RiskProfiling} />
      <Route path="/affiliates" component={Affiliates} />
      <Route path="/contact" component={Contact} />
      <Route path="/telegram" component={Telegram} />
      <Route path="/profile" component={Profile} />
      <Route path="/alerts-india" component={AlertsIndia} />
      <Route path="/alerts-us" component={AlertsUS} />
      <Route path="/about" component={About} />

      {/* Fallback */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
