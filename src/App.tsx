
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import UserManagement from "./pages/UserManagement";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import VisitRequest from "./pages/VisitRequest";
import VisitStatus from "./pages/VisitStatus";
import ManageVisits from "./pages/ManageVisits";
import WhatsApp from "./pages/WhatsApp";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import PublicHome from "./pages/PublicHome";
import Contact from "./pages/Contact";
import { VisitProvider } from "./context/VisitContext";
import { ThemeProvider } from "./components/ThemeProvider";
import GlobalLoader from "@/components/ui/GlobalLoader";
import CookieBanner from "./components/cookies/CookieBanner";

const queryClient = new QueryClient();

import "./global-loader.css";

const AppContent = () => {
  const location = useLocation();
  
  // Define public routes that should force light mode
  const publicRoutes = ['/', '/contact', '/request'];
  const isPublicRoute = publicRoutes.includes(location.pathname);
  
  // Detecta carregamento global (exemplo: pode ser aprimorado para detectar loading de dados nas rotas)
  const [globalLoading, setGlobalLoading] = React.useState(false);
  React.useEffect(() => {
    const handleStart = () => setGlobalLoading(true);
    const handleEnd = () => setGlobalLoading(false);
    window.addEventListener("route-loading-start", handleStart);
    window.addEventListener("route-loading-end", handleEnd);
    return () => {
      window.removeEventListener("route-loading-start", handleStart);
      window.removeEventListener("route-loading-end", handleEnd);
    };
  }, []);

  return (
    <ThemeProvider defaultTheme="system" forceLight={isPublicRoute}>
      <TooltipProvider>
        <VisitProvider>
          <GlobalLoader loading={globalLoading} />
          <div className="min-h-screen">
            <SwitchTransition mode="out-in">
              <CSSTransition
                key={location.pathname}
                timeout={300}
                classNames="page"
                unmountOnExit
                onEnter={() => window.dispatchEvent(new Event("route-loading-start"))}
                onEntered={() => window.dispatchEvent(new Event("route-loading-end"))}
                onExit={() => window.dispatchEvent(new Event("route-loading-start"))}
                onExited={() => window.dispatchEvent(new Event("route-loading-end"))}
              >
                <div className="h-full w-full">
                  <Routes location={location}>
                    <Route path="/" element={<PublicHome />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/users" element={<UserManagement />} />
                    <Route path="/request" element={<VisitRequest />} />
                    <Route path="/status/:id" element={<VisitStatus />} />
                    <Route path="/manage" element={<ManageVisits />} />
                    <Route path="/whatsapp" element={<WhatsApp />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </CSSTransition>
            </SwitchTransition>
          </div>
          <Toaster />
          <Sonner />
          <CookieBanner />
        </VisitProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

import "./page-transitions.css";
export default App;
