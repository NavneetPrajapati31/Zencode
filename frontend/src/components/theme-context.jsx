import React, { useState, useEffect } from "react";
import { ThemeContext, THEME_KEY } from "./theme-context-utils";

/**
 * ThemeProvider wraps the app and provides theme state and toggler.
 * @param {{ children: React.ReactNode }} props
 */
const ThemeProvider = ({ children }) => {
  // Apply theme immediately before React renders
  const initialTheme = (() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === "light" || stored === "dark") {
        // Apply theme immediately
        if (stored === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        return stored;
      }
      // Default: dark theme
      document.documentElement.classList.add("dark");
      return "dark";
    }
    return "dark";
  })();

  const [theme, setTheme] = useState(initialTheme);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Apply theme changes and save to localStorage
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Mark as initialized after first render to enable transitions
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100); // Small delay to ensure theme is applied

    return () => clearTimeout(timer);
  }, []);

  /** Toggle between light and dark theme with smooth transition */
  const toggleTheme = () => {
    // Only allow transitions after initialization
    if (!isInitialized) return;

    setIsTransitioning(true);

    // Add a small delay to ensure the transition is visible
    setTimeout(() => {
      setTheme((prev) => (prev === "dark" ? "light" : "dark"));

      // Reset transition state after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300); // Match the CSS transition duration
    }, 50);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, isTransitioning, isInitialized }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
