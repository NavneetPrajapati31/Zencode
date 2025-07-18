import React, { createContext, useContext } from "react";

/**
 * @typedef {"light" | "dark"} Theme
 * @typedef {{ theme: Theme; toggleTheme: () => void }} ThemeContextType
 */

export const THEME_KEY = "zencode-theme";

export const ThemeContext = createContext(
  /** @type {ThemeContextType | undefined} */ (undefined)
);

/**
 * useTheme hook for consuming theme context
 * @returns {ThemeContextType}
 */
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
