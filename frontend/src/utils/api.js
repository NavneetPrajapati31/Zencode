// API utility functions for your MERN backend

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Token refresh function
const refreshTokenIfNeeded = async (token) => {
  try {
    // Import jwtDecode dynamically to avoid issues
    const { jwtDecode } = await import("jwt-decode");
    const decoded = jwtDecode(token);
    const timeUntilExpiry = decoded.exp * 1000 - Date.now();

    // If token expires in less than 1 hour, refresh it
    if (timeUntilExpiry < 60 * 60 * 1000) {
      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const { token: newToken } = await response.json();
        localStorage.setItem("token", newToken);
        return newToken;
      }
    }

    return token;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return token;
  }
};

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  let token =
    localStorage.getItem("token") || localStorage.getItem("tempToken");

  // Check if token needs refresh
  if (token) {
    token = await refreshTokenIfNeeded(token);
  }

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

    // Handle 401 responses (token expired/invalid)
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("tempToken");
      // Redirect to login
      window.location.href = "/signin";
      return;
    }

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
  forgotPassword: (email) =>
    apiCall("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token, password) =>
    apiCall("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }),
  validateResetToken: (token) =>
    apiCall(`/auth/validate-reset-token/${token}`, {
      method: "GET",
    }),
  verifyOTP: (email, otp) =>
    apiCall("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    }),
  resendOTP: (email) =>
    apiCall("/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  completeProfile: (profileData) =>
    apiCall("/auth/complete-profile", {
      method: "POST",
      body: JSON.stringify(profileData),
    }),
  // Add token verification and refresh endpoints
  verifyToken: () => apiCall("/auth/verify-token", { method: "POST" }),
  refreshToken: () => apiCall("/auth/refresh-token", { method: "POST" }),
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
  getTotalCount: () => apiCall("/problems/count"),
  bulkCreate: (problemsArray) =>
    apiCall("/problems/bulk", {
      method: "POST",
      body: JSON.stringify(problemsArray),
    }),
};

// Problem Details API calls
export const problemDetailsAPI = {
  getAll: () => apiCall("/problem-details"),
  getById: (id) => apiCall(`/problem-details/${id}`),
  getByProblemId: (problemId) =>
    apiCall(`/problem-details/problem/${problemId}`),
  getFullProblem: (problemId) => apiCall(`/problem-details/full/${problemId}`),
  create: (detailsData) =>
    apiCall("/problem-details", {
      method: "POST",
      body: JSON.stringify(detailsData),
    }),
  update: (id, detailsData) =>
    apiCall(`/problem-details/${id}`, {
      method: "PUT",
      body: JSON.stringify(detailsData),
    }),
  delete: (id) =>
    apiCall(`/problem-details/${id}`, {
      method: "DELETE",
    }),
};

// Test Cases API calls
export const testCasesAPI = {
  getAll: () => apiCall("/testcases"),
  getById: (id) => apiCall(`/testcases/${id}`),
  getByProblemId: (problemId) => apiCall(`/testcases/problem/${problemId}`),
  create: (testCaseData) =>
    apiCall("/testcases", {
      method: "POST",
      body: JSON.stringify(testCaseData),
    }),
  update: (id, testCaseData) =>
    apiCall(`/testcases/${id}`, {
      method: "PUT",
      body: JSON.stringify(testCaseData),
    }),
  delete: (id) =>
    apiCall(`/testcases/${id}`, {
      method: "DELETE",
    }),
};

// Submissions API calls
export const submissionsAPI = {
  getAll: () => apiCall("/submission"),
  getById: (id) => apiCall(`/submission/${id}`),
  getByProblemId: (problemId) => apiCall(`/submission/problem/${problemId}`),
  create: (submissionData) =>
    apiCall("/submission", {
      method: "POST",
      body: JSON.stringify(submissionData),
    }),
  update: (id, submissionData) =>
    apiCall(`/submission/${id}`, {
      method: "PUT",
      body: JSON.stringify(submissionData),
    }),
  delete: (id) =>
    apiCall(`/submission/${id}`, {
      method: "DELETE",
    }),
};

// Profile API calls
export const profileAPI = {
  getProfile: (username) => apiCall(`/profile/${username}`),
  getHeatmap: (username) => apiCall(`/profile/${username}/heatmap`),
  updateSocialProfiles: (username, socialProfiles) =>
    apiCall(`/profile/${username}/social`, {
      method: "PUT",
      body: JSON.stringify(socialProfiles),
    }),
  patchPublicProfile: ({ isPublicProfile }) =>
    apiCall(`/profile/public`, {
      method: "PATCH",
      body: JSON.stringify({ isPublicProfile: !!isPublicProfile }),
    }),
  getPublicProfile: (username) => apiCall(`/profile/public/${username}`),
  updateBasicInfo: (basicInfo) =>
    apiCall(`/profile/basic`, {
      method: "PATCH",
      body: JSON.stringify(basicInfo),
    }),
  changePassword: ({ oldPassword, newPassword }) =>
    apiCall(`/profile/password`, {
      method: "PATCH",
      body: JSON.stringify({ oldPassword, newPassword }),
    }),
};

// Compiler API calls
export const compilerAPI = {
  runCode: async ({ language, code }) => {
    const compilerUrl = import.meta.env.VITE_COMPILER_URL;
    const response = await fetch(`${compilerUrl}/compiler`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, code }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        typeof data.error === "string"
          ? data.error
          : JSON.stringify(data.error || "Code execution failed", null, 2)
      );
    }
    return data;
  },
};

// Leaderboard API calls
export const leaderboardAPI = {
  getRank: (username) => apiCall(`/leaderboard/${username}`),
};

// Submissions API calls
export const submissionAPI = {
  getUserSubmissions: (username) => apiCall(`/submission/user/${username}`),
};

// Progress stats API (if available)
export const progressAPI = {
  getUserProgress: (username) => apiCall(`/profile/${username}/progress`),
};
