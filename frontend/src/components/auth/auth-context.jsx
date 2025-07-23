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
      // console.log("[Auth] fetchUserProfile called");
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");

      // console.log("[Auth] Token found, decoding...");
      const decoded = jwtDecode(token);
      // console.log("[Auth] Decoded token:", decoded);

      const username = decoded.username;
      if (!username) throw new Error("No username in token");

      /*   console.log(
        "[Auth] Calling profileAPI.getProfile for username:",
        username
      ); */
      const userData = await profileAPI.getProfile(username);
      // console.log("[Auth] Profile API response:", userData);

      let user = userData || null;
      if (user && !user.role && decoded.role) {
        user = { ...user, role: decoded.role };
      }

      // Ensure avatar is included in user data
      if (user && !user.avatar) {
        user = { ...user, avatar: "" };
      }

      // console.log("[Auth] Setting user state:", user);
      setUser(user);
      // console.log("[Auth] User loaded from backend:", user);
    } catch (error) {
      console.error("[Auth] Error in fetchUserProfile:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      // console.log("[Auth] Setting loading to false");
      setLoading(false);
    }
  };

  const login = async (token) => {
    localStorage.setItem("token", token);
    // Debug: decode and log user from token
    try {
      const decoded = jwtDecode(token);
      // console.log("[Auth] Decoded user from JWT:", decoded);
    } catch {
      // console.log("[Auth] Could not decode JWT");
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
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
