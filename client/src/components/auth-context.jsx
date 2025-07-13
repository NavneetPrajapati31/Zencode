import { createContext, useState, useEffect } from "react";
import { userAPI, authAPI } from "@/utils/api";

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
      const userData = await userAPI.getProfile();
      setUser(userData);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (token) => {
    localStorage.setItem("token", token);
    await fetchUserProfile();
  };

  const logout = async () => {
    await authAPI.logout().catch(() => {});
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
