const API_BASE = "http://localhost:5000/api/auth";

export const signUp = async (email, password) => {
  const res = await fetch(`${API_BASE}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Sign up failed");
  return data;
};

export const signIn = async (email, password) => {
  const res = await fetch(`${API_BASE}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Sign in failed");
  return data;
};

const API_BASE_PROBLEMS = "/api/problems";

export const getProblems = async () => {
  const res = await fetch(API_BASE_PROBLEMS);
  if (!res.ok) throw new Error("Failed to fetch problems");
  return res.json();
};

export const getProblemById = async (id) => {
  const res = await fetch(`${API_BASE_PROBLEMS}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch problem");
  return res.json();
};

export const createProblem = async (data, token) => {
  const res = await fetch(API_BASE_PROBLEMS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create problem");
  return res.json();
};

export const updateProblem = async (id, data, token) => {
  const res = await fetch(`${API_BASE_PROBLEMS}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update problem");
  return res.json();
};

export const deleteProblem = async (id, token) => {
  const res = await fetch(`${API_BASE_PROBLEMS}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to delete problem");
  return res.json();
};
