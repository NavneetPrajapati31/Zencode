import React from "react";
import { useTheme } from "@/components/theme-context-utils";
import { Code2, Loader2 } from "lucide-react";

/**
 * LoadingScreen - A full-screen loading component that appears during page redirects
 * @param {Object} props
 * @param {string} props.message - Optional loading message
 * @param {boolean} props.showLogo - Whether to show the logo (default: true)
 * @param {string} props.className - Additional CSS classes
 */
const LoadingScreen = ({
  message = "Loading...",
  showLogo = true,
  className = "",
}) => {
  const { theme } = useTheme();

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background !no-scrollbar ${className}`}
    >
      <div className="flex flex-col items-center space-y-6 p-8">
        {/* Logo */}
        {/* {showLogo && (
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
              <Code2 className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Zencode
              </span>
              <span className="text-xs text-muted-foreground -mt-1">
                Code Arena
              </span>
            </div>
          </div>
        )} */}

        {/* Spinner */}
        <div className="relative">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
