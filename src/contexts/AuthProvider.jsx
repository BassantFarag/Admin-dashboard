import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import api from "../api/axios";

const AuthProvider = ({ children }) => {
    const tokenStorage = localStorage.getItem("token");

    const [token, setToken] = useState(tokenStorage ? tokenStorage : null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
        if (token) {
            try {
            const response = await api.get("/auth/me");
            setUser(response.data.user);
            } catch (error) {
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
            }
        }
            setIsLoading(false);
        };
        fetchUser();
    }, [token]);

    const login = async (email, password) => {
        try {
        const response = await api.post("/auth/login", {
            email,
            password,
        });

        localStorage.setItem("token", response.data.token);

        setToken(response.data.token);
        setUser(response.data.user);

        return response.data;
        } catch (error) {
        throw error;
        }
    };
    
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
        <AuthContext.Provider value={{ user, token, login, logout ,isLoading }}>
        {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
