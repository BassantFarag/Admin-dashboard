import { useEffect, useState } from "react";
import { login as loginApi, logout as logoutApi, authMe } from "../api/authApi";
import AuthContext from "./AuthContext";
const AuthProvider = ({ children }) => {
  const tokenStorage = localStorage.getItem("token");

  const [token, setToken] = useState(tokenStorage);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await authMe();
          setUser(response.data.user);
        } catch {
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        } finally {
          setIsLoading(false); 
        }
      } else {
          setIsLoading(false); 
      }
    };

    fetchUser();
  }, []); 

  const login = async (email, password) => {
    const response = await loginApi({ email, password });

    if (response.data.user?.role !== "admin") {
      const err = new Error(
        "This account doesn't have admin access. Only administrators can sign in here."
      );
      err.code = "NOT_ADMIN";
      throw err;
    }

    localStorage.setItem("token", response.data.token);
    setToken(response.data.token);
    setUser(response.data.user);

    return response.data;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;