import api from "./axios";

// Login
export const login = (payload) => {
  return api.post("/auth/login", payload);
};

// Logout
export const logout = () => {
  return api.post("/auth/logout");
};

// Get current authenticated user
export const authMe = () => api.get("/auth/me");

// Test admin access
export const adminTest = () => api.get("/auth/admin-test");

// Change user role
export const changeRole = (payload) =>
  api.patch("/auth/change-role", payload);