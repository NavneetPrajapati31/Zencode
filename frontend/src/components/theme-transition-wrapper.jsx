import React from "react";
import { useTheme } from "./theme-context-utils";

/**
 * ThemeTransitionWrapper - A utility component that applies theme transition classes
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to wrap
 * @param {"fast" | "normal" | "slow" | "preserve" | "preserve-fast" | "preserve-slow"} props.speed - Transition speed
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 */
const ThemeTransitionWrapper = ({
  children,
  speed = "normal",
  className = "",
  style = {},
  ...props
}) => {
  const { isTransitioning } = useTheme();

  const transitionClass = {
    fast: "theme-transition-fast",
    normal: "theme-transition",
    slow: "theme-transition-slow",
    preserve: "theme-transition-preserve",
    "preserve-fast": "theme-transition-preserve-fast",
    "preserve-slow": "theme-transition-preserve-slow",
  }[speed];

  const transitionStateClass = isTransitioning ? "opacity-90" : "";

  return (
    <div
      className={`${transitionClass} ${transitionStateClass} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

export default ThemeTransitionWrapper;
