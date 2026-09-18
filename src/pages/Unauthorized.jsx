import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const handleBackToLogin = async () => {
    setLoading(true);
    await logout();
    navigate("/login", { replace: true });
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-main px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary">Access Denied</h1>
        <p className="mt-2 text-sm text-secondary">
          You do not have permission to access this page.
        </p>
        <button
          type="button"
          onClick={handleBackToLogin}
          disabled={loading}
          className="mt-6 rounded-full bg-[#b88322] px-8 py-2.5 text-sm font-bold text-white transition hover:bg-[#d9a441] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing out..." : "Back to login"}
        </button>
      </div>
    </div>
  );
};
export default Unauthorized;