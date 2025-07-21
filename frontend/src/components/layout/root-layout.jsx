import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import App from "@/App";
import { NavigationLoadingProvider } from "@/components/shared/navigation-loading-context";
import Navbar from "./navbar-v2";
import Footer from "./footer";

const exceptionRoutes = [
  "/",
  "/signin",
  "/signup",
  "/oauth/callback",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/verify-otp",
];

export const RootLayout = () => {
  const location = useLocation();
  const hideNavFooter = useMemo(
    () =>
      exceptionRoutes.includes(location.pathname) ||
      /^\/problems\/[^/]+$/.test(location.pathname),
    [location.pathname]
  );

  return (
    <div className="font-inter min-h-screen bg-background text-foreground theme-transition">
      <NavigationLoadingProvider>
        {!hideNavFooter && <Navbar />}
        <App />
        {!hideNavFooter && <Footer />}
      </NavigationLoadingProvider>
    </div>
  );
};
