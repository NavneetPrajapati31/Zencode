// API utility functions for your MERN backend

const API_BASE_URL = "http://localhost:5000/api";

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "API call failed");
    }
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Authentication API calls
export const authAPI = {
  signup: (userData) =>
    apiCall("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  signin: (credentials) =>
    apiCall("/auth/signin", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
};

// Problems API calls
export const problemsAPI = {
  getAll: () => apiCall("/problems"),
  getById: (id) => apiCall(`/problems/${id}`),
  create: (problemData) =>
    apiCall("/problems", {
      method: "POST",
      body: JSON.stringify(problemData),
    }),
  update: (id, problemData) =>
    apiCall(`/problems/${id}`, {
      method: "PUT",
      body: JSON.stringify(problemData),
    }),
  delete: (id) =>
    apiCall(`/problems/${id}`, {
      method: "DELETE",
    }),
};

// Protected API calls (for user info, etc.)
export const protectedAPI = {
  getProtected: () => apiCall("/protected"),
};
