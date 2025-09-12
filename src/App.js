import React, { useEffect } from "react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./auth/AuthProvider";
import { setNavigator } from "./utils/navigationService";
import { useLanguageInitialization } from "./hooks/useLanguageInitialization";

const AppContent = () => {
  const navigate = useNavigate();
  
  // Initialize language and HTML attributes
  useLanguageInitialization();

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

function App() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;