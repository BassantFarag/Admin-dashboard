import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";

const ProtectedRoute = () => {
  const { token, isLoading } = useContext(AuthContext);
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;