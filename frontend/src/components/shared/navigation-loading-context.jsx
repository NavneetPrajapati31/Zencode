import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { useLocation } from "react-router-dom";
import LoadingScreen from "./loading-screen";

const NavigationLoadingContext = createContext();

export const useNavigationLoading = () => {
  const context = useContext(NavigationLoadingContext);
  if (!context) {
    throw new Error(
      "useNavigationLoading must be used within NavigationLoadingProvider"
    );
  }
  return context;
};

export const NavigationLoadingProvider = ({ children }) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const location = useLocation();
  const isInitialMount = useRef(true);
  const previousLocation = useRef(location.pathname);

  // Show loading screen when location changes (but not on initial mount)
  useEffect(() => {
    // Skip the first render to avoid showing loading on initial page load
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousLocation.current = location.pathname;
      return;
    }

    // Only show loading if we're actually navigating to a different route
    if (location.pathname !== previousLocation.current) {
      setIsNavigating(true);
      setLoadingMessage("Loading...");

      // Hide loading screen after a short delay to ensure smooth transitions
      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 800); // Adjust this delay as needed

      previousLocation.current = location.pathname;
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const showLoading = (message = "Loading...") => {
    setLoadingMessage(message);
    setIsNavigating(true);
  };

  const hideLoading = () => {
    setIsNavigating(false);
  };

  const value = {
    isNavigating,
    loadingMessage,
    showLoading,
    hideLoading,
  };

  return (
    <NavigationLoadingContext.Provider value={value}>
      {children}
      {isNavigating && (
        <LoadingScreen message={loadingMessage} showLogo={true} />
      )}
    </NavigationLoadingContext.Provider>
  );
};
