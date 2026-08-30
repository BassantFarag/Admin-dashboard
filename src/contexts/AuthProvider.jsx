import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import api from "../api/axios";

const AuthProvider = ({ children }) => {
  const tokenStorage = localStorage.getItem("token");

  const [token, setToken] = useState(tokenStorage);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verify the stored token and restore the authenticated user on initial load.
  useEffect(() => {
    const fetchUser = async () => {
      if (tokenStorage) {
        try {
          const response = await api.get("/auth/me");
          setUser(response.data.user);
        } catch {
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    fetchUser();
  }, [tokenStorage]);

  // Authenticate the user and store the token and user data.
  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", response.data.token);
    setToken(response.data.token);
    setUser(response.data.user);

    return response.data;
  };

  // Log out the user and clear the authentication state.
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  };

  return (
    // Expose authentication state and actions to the application.
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
