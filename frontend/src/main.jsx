import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "@/components/auth-context";
import ThemeProvider from "@/components/theme-context";
import Navbar from "@/components/navbar-v2";
import Footer from "@/components/footer";
import { BrowserRouter, useLocation } from "react-router-dom";
import { useMemo } from "react";

const exceptionRoutes = ["/", "/signin", "/signup", "/oauth/callback"];

const RootLayout = () => {
  const location = useLocation();
  const hideNavFooter = useMemo(
    () =>
      exceptionRoutes.includes(location.pathname) ||
      /^\/problems\/[^/]+$/.test(location.pathname),
    [location.pathname]
  );

  return (
    <div className="font-inter min-h-screen bg-background text-foreground theme-transition">
      <ThemeProvider>
        <AuthProvider>
          {!hideNavFooter && <Navbar />}
          <App />
          {!hideNavFooter && <Footer />}
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <RootLayout />
    </BrowserRouter>
  </StrictMode>
);
