import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "@/components/auth-context";

// Set default theme to dark before React renders
if (typeof document !== "undefined") {
  document.documentElement.classList.add("dark");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
