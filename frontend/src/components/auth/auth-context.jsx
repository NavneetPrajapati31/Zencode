import { createContext, useState, useEffect } from "react";
import { profileAPI, authAPI } from "@/utils/api";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Check if token is expired
      if (isTokenExpired(token)) {
        localStorage.removeItem("token");
        setLoading(false);
        return;
      }
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return Date.now() > decoded.exp * 1000;
    } catch {
      return true;
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");

      // Verify token is still valid
      try {
        await authAPI.verifyToken();
      } catch (error) {
        if (error.message && error.message.includes("401")) {
          localStorage.removeItem("token");
          setUser(null);
          setLoading(false);
          return;
        }
      }

      const decoded = jwtDecode(token);
      const username = decoded.username;
      if (!username) throw new Error("No username in token");

      const userData = await profileAPI.getProfile(username);
      let user = userData || null;
      if (user && !user.role && decoded.role) {
        user = { ...user, role: decoded.role };
      }

      // Ensure avatar is included in user data
      if (user && !user.avatar) {
        user = { ...user, avatar: "" };
      }

      setUser(user);
    } catch (error) {
      console.error("[Auth] Error in fetchUserProfile:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (token) => {
    // Check if token is expired before storing
    if (isTokenExpired(token)) {
      throw new Error("Token is expired");
    }

    localStorage.setItem("token", token);
    await fetchUserProfile();
  };

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tempToken");
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
