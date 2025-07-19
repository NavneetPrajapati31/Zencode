import { createContext, useState, useEffect } from "react";
import { profileAPI } from "@/utils/api";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");
      const decoded = jwtDecode(token);
      const username = decoded.username;
      if (!username) throw new Error("No username in token");
      const userData = await profileAPI.getProfile(username);
      let user = userData.user || null;
      if (user && !user.role && decoded.role) {
        user = { ...user, role: decoded.role };
      }
      setUser(user);
      console.log("[Auth] User loaded from backend:", userData.user);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (token) => {
    localStorage.setItem("token", token);
    // Debug: decode and log user from token
    try {
      const decoded = jwtDecode(token);
      console.log("[Auth] Decoded user from JWT:", decoded);
    } catch {
      console.log("[Auth] Could not decode JWT");
    }
    await fetchUserProfile();
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
